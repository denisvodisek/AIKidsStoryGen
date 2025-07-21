import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { OnboardingData, OnboardingStep2Data } from '@/types';
import {
  saveOnboardingSession,
  getOnboardingSession,
  generateSessionToken,
} from '@/lib/supabase';

interface OnboardingStore {
  // Session management
  sessionToken: string | null;
  sessionId: string | null;
  initializeSession: () => Promise<void>;

  // Step 1 data
  step1Data: OnboardingData | null;
  setStep1Data: (data: OnboardingData) => Promise<void>;
  clearStep1Data: () => void;

  // Step 2 data
  step2Data: OnboardingStep2Data | null;
  setStep2Data: (data: OnboardingStep2Data) => Promise<void>;
  clearStep2Data: () => void;

  // Form state for step 1
  step1FormData: {
    photo: File | null;
    photoPreview: string;
    photoUrl: string;
    photoPath: string;
    name: string;
    age: number;
    gender: string;
  };
  setStep1FormData: (data: Partial<OnboardingStore['step1FormData']>) => void;
  resetStep1FormData: () => void;

  // Form state for step 2
  step2FormData: {
    destination: string;
    themes: string[];
    style: string;
    customPrompt: string;
    pageCount: number;
  };
  setStep2FormData: (data: Partial<OnboardingStore['step2FormData']>) => void;
  resetStep2FormData: () => void;

  // Upload state
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;

  // Utility methods
  clearAllData: () => void;
  isStep1Valid: () => boolean;
  isStep2Valid: () => boolean;
}

const initialStep1FormData = {
  photo: null,
  photoPreview: '',
  photoUrl: '',
  photoPath: '',
  name: '',
  age: 2,
  gender: '',
};

const initialStep2FormData = {
  destination: '',
  themes: [],
  style: 'disney-pixar',
  customPrompt: '',
  pageCount: 10,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      // Session management
      sessionToken: null,
      sessionId: null,
      initializeSession: async () => {
        const state = get();
        if (!state.sessionToken) {
          const token = generateSessionToken();
          set({ sessionToken: token });

          // Save initial session to database
          try {
            const { data, error } = await saveOnboardingSession({
              session_token: token,
              onboarding_data: {},
              current_step: 1,
            });

            if (data) {
              set({ sessionId: data.id });
            }
          } catch (error) {
            console.error('Failed to initialize session:', error);
          }
        }
      },

      // Step 1 data
      step1Data: null,
      setStep1Data: async data => {
        set({ step1Data: data });

        const state = get();
        if (state.sessionToken) {
          try {
            await saveOnboardingSession({
              session_token: state.sessionToken,
              onboarding_data: {
                step1: data,
                step2: state.step2Data,
              },
              current_step: 1,
            });
          } catch (error) {
            console.error('Failed to save step 1 data to database:', error);
          }
        }
      },
      clearStep1Data: () => set({ step1Data: null }),

      // Step 2 data
      step2Data: null,
      setStep2Data: async data => {
        set({ step2Data: data });

        const state = get();
        if (state.sessionToken) {
          try {
            await saveOnboardingSession({
              session_token: state.sessionToken,
              onboarding_data: {
                step1: state.step1Data,
                step2: data,
              },
              current_step: 2,
            });
          } catch (error) {
            console.error('Failed to save step 2 data to database:', error);
          }
        }
      },
      clearStep2Data: () => set({ step2Data: null }),

      // Form state for step 1
      step1FormData: initialStep1FormData,
      setStep1FormData: data =>
        set(state => ({
          step1FormData: { ...state.step1FormData, ...data },
        })),
      resetStep1FormData: () => set({ step1FormData: initialStep1FormData }),

      // Form state for step 2
      step2FormData: initialStep2FormData,
      setStep2FormData: data =>
        set(state => ({
          step2FormData: { ...state.step2FormData, ...data },
        })),
      resetStep2FormData: () => set({ step2FormData: initialStep2FormData }),

      // Upload state
      isUploading: false,
      setIsUploading: uploading => set({ isUploading: uploading }),

      // Utility methods
      clearAllData: () =>
        set({
          step1Data: null,
          step2Data: null,
          step1FormData: initialStep1FormData,
          step2FormData: initialStep2FormData,
          isUploading: false,
        }),

      isStep1Valid: () => {
        const { step1FormData } = get();
        return !!(
          step1FormData.photoUrl &&
          step1FormData.name &&
          step1FormData.age &&
          step1FormData.gender
        );
      },

      isStep2Valid: () => {
        const { step2FormData } = get();
        return !!(
          step2FormData.destination ||
          step2FormData.themes.length > 0 ||
          step2FormData.customPrompt
        );
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist completed data and session info
      partialize: state => ({
        sessionToken: state.sessionToken,
        sessionId: state.sessionId,
        step1Data: state.step1Data,
        step2Data: state.step2Data,
      }),
    }
  )
);
