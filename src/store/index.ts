// Export all stores
export { useOnboardingStore } from './onboarding-store';
export { useStoryStore } from './story-store';

// Re-export types for convenience
export type {
  OnboardingData,
  OnboardingStep2Data,
  GeneratedStory,
  CharacterAnalysis,
  GenerationState,
  GenerationStep,
} from '@/types';
