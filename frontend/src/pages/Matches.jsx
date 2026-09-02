import React, { useCallback, useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonAvatar,
  IonLabel,
  IonText,
  IonSpinner,
  IonToast,
  IonBadge,
} from '@ionic/react';
import { heartOutline, personAddOutline, chatbubblesOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { matchingApi, messagingApi, profileApi } from '@services/api';
import { MatchSchema, ConversationSummarySchema } from '@utils/schemas';
import { photoUrl } from '@utils/photoUrl';
import HeaderNav from '@components/HeaderNav';
import BottomNav from '@components/BottomNav';
import ChatAndDates from '@components/ChatAndDates';

const initials = (name) =>
  (name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString();
};

const Matches = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', color: 'danger' });

  const [streak, setStreak] = useState(0);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      const [matchesRes, convsRes] = await Promise.all([
        matchingApi.getMatches(),
        messagingApi.listConversations(),
      ]);
      const matches = MatchSchema.array().parse(matchesRes.data);
      const conversations = ConversationSummarySchema.array().parse(convsRes.data);
      const convByUser = new Map(conversations.map((c) => [c.otherUserId, c]));

      const otherIds = [...new Set(matches.map((m) => m.user_id))];
      const profiles = await Promise.all(
        otherIds.map((id) =>
          profileApi
            .getPublic(id)
            .then(({ data }) => data)
            .catch(() => null)
        )
      );
      const profileById = new Map(otherIds.map((id, i) => [id, profiles[i]]));

      const merged = matches.map((m) => {
        const conv = convByUser.get(m.user_id);
        return {
          matchId: m.id,
          otherUserId: m.user_id,
          conversationId: conv?.id || null,
          lastMessage: conv?.lastMessage || null,
          unreadCount: conv?.unreadCount || 0,
          updatedAt: conv?.updatedAt || m.created_at,
          profile: profileById.get(m.user_id),
        };
      });
      merged.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setRows(merged);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.detail || err?.message || 'Could not load matches',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const openChat = async (row) => {
    if (row.conversationId) {
      navigate(`/chat/${row.conversationId}`);
      return;
    }
    try {
      const { data } = await messagingApi.getOrCreateConversation(row.otherUserId);
      navigate(`/chat/${data.id}`);
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || err?.message || 'Could not open chat',
        color: 'danger',
      });
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <HeaderNav activeTab="chats" unread={rows.filter((r) => r.unreadCount > 0).length} streak={streak} />

        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <IonSpinner name="crescent" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <IonIcon icon={heartOutline} size="large" className="mb-4" />
            <h2 className="text-lg font-medium">No matches yet</h2>
            <p className="text-sm mb-4">Start swiping to find your match!</p>
            <IonButton color="primary" onClick={() => navigate('/discover')}>
              <IonIcon icon={personAddOutline} slot="start" />
              Start Discovering
            </IonButton>
          </div>
        ) : (
          <ChatAndDates
            matches={rows.map(r => ({
              id: r.conversationId || r.matchId,
              profileId: r.otherUserId,
              streak: 3,
              unread: r.unreadCount,
              lastActive: timeAgo(r.updatedAt),
              messages: r.lastMessage ? [{ id: 'msg-1', sender: 'them', text: r.lastMessage.content, time: timeAgo(r.updatedAt) }] : []
            }))}
            profiles={rows.map(r => ({
              id: r.otherUserId,
              name: r.profile?.name || 'Match',
              photo: photoUrl(r.profile?.photos?.[0]?.s3Key) || null,
              intention: r.profile?.intention || 'Serious Dating'
            }))}
            onSend={async (matchId, text) => {
              // Open chat if not sending inline, but since we are inline:
              const row = rows.find(r => r.conversationId === matchId || r.matchId === matchId);
              if (row) {
                if (row.conversationId) {
                  navigate(`/chat/${row.conversationId}`);
                } else {
                  try {
                    const { data } = await messagingApi.getOrCreateConversation(row.otherUserId);
                    navigate(`/chat/${data.id}`);
                  } catch (err) {
                    setToast({ open: true, message: 'Could not open chat', color: 'danger' });
                  }
                }
              }
            }}
          />
        )}

        <IonToast
          isOpen={toast.open}
          onDidDismiss={() => setToast({ ...toast, open: false })}
          message={toast.message}
          duration={4000}
          position="bottom"
          color={toast.color}
        />
      </IonContent>
      <BottomNav unread={rows.filter((r) => r.unreadCount > 0).length} />
    </IonPage>
  );
};

export default Matches;
