import { io } from 'socket.io-client';
import { MESSAGING_SOCKET_URL, tokenStorage } from './api';

let chatSocket = null;

export const getChatSocket = () => {
  if (chatSocket) return chatSocket;

  const token = tokenStorage.getAccess();
  chatSocket = io(MESSAGING_SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  chatSocket.on('connect_error', () => {
    // Auth token may have expired while disconnected; reconnect with a fresh one.
    chatSocket.auth = { token: tokenStorage.getAccess() };
  });

  return chatSocket;
};

export const disconnectChatSocket = () => {
  if (chatSocket) {
    chatSocket.disconnect();
    chatSocket = null;
  }
};

export const joinConversationRoom = (conversationId) => {
  getChatSocket().emit('conversation:join', { conversationId });
};

export const sendSocketMessage = (conversationId, content) => {
  getChatSocket().emit('message:send', { conversationId, content });
};

export const emitTyping = (conversationId, typing) => {
  getChatSocket().emit(typing ? 'typing:start' : 'typing:stop', { conversationId });
};

export const emitRead = (conversationId, messageIds) => {
  getChatSocket().emit('message:read', { conversationId, messageIds });
};

export const onSocketEvent = (event, handler) => {
  getChatSocket().on(event, handler);
  return () => getChatSocket().off(event, handler);
};
