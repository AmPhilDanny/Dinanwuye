import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonInput,
  IonText,
  IonSpinner,
  IonToast,
  IonFooter,
} from '@ionic/react';
import { ArrowLeft, PaperPlaneRight, Image, DotsThreeOutline, ShieldCheck } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { messagingApi, profileApi } from '@services/api';
import { ConversationDetailSchema, MessagesPageSchema, MessageSchema } from '@utils/schemas';
import { photoUrl } from '@utils/photoUrl';
import useAppStore from '@store/useAppStore';
import {
  getChatSocket,
  joinConversationRoom,
  sendSocketMessage,
  emitTyping,
  emitRead,
  onSocketEvent,
  disconnectChatSocket,
} from '@services/socket';

const PAGE_SIZE = 50;

const timeLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const authUser = useAppStore((s) => s.auth.user);
  const myUserId = authUser?.userId;

  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', color: 'danger' });

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const appendMessage = useCallback((msg) => {
    setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleNewMessage = useCallback(
    (msg) => {
      appendMessage(msg);
      if (msg.senderId !== myUserId) {
        emitRead(conversationId, [msg.id]);
      }
    },
    [appendMessage, myUserId, conversationId]
  );

  const handleRead = useCallback(({ messageIds }) => {
    if (!messageIds?.length) return;
    setMessages((prev) =>
      prev.map((m) => (messageIds.includes(m.id) && !m.readAt ? { ...m, readAt: new Date().toISOString() } : m))
    );
  }, []);

  const handleTyping = useCallback(
    ({ userId, typing }) => {
      if (userId === myUserId) return;
      setOtherTyping(typing);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (typing) {
        typingTimerRef.current = setTimeout(() => setOtherTyping(false), 2500);
      }
    },
    [myUserId]
  );

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      disconnectChatSocket();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const [convRes, msgsRes] = await Promise.all([
          messagingApi.getConversation(conversationId),
          messagingApi.getMessages(conversationId, { limit: PAGE_SIZE }),
        ]);
        if (cancelled) return;
        const conv = ConversationDetailSchema.parse(convRes.data);
        const page = MessagesPageSchema.parse(msgsRes.data);

        const otherId = conv.userAId === myUserId ? conv.userBId : conv.userAId;
        setMessages(page.items);
        setNextCursor(page.nextCursor || null);
        setHasMore(page.hasMore);

        profileApi
          .getPublic(otherId)
          .then(({ data }) => {
            if (!cancelled) setOtherUser(data);
          })
          .catch(() => {});

        const unreadIds = page.items
          .filter((m) => m.senderId === otherId && !m.readAt)
          .map((m) => m.id);
        if (unreadIds.length) {
          emitRead(conversationId, unreadIds);
        }
      } catch (err) {
        if (!cancelled) {
          setToast({
            open: true,
            message: err?.response?.data?.message || err?.message || 'Could not load conversation',
            color: 'danger',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    const socket = getChatSocket();
    const unsubConnected = onSocketEvent('connect', () => setSocketConnected(true));
    const unsubDisconnected = onSocketEvent('disconnect', () => setSocketConnected(false));
    const unsubNewMessage = onSocketEvent('message:new', handleNewMessage);
    const unsubRead = onSocketEvent('read', handleRead);
    const unsubTyping = onSocketEvent('typing', handleTyping);

    if (socket.connected) {
      setSocketConnected(true);
      joinConversationRoom(conversationId);
    } else {
      const unsubConnect = onSocketEvent('connect', () => joinConversationRoom(conversationId));
      return () => {
        cancelled = true;
        unsubConnected();
        unsubDisconnected();
        unsubNewMessage();
        unsubRead();
        unsubTyping();
        unsubConnect();
      };
    }

    return () => {
      cancelled = true;
      unsubConnected();
      unsubDisconnected();
      unsubNewMessage();
      unsubRead();
      unsubTyping();
    };
  }, [conversationId, myUserId, handleNewMessage, handleRead, handleTyping]);

  const loadOlder = async () => {
    if (!hasMore || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const { data } = await messagingApi.getMessages(conversationId, {
        cursor: nextCursor,
        limit: PAGE_SIZE,
      });
      const page = MessagesPageSchema.parse(data);
      setMessages((prev) => [...page.items, ...prev]);
      setNextCursor(page.nextCursor || null);
      setHasMore(page.hasMore);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || err?.message || 'Could not load older messages',
        color: 'danger',
      });
    } finally {
      setLoadingOlder(false);
    }
  };

  const handleInputChange = (value) => {
    setInput(value ?? '');
    const socket = getChatSocket();
    if (socket.connected) {
      emitTyping(conversationId, true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => emitTyping(conversationId, false), 1500);
    }
  };

  const send = async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    emitTyping(conversationId, false);

    const socket = getChatSocket();
    if (socket.connected) {
      sendSocketMessage(conversationId, content);
      return;
    }
    setSending(true);
    try {
      const { data } = await messagingApi.sendMessage(conversationId, content);
      const msg = MessageSchema.parse(data);
      appendMessage(msg);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || err?.message || 'Could not send message',
        color: 'danger',
      });
    } finally {
      setSending(false);
    }
  };

  const avatarUrl = photoUrl(otherUser?.photos?.[0]?.s3Key);

  return (
    <IonPage>
      {/* Premium header — outside IonContent so it's always visible */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200/70 bg-surface/95 px-4 py-3 backdrop-blur-xl dark:border-gray-800 dark:bg-onyx/95">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 active:scale-90 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={20} weight="bold" />
        </button>
        <div className="flex flex-1 items-center gap-2.5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={otherUser?.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
              {(otherUser?.name || '?')[0]}
            </div>
          )}
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">
              {otherUser ? `${otherUser.name || 'Match'}${otherUser.age ? `, ${otherUser.age}` : ''}` : 'Chat'}
            </p>
            {socketConnected ? (
              <p className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </p>
            ) : (
              <p className="text-[11px] text-gray-400">Offline</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {otherUser?.is_verified && (
            <span className="flex items-center gap-1 rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
              <ShieldCheck size={10} weight="fill" /> Verified
            </span>
          )}
          <button aria-label="More options" className="grid h-9 w-9 place-items-center rounded-full text-gray-500 transition hover:bg-gray-100 active:scale-90 dark:text-gray-400 dark:hover:bg-gray-800">
            <DotsThreeOutline size={20} weight="fill" />
          </button>
        </div>
      </div>

      <IonContent className="ion-padding">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <IonSpinner name="crescent" />
          </div>
        ) : (
          <div>
            {hasMore && (
              <div className="text-center py-2">
                <IonButton size="small" fill="outline" color="primary" onClick={loadOlder} disabled={loadingOlder}>
                  {loadingOlder ? <IonSpinner name="crescent" /> : 'Load earlier'}
                </IonButton>
              </div>
            )}

            {messages.map((msg, i) => {
              const mine = msg.senderId === myUserId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.015, 0.3) }}
                  className={`flex mb-2 ${mine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${mine ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block px-4 py-2.5 rounded-2xl text-sm ${
                        mine
                          ? 'bg-gradient-to-br from-primary to-primary-pressed text-white rounded-br-sm shadow-sm shadow-primary/20'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-gray-400">
                      <span>{timeLabel(msg.createdAt)}</span>
                      {mine && msg.readAt && (
                        <span className="text-secondary font-semibold">read</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {otherTyping && (
              <div className="flex mb-2">
                <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl text-sm">
                  {otherUser?.name || 'Match'} is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </IonContent>

      <IonFooter className="ion-no-border">
        <div className="flex items-center gap-2 border-t border-gray-100 bg-surface px-3 py-3 dark:border-gray-800 dark:bg-onyx">
          <button aria-label="Attach image" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-gray-400 transition hover:bg-gray-100 active:scale-90 dark:text-gray-500 dark:hover:bg-gray-800">
            <Image size={20} weight="bold" />
          </button>
          <IonInput
            placeholder="Message"
            value={input}
            onIonChange={(e) => handleInputChange(e.detail.value ?? '')}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            className="flex-1"
            style={{
              '--border-radius': 'var(--radius-full)',
              '--padding-start': 'var(--space-4)',
              '--padding-end': 'var(--space-4)',
              '--background': 'var(--color-background)',
              '--border-color': 'var(--color-gray-200)',
            }}
          />
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={send}
            disabled={!input.trim() || sending}
            aria-label="Send"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/30 transition active:scale-90 disabled:opacity-40"
          >
            {sending ? <IonSpinner name="crescent" color="light" /> : <PaperPlaneRight size={18} weight="fill" />}
          </motion.button>
        </div>
      </IonFooter>

      <IonToast
        isOpen={toast.open}
        onDidDismiss={() => setToast({ ...toast, open: false })}
        message={toast.message}
        duration={4000}
        position="bottom"
        color={toast.color}
      />
    </IonPage>
  );
};

export default Chat;
