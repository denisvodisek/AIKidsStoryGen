import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthStore {
  // User state
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  signInWithGoogle: (locale?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: false,
      isInitialized: false,

      // Actions
      setUser: (user: User | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initialize: async () => {
        try {
          set({ isLoading: true });

          // Get current session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            console.error('Error getting session:', error);
            set({ user: null, isLoading: false, isInitialized: true });
            return;
          }

          set({
            user: session?.user || null,
            isLoading: false,
            isInitialized: true,
          });

          // Listen for auth changes
          supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            set({ user: session?.user || null });
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ user: null, isLoading: false, isInitialized: true });
        }
      },

      signInWithGoogle: async (locale = 'en') => {
        try {
          set({ isLoading: true });

          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/${locale}/auth/callback`,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
              },
            },
          });

          if (error) {
            console.error('Google sign in error:', error);
            set({ isLoading: false });
            return { error };
          }

          // Don't set loading to false here - callback will handle it
          return { error: null };
        } catch (error) {
          console.error('Google sign in error:', error);
          set({ isLoading: false });
          return { error };
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true });

          const { error } = await supabase.auth.signOut();

          if (error) {
            console.error('Sign out error:', error);
          }

          set({
            user: null,
            isLoading: false,
          });

          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.error('Sign out error:', error);
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        // Only persist user data, not loading states
        user: state.user,
      }),
    }
  )
);
