// =============================================================================
// ONBOARDING & USER DATA TYPES
// =============================================================================

export interface OnboardingData {
  name: string;
  age: number;
  gender: string;
  photoUrl: string;
  photoPath: string;
}

export interface OnboardingStep2Data {
  destination: string;
  themes: string[];
  style: string;
  customPrompt: string;
  pageCount: number;
}

// =============================================================================
// STORY GENERATION TYPES
// =============================================================================

export interface StoryGenerationParams {
  kidCharacterName: string;
  kidCharacterDescription: string;
  storyArtStyle: string;
  storyArtStyleDescription: string;
  kidAge: number; // 1-7
  desiredPageCount: number; // Must be 5, 10, or 15
  parentStoryIdea: string;
  language: string;
}

export interface StoryPage {
  page_number: number;
  page_type: 'cover' | 'table_of_contents' | 'story_page';
  chapter_title?: string;
  content: string;
  reasoning: string;
  photo_description: string;
  photo_data?: string | null;
  photo_url?: string | null;
}

export interface GeneratedStory {
  id: string;
  story_title: string;
  pages: StoryPage[];
  photo_generation_stats?: {
    total: number;
    successful: number;
    failed: number;
  };
}

// =============================================================================
// CHARACTER ANALYSIS TYPES
// =============================================================================

export interface CharacterGenerationParams {
  character_name: string;
  character_age: number;
  character_gender: string;
}

export interface CharacterAnalysis {
  character_name: string;
  character_age: string;
  character_gender: string;
  body_type_build: string;
  height_perception: string;
  hairstyle: string;
  hair_color: string;
  eye_color: string;
  nose_shape: string;
  eyebrow_style: string;
  chin_shape: string;
  jawline: string;
  cheek_shape: string;
  ear_shape_placement: string;
  distinctive_facial_features: string;
  facial_proportions_symmetry: string;
  skin_tone: string;
  accessories: string;
  description: string;
}

// =============================================================================
// IMAGE GENERATION TYPES
// =============================================================================

export interface ImageGenerationParams {
  prompt: string;
  modelId?: string;
  width?: number;
  height?: number;
  numImages?: number;
  guidance?: number;
  steps?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  likelyGens: number;
  nsfw: boolean;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface HeaderProps {
  showAuthButton?: boolean;
}

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

export interface UploadResult {
  path: string;
  publicUrl: string;
  fileName: string;
}

export interface ApiResponse<T = any> {
  data: T | null;
  error: Error | null;
}

// =============================================================================
// THEME & STYLE TYPES
// =============================================================================

export interface ThemeOption {
  id: string;
  label: string;
  color: string;
}

export type ArtStyle =
  | 'disney-pixar'
  | 'paw-patrol'
  | 'lego'
  | 'classic-disney';

// =============================================================================
// GENERATION PROGRESS TYPES
// =============================================================================

export interface GenerationStep {
  emoji: string;
  text: string;
}

export interface GenerationState {
  isGenerating: boolean;
  currentStepIndex: number;
  progress: number;
  complete: boolean;
  error?: string;
}
