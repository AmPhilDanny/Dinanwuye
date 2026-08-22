/**
 * TanStack Query hooks for server state
 * All API calls go through these hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, profileApi, matchingApi, messagingApi, safetyApi, paymentApi, notificationApi } from './api';

// Query keys
export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  profile: {
    me: ['profile', 'me'],
    photos: ['profile', 'photos'],
    preferences: ['profile', 'preferences'],
    verification: ['profile', 'verification'],
  },
  matching: {
    deck: (params) => ['matching', 'deck', params],
    matches: ['matching', 'matches'],
    likes: ['matching', 'likes'],
  },
  messaging: {
    messages: (matchId, params) => ['messaging', 'messages', matchId, params],
    matches: ['messaging', 'matches'],
  },
  safety: {
    blocked: ['safety', 'blocked'],
  },
  payment: {
    subscription: ['payment', 'subscription'],
    history: ['payment', 'history'],
  },
  notifications: {
    preferences: ['notifications', 'preferences'],
  },
};

// Auth hooks
export const useMe = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled,
    retry: false,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, otp }) => authApi.verifyOtp(email, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Profile hooks
export const useProfile = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: profileApi.get,
    enabled,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
};

export const useProfilePhotos = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.profile.photos,
    queryFn: () => profileApi.get().then((r) => r.data.photos),
    enabled,
  });

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, isPrimary }) => profileApi.uploadPhoto(file, isPrimary),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.photos });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.photos });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });
};

export const usePreferences = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.profile.preferences,
    queryFn: profileApi.getPreferences,
    enabled,
  });

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.preferences });
    },
  });
};

export const useVerifyIdentity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.verifyIdentity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.verification });
    },
  });
};

// Matching hooks
export const useDeck = (params, enabled = true) =>
  useQuery({
    queryKey: queryKeys.matching.deck(params),
    queryFn: () => matchingApi.getDeck(params),
    enabled,
    staleTime: 30000, // 30 seconds
  });

export const useLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: matchingApi.like,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.deck });
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.matches });
      if (data.matched) {
        // Handle match celebration
      }
    },
  });
};

export const usePass = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: matchingApi.pass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.deck });
    },
  });
};

export const useSuperLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: matchingApi.superLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.deck });
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.matches });
    },
  });
};

export const useMatches = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.matching.matches,
    queryFn: matchingApi.getMatches,
    enabled,
    staleTime: 60000,
  });

export const useUnmatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: matchingApi.unmatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.matches });
    },
  });
};

export const useLikes = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.matching.likes,
    queryFn: matchingApi.getLikes,
    enabled,
  });

// Messaging hooks
export const useMessages = (matchId, params, enabled = true) =>
  useQuery({
    queryKey: queryKeys.messaging.messages(matchId, params),
    queryFn: () => messagingApi.getMessages(matchId, params),
    enabled: enabled && !!matchId,
    staleTime: 10000,
  });

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, content, mediaId }) => messagingApi.sendMessage(matchId, content, mediaId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messaging.messages(variables.matchId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.matches });
    },
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, messageId }) => messagingApi.markRead(matchId, messageId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messaging.messages(variables.matchId) });
    },
  });
};

export const useUploadMedia = () =>
  useMutation({
    mutationFn: ({ matchId, file }) => messagingApi.uploadMedia(matchId, file),
  });

export const useReportMessage = () =>
  useMutation({
    mutationFn: ({ matchId, messageId, reason }) => messagingApi.reportMessage(matchId, messageId, reason),
  });

// Safety hooks
export const useBlocked = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.safety.blocked,
    queryFn: safetyApi.getBlocked,
    enabled,
  });

export const useReportUser = () =>
  useMutation({
    mutationFn: ({ targetId, category, context }) => safetyApi.reportUser(targetId, category, context),
  });

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: safetyApi.blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safety.blocked });
      queryClient.invalidateQueries({ queryKey: queryKeys.matching.matches });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: safetyApi.unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.safety.blocked });
    },
  });
};

// Payment hooks
export const useSubscription = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.payment.subscription,
    queryFn: paymentApi.getSubscription,
    enabled,
  });

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, paymentMethodId }) => paymentApi.createSubscription(planId, paymentMethodId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.subscription });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.subscription });
    },
  });
};

export const useBillingHistory = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.payment.history,
    queryFn: paymentApi.getBillingHistory,
    enabled,
  });

export const useCreateBoost = () =>
  useMutation({
    mutationFn: paymentApi.createBoost,
  });

export const useCreateSuperLikes = () =>
  useMutation({
    mutationFn: (count) => paymentApi.createSuperLikes(count),
  });

// Notification hooks
export const useNotificationPreferences = (enabled = true) =>
  useQuery({
    queryKey: queryKeys.notifications.preferences,
    queryFn: notificationApi.getPreferences,
    enabled,
  });

export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.preferences });
    },
  });
};

export const useRegisterDevice = () =>
  useMutation({
    mutationFn: ({ token, platform }) => notificationApi.registerDevice(token, platform),
  });

export const useUnregisterDevice = () =>
  useMutation({
    mutationFn: (token) => notificationApi.unregisterDevice(token),
  });