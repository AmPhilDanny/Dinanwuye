/**
 * Dinanwuye API client — single consolidated NestJS API + separate Python matching service.
 */

import axios from 'axios';

const API_BASE = (
  import.meta.env.VITE_API_URL || 'https://dinanwuye-api.onrender.com'
).replace(/\/+$/, '');

export const SERVICES = {
  auth:      `${API_BASE}/api/v1`,
  profile:   `${API_BASE}/api/v1`,
  messaging: `${API_BASE}/api/v1`,
  safety:    `${API_BASE}/api/v1`,
  matching:  (
    import.meta.env.VITE_MATCHING_URL || 'https://dinanwuye-matching.onrender.com'
  ).replace(/\/+$/, '') + '/api/v1',
};

// Socket.IO gateway lives at the server root (not under /api/v1)
export const MESSAGING_SOCKET_URL = API_BASE;

const TOKEN_KEYS = {
  access: 'dnw_access_token',
  refresh: 'dnw_refresh_token',
};

export const tokenStorage = {
  getAccess: () => (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null),
  getRefresh: () => (typeof localStorage !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.refresh) : null),
  set: (access, refresh) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(TOKEN_KEYS.access, access);
    localStorage.setItem(TOKEN_KEYS.refresh, refresh);
  },
  clear: () => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.refresh);
  },
};

const redirectToAuth = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/auth';
  }
};

/**
 * Build an axios client for one service with:
 * - Bearer access token injection
 * - Single-flight refresh + retry on 401 (except for the auth client itself)
 */
const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  client.interceptors.request.use((config) => {
    const token = tokenStorage.getAccess();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  let refreshPromise = null;

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config;
      if (error.response?.status !== 401 || original?._retried || baseURL === SERVICES.auth) {
        return Promise.reject(error);
      }

      original._retried = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${SERVICES.auth}/auth/refresh`, {
              refreshToken: tokenStorage.getRefresh(),
            })
            .then(({ data }) => {
              tokenStorage.set(data.accessToken, data.refreshToken);
              return data.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const accessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${accessToken}`;
        return client(original);
      } catch {
        tokenStorage.clear();
        redirectToAuth();
        return Promise.reject(error);
      }
    }
  );

  return client;
};

export const authClient = createClient(SERVICES.auth);
export const profileClient = createClient(SERVICES.profile);
export const messagingClient = createClient(SERVICES.messaging);
export const safetyClient = createClient(SERVICES.safety);
export const matchingClient = createClient(SERVICES.matching);

// ============================================================
// Auth API (matches auth-service controllers/DTOs)
// ============================================================
export const authApi = {
  signup: (payload) => authClient.post('/auth/signup', payload),
  login: (identifier, password) => authClient.post('/auth/login', { identifier, password }),
  sendOtp: (identifier, purpose) => authClient.post('/auth/otp/send', { identifier, purpose }),
  verifyOtp: (identifier, code, purpose) => authClient.post('/auth/verify-otp', { identifier, code, purpose }),
  refresh: (refreshToken) => authClient.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => authClient.post('/auth/logout', { refreshToken }),
  livenessChallenge: () => authClient.post('/auth/liveness/challenge'),
  verifyLiveness: (payload) => authClient.post('/auth/liveness/verify', payload),
};

// ============================================================
// Profile API
// ============================================================
export const profileApi = {
  getMe: () => profileClient.get('/profiles/me'),
  updateMe: (data) => profileClient.patch('/profiles/me', data),
  getCandidates: () => profileClient.get('/profiles/candidates'),
  getPublic: (id) => profileClient.get(`/profiles/${id}`),
  getPhotos: () => profileClient.get('/profiles/me/photos'),
  addPhoto: (file) => {
    const formData = new FormData();
    formData.append('photo', file);
    return profileClient.post('/profiles/me/photos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  removePhoto: (photoId) => profileClient.delete(`/profiles/me/photos/${photoId}`),
  getPreferences: () => profileClient.get('/profiles/me/preferences'),
  updatePreferences: (data) => profileClient.patch('/profiles/me/preferences', data),
};

// ============================================================
// Matching API (FastAPI — snake_case payloads)
// ============================================================
export const matchingApi = {
  getDeck: (params) => matchingClient.get('/matching/deck', { params }),
  swipe: (targetId, action) => matchingClient.post('/matching/swipe', { target_id: targetId, action }),
  getMatches: () => matchingClient.get('/matching/matches'),
  getMatch: (matchId) => matchingClient.get(`/matching/matches/${matchId}`),
  unmatch: (matchId) => matchingClient.delete(`/matching/matches/${matchId}`),
};

// ============================================================
// Messaging API (conversation-based)
// ============================================================
export const messagingApi = {
  listConversations: () => messagingClient.get('/conversations'),
  getOrCreateConversation: (otherUserId) => messagingClient.post('/conversations', { otherUserId }),
  getConversation: (id) => messagingClient.get(`/conversations/${id}`),
  getMessages: (id, params) => messagingClient.get(`/conversations/${id}/messages`, { params }),
  sendMessage: (id, content) => messagingClient.post(`/conversations/${id}/messages`, { content }),
  markRead: (id, messageIds) => messagingClient.patch(`/conversations/${id}/read`, { messageIds }),
  deleteConversation: (id) => messagingClient.delete(`/conversations/${id}`),
};

// ============================================================
// Safety API
// ============================================================
export const safetyApi = {
  block: (targetId) => safetyClient.post('/safety/blocks', { targetId }),
  unblock: (targetId) => safetyClient.delete(`/safety/blocks/${targetId}`),
  report: (payload) => safetyClient.post('/safety/reports', payload),
  listReports: (params) => safetyClient.get('/safety/reports', { params }),
  getExclusions: () => safetyClient.get('/safety/exclusions'),
};

export default authClient;
