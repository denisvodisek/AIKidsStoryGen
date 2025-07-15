export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  subscription_tier: 'free' | 'pro' | 'unlimited'
  stories_generated_this_month: number
  created_at: string
  updated_at: string
}

export interface Story {
  id: string
  user_id: string
  title: string
  content: string
  character: string
  setting: string
  lesson: string
  age_group: '3-5' | '6-8' | '9-12'
  language: string
  story_length: 'short' | 'medium' | 'long'
  pages: StoryPage[]
  cover_image_url?: string
  status: 'generating' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface StoryPage {
  id: string
  story_id: string
  page_number: number
  text: string
  image_url?: string
  image_prompt: string
  created_at: string
}

export interface Character {
  id: string
  user_id: string
  name: string
  description: string
  image_url?: string
  age_group: '3-5' | '6-8' | '9-12'
  personality_traits: string[]
  created_at: string
  updated_at: string
}

export interface StoryTemplate {
  id: string
  name: string
  description: string
  character_prompt: string
  setting_prompt: string
  lesson_categories: string[]
  age_groups: ('3-5' | '6-8' | '9-12')[]
  thumbnail_url?: string
  is_premium: boolean
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  tier: 'pro' | 'unlimited'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface UserFeedback {
  id: string
  user_id: string
  story_id?: string
  rating: 1 | 2 | 3 | 4 | 5
  feedback_text?: string
  feedback_type: 'story_quality' | 'image_quality' | 'general' | 'bug_report'
  created_at: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Form Types
export interface StoryGenerationRequest {
  character: string
  setting: string
  lesson: string
  ageGroup: '3-5' | '6-8' | '9-12'
  language: string
  storyLength: 'short' | 'medium' | 'long'
  templateId?: string
}

export interface ChildInfo {
  name: string
  age: number
  photo_url?: string
  interests: string[]
  favorite_characters: string[]
}

// Zustand Store Types
export interface AuthStore {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => void
}

export interface StoryStore {
  stories: Story[]
  currentStory: Story | null
  isGenerating: boolean
  generationProgress: number
  addStory: (story: Story) => void
  updateStory: (id: string, updates: Partial<Story>) => void
  setCurrentStory: (story: Story | null) => void
  setGenerating: (generating: boolean) => void
  setProgress: (progress: number) => void
}

export interface CharacterStore {
  characters: Character[]
  selectedCharacter: Character | null
  addCharacter: (character: Character) => void
  updateCharacter: (id: string, updates: Partial<Character>) => void
  deleteCharacter: (id: string) => void
  setSelectedCharacter: (character: Character | null) => void
}

// External API Types
export interface GeminiGenerationParams {
  character: string
  setting: string
  lesson: string
  ageGroup: '3-5' | '6-8' | '9-12'
  language: string
  storyLength: 'short' | 'medium' | 'long'
}

export interface LeonardoImageParams {
  prompt: string
  style: 'cute_animals' | 'illustration' | 'watercolor'
  width?: number
  height?: number
}

export interface SupabaseStorageUpload {
  file: File
  bucket: string
  path: string
} 