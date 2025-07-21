-- =============================================================================
-- STORIES TABLE
-- Based on GeneratedStory interface
-- =============================================================================

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_title TEXT NOT NULL,
  
  -- Story generation parameters (JSONB for flexibility as requirements evolve)
  -- Based on StoryGenerationParams + OnboardingStep2Data
  generation_params JSONB NOT NULL DEFAULT '{}',
  -- Example structure:
  -- {
  --   "kidCharacterName": "Alice",
  --   "kidCharacterDescription": "...",
  --   "storyArtStyle": "disney-pixar", 
  --   "storyArtStyleDescription": "...",
  --   "kidAge": 5,
  --   "desiredPageCount": 10,
  --   "parentStoryIdea": "...",
  --   "destination": "magical forest",
  --   "themes": ["adventure", "friendship"],
  --   "style": "disney-pixar",
  --   "customPrompt": "...",
  --   "pageCount": 10
  -- }
  
  -- Photo generation statistics (JSONB for flexibility)
  photo_generation_stats JSONB DEFAULT '{"total": 0, "successful": 0, "failed": 0}',
  
  -- Generation progress/state (for real-time updates during story creation)
  generation_state JSONB DEFAULT '{"isGenerating": false, "currentStepIndex": 0, "progress": 0, "complete": false}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Future: user_id for when you add auth
  -- user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =============================================================================
-- STORY PAGES TABLE
-- Based on StoryPage interface
-- =============================================================================

CREATE TABLE story_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  
  page_number INTEGER NOT NULL,
  page_type TEXT NOT NULL CHECK (page_type IN ('cover', 'table_of_contents', 'story_page')),
  chapter_title TEXT,
  content TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  photo_description TEXT NOT NULL,
  photo_data TEXT,
  photo_url TEXT,
  
  -- Image generation parameters and metadata (JSONB for flexibility)
  image_generation_params JSONB DEFAULT '{}',
  -- Example structure:
  -- {
  --   "prompt": "enhanced photo description...",
  --   "modelId": "leonardo-diffusion-xl",
  --   "width": 1024,
  --   "height": 1024, 
  --   "numImages": 1,
  --   "guidance": 7,
  --   "steps": 20,
  --   "style_modifiers": ["cartoon", "child-friendly"],
  --   "negative_prompt": "scary, dark, violent"
  -- }
  
  -- Page-specific metadata (for future features)
  page_metadata JSONB DEFAULT '{}',
  -- Could include: reading_time_seconds, difficulty_level, interactive_elements, etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique page numbers per story
  UNIQUE(story_id, page_number)
);

-- =============================================================================
-- CHARACTERS TABLE
-- Based on CharacterAnalysis interface
-- =============================================================================

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic character info
  character_name TEXT NOT NULL,
  character_age TEXT NOT NULL,
  character_gender TEXT NOT NULL,
  
  -- All physical characteristics as JSONB (more flexible for AI analysis evolution)
  physical_characteristics JSONB NOT NULL DEFAULT '{}',
  -- Example structure:
  -- {
  --   "body_type_build": "average child build",
  --   "height_perception": "average height for age",
  --   "hairstyle": "shoulder-length wavy",
  --   "hair_color": "brown",
  --   "eye_color": "blue",
  --   "nose_shape": "small button nose",
  --   "eyebrow_style": "natural arched",
  --   "chin_shape": "rounded",
  --   "jawline": "soft",
  --   "cheek_shape": "full cheeks",
  --   "ear_shape_placement": "proportional",
  --   "distinctive_facial_features": "freckles across nose",
  --   "facial_proportions_symmetry": "well-proportioned",
  --   "skin_tone": "fair",
  --   "accessories": "small star earrings"
  -- }
  
  -- AI-generated description
  description TEXT NOT NULL,
  
  -- Character generation parameters used
  generation_params JSONB DEFAULT '{}',
  -- Based on CharacterGenerationParams and any future enhancements
  
  -- Photo/avatar data
  avatar_data JSONB DEFAULT '{}',
  -- Could include: uploaded_photo_url, generated_avatar_url, photo_analysis_results
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  
  -- Future: user_id for when you add auth
  -- user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =============================================================================
-- ONBOARDING SESSIONS TABLE
-- For tracking user onboarding progress and temporary data
-- =============================================================================

CREATE TABLE onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL, -- Temporary identifier before user auth
  
  -- Onboarding data as JSONB (combines OnboardingData + OnboardingStep2Data)
  onboarding_data JSONB NOT NULL DEFAULT '{}',
  -- Example structure:
  -- {
  --   "step1": {
  --     "name": "Alice", 
  --     "age": 5,
  --     "gender": "female",
  --     "photoUrl": "...",
  --     "photoPath": "..."
  --   },
  --   "step2": {
  --     "destination": "magical forest",
  --     "themes": ["adventure", "friendship"],
  --     "style": "disney-pixar", 
  --     "customPrompt": "...",
  --     "pageCount": 10
  --   }
  -- }
  
  current_step INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- GENERATION JOBS TABLE
-- For tracking long-running AI generation tasks
-- =============================================================================

