/**
 * Zustand store for local UI state
 * Lightweight, no boilerplate
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      // Auth state (tokens live in localStorage via services/api.js tokenStorage)
      auth: {
        user: null, // AuthResponseDto: { userId, email?, phone?, isNewUser }
        profile: null, // ProfileResponseDto
        loading: false,
        error: null,
      },

      // Onboarding state
      onboarding: {
        step: 1,
        gender: null, // 'male' | 'female' | 'non_binary'
        seeking: null, // 'men' | 'women' | 'everyone'
        completed: false,
      },

      // Discover state
      discover: {
        currentIndex: 0,
        deck: [],
        loading: false,
        filters: {
          ageMin: 18,
          ageMax: 99,
          distance: 50,
        },
      },

      // Chat state
      chat: {
        activeMatchId: null,
        typingUsers: {},
        unreadCounts: {},
      },

      // UI state
      ui: {
        isSidebarOpen: false,
        isModalOpen: false,
        modalContent: null,
        toasts: [],
        loading: {},
      },

      // Network state
      network: {
        online: typeof navigator !== 'undefined' ? navigator.onLine : true,
        slowConnection: false,
      },

      // Auth actions
      setAuthUser: (user) =>
        set((state) => ({
          auth: { ...state.auth, user, error: null },
        })),

      setProfile: (profile) =>
        set((state) => ({
          auth: { ...state.auth, profile },
        })),

      setAuthLoading: (loading) =>
        set((state) => ({
          auth: { ...state.auth, loading },
        })),

      setAuthError: (error) =>
        set((state) => ({
          auth: { ...state.auth, error },
        })),

      clearAuth: () =>
        set({
          auth: { user: null, profile: null, loading: false, error: null },
        }),

      // Onboarding actions
      setOnboardingStep: (step) =>
        set((state) => ({
          onboarding: { ...state.onboarding, step },
        })),

      setOnboardingGender: (gender) =>
        set((state) => ({
          onboarding: { ...state.onboarding, gender },
        })),

      setOnboardingSeeking: (seeking) =>
        set((state) => ({
          onboarding: { ...state.onboarding, seeking },
        })),

      completeOnboarding: () =>
        set((state) => ({
          onboarding: { ...state.onboarding, completed: true },
        })),

      resetOnboarding: () =>
        set({
          onboarding: { step: 1, gender: null, seeking: null, completed: false },
        }),

      // Discover actions
      setDiscoverDeck: (deck) =>
        set((state) => ({
          discover: { ...state.discover, deck, currentIndex: 0 },
        })),

      setDiscoverLoading: (loading) =>
        set((state) => ({
          discover: { ...state.discover, loading },
        })),

      nextProfile: () =>
        set((state) => ({
          discover: {
            ...state.discover,
            currentIndex: Math.min(state.discover.currentIndex + 1, state.discover.deck.length - 1),
          },
        })),

      setDiscoverFilters: (filters) =>
        set((state) => ({
          discover: { ...state.discover, filters: { ...state.discover.filters, ...filters } },
        })),

      // Chat actions
      setActiveMatch: (matchId) =>
        set((state) => ({
          chat: { ...state.chat, activeMatchId: matchId },
        })),

      setTyping: (userId, isTyping) =>
        set((state) => ({
          chat: {
            ...state.chat,
            typingUsers: { ...state.chat.typingUsers, [userId]: isTyping },
          },
        })),

      incrementUnread: (matchId) =>
        set((state) => ({
          chat: {
            ...state.chat,
            unreadCounts: {
              ...state.chat.unreadCounts,
              [matchId]: (state.chat.unreadCounts[matchId] || 0) + 1,
            },
          },
        })),

      clearUnread: (matchId) =>
        set((state) => ({
          chat: {
            ...state.chat,
            unreadCounts: { ...state.chat.unreadCounts, [matchId]: 0 },
          },
        })),

      // UI actions
      toggleSidebar: () =>
        set((state) => ({
          ui: { ...state.ui, isSidebarOpen: !state.ui.isSidebarOpen },
        })),

      openModal: (content) =>
        set((state) => ({
          ui: { ...state.ui, isModalOpen: true, modalContent: content },
        })),

      closeModal: () =>
        set((state) => ({
          ui: { ...state.ui, isModalOpen: false, modalContent: null },
        })),

      addToast: (toast) =>
        set((state) => ({
          ui: {
            ...state.ui,
            toasts: [...state.ui.toasts, { id: Date.now(), ...toast }],
          },
        })),

      removeToast: (id) =>
        set((state) => ({
          ui: {
            ...state.ui,
            toasts: state.ui.toasts.filter((t) => t.id !== id),
          },
        })),

      setLoading: (key, loading) =>
        set((state) => ({
          ui: {
            ...state.ui,
            loading: { ...state.ui.loading, [key]: loading },
          },
        })),

      // Network actions
      setOnline: (online) =>
        set((state) => ({
          network: { ...state.network, online },
        })),

      setSlowConnection: (slow) =>
        set((state) => ({
          network: { ...state.network, slowConnection: slow },
        })),

      // Reset all
      reset: () =>
        set({
          auth: { user: null, profile: null, loading: false, error: null },
          onboarding: { step: 1, gender: null, seeking: null, completed: false },
          discover: { currentIndex: 0, deck: [], loading: false, filters: { ageMin: 18, ageMax: 99, distance: 50 } },
          chat: { activeMatchId: null, typingUsers: {}, unreadCounts: {} },
          ui: { isSidebarOpen: false, isModalOpen: false, modalContent: null, toasts: [], loading: {} },
          network: { online: true, slowConnection: false },
        }),
    }),
    {
      name: 'dinanwuye-app-store',
      partialize: (state) => ({
        auth: { user: state.auth.user, profile: state.auth.profile },
        onboarding: state.onboarding,
        discover: { filters: state.discover.filters },
        chat: { unreadCounts: state.chat.unreadCounts },
        ui: { toasts: state.ui.toasts },
      }),
    }
  )
);

export default useAppStore;