CREATE TABLE generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL CHECK (job_type IN ('story_generation', 'character_analysis', 'image_generation')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  
  -- Job parameters and configuration
  job_params JSONB NOT NULL DEFAULT '{}',
  
  -- Progress tracking
  progress_data JSONB DEFAULT '{"current_step": 0, "total_steps": 0, "percentage": 0}',
  
  -- Results storage
  result_data JSONB DEFAULT '{}',
  error_data JSONB DEFAULT '{}',
  
  -- Related entities
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  
  -- Future: user_id for when you add auth
  -- user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =============================================================================
-- USER PREFERENCES TABLE (Future-ready)
-- For storing user settings, preferences, and app state
-- =============================================================================

CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- App preferences as JSONB (very flexible)
  preferences JSONB NOT NULL DEFAULT '{}',
  -- Example structure:
  -- {
  --   "theme": "light",
  --   "language": "en",
  --   "default_art_style": "disney-pixar",
  --   "default_page_count": 10,
  --   "notification_settings": {
  --     "email": true,
  --     "push": false
  --   },
  --   "favorite_themes": ["adventure", "friendship"],
  --   "child_safety_level": "strict"
  -- }
  
  -- Recently used data for quick access
  recent_data JSONB DEFAULT '{}',
  -- Could include: recent_characters, recent_themes, recent_destinations, etc.
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  
  -- Future: user_id for when you add auth
  -- user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Stories indexes
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_stories_generation_params ON stories USING GIN (generation_params);
CREATE INDEX idx_stories_generation_state ON stories USING GIN (generation_state);

-- Story pages indexes
CREATE INDEX idx_story_pages_story_id ON story_pages(story_id);
CREATE INDEX idx_story_pages_page_number ON story_pages(story_id, page_number);
CREATE INDEX idx_story_pages_page_type ON story_pages(page_type);

-- Characters indexes
CREATE INDEX idx_characters_name ON characters(character_name);
CREATE INDEX idx_characters_created_at ON characters(created_at DESC);
CREATE INDEX idx_characters_physical ON characters USING GIN (physical_characteristics);

-- Onboarding sessions indexes
CREATE INDEX idx_onboarding_sessions_token ON onboarding_sessions(session_token);
CREATE INDEX idx_onboarding_sessions_expires ON onboarding_sessions(expires_at);
CREATE INDEX idx_onboarding_sessions_step ON onboarding_sessions(current_step);

-- Generation jobs indexes
CREATE INDEX idx_generation_jobs_status ON generation_jobs(status);
CREATE INDEX idx_generation_jobs_type ON generation_jobs(job_type);
CREATE INDEX idx_generation_jobs_story_id ON generation_jobs(story_id);
CREATE INDEX idx_generation_jobs_character_id ON generation_jobs(character_id);
CREATE INDEX idx_generation_jobs_created_at ON generation_jobs(created_at DESC);

-- User preferences indexes (for future use)
CREATE INDEX idx_user_preferences_preferences ON user_preferences USING GIN (preferences);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - READY FOR FUTURE AUTH
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Temporary policies for development (allow all operations)
-- You'll want to update these when you add authentication
CREATE POLICY "Allow all operations for now" ON stories FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON story_pages FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON characters FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON onboarding_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON generation_jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations for now" ON user_preferences FOR ALL USING (true);

-- =============================================================================
-- UPDATED_AT TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to update updated_at automatically
CREATE TRIGGER update_stories_updated_at 
    BEFORE UPDATE ON stories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_pages_updated_at 
    BEFORE UPDATE ON story_pages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at 
    BEFORE UPDATE ON characters 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_sessions_updated_at 
    BEFORE UPDATE ON onboarding_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generation_jobs_updated_at 
    BEFORE UPDATE ON generation_jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- JSONB USAGE SUMMARY
-- =============================================================================

-- 🎯 WHEN TO USE JSONB (Perfect for your AI story app!):
--
-- ✅ RECOMMENDED JSONB FIELDS:
-- • generation_params - Story generation parameters (will evolve with AI improvements)
-- • photo_generation_stats - Image generation metrics and analytics
-- • generation_state - Real-time progress tracking during story creation
-- • image_generation_params - Image AI parameters (models, prompts, settings)
-- • page_metadata - Future page features (reading time, interactivity, etc.)
-- • physical_characteristics - Character analysis (AI might add new attributes)
-- • avatar_data - Character photos and generated avatars
-- • onboarding_data - User onboarding flow data (flexible steps)
-- • job_params/progress_data/result_data - AI generation job tracking
-- • preferences - User settings and app configuration
-- • recent_data - Quick access to user's recent choices
--
-- 🔄 BENEFITS FOR YOUR APP:
-- • AI model improvements won't break your database schema
-- • Easy to add new generation parameters or analysis features
-- • Flexible progress tracking for long-running AI operations
-- • Can store complex nested data (themes arrays, settings objects)
-- • Perfect for A/B testing different AI approaches
-- • GIN indexes make JSONB queries fast
--
-- 💡 QUERY EXAMPLES:
-- • Find stories with specific themes: WHERE generation_params->'themes' ? 'adventure'
-- • Get all Disney-style stories: WHERE generation_params->>'storyArtStyle' = 'disney-pixar'
-- • Find failed generation jobs: WHERE result_data->>'status' = 'failed'
-- • User's preferred art style: WHERE preferences->>'default_art_style' = 'lego'