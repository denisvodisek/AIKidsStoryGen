import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  GeneratedStory,
  CharacterAnalysis,
  GenerationState,
  GenerationStep,
} from '@/types';

interface StoredStory extends GeneratedStory {
  id: string;
  createdAt: string;
}
import {
  saveStory,
  updateStory,
  saveStoryPages,
  saveCharacterAnalysis,
  getStoryById,
  updateStoryPagesWithImages,
} from '@/lib/supabase';

interface StoryStore {
  // Stories collection
  stories: StoredStory[];
  addStory: (story: GeneratedStory, id: string) => void;
  getStories: () => StoredStory[];

  // Generated story data
  currentStory: GeneratedStory | null;
  currentStoryId: string | null;
  setCurrentStory: (story: GeneratedStory) => Promise<void>;
  updateStoryWithImages: (story: GeneratedStory) => Promise<void>;
  clearCurrentStory: () => void;

  // Character analysis data
  characterAnalysis: CharacterAnalysis | null;
  characterId: string | null;
  setCharacterAnalysis: (
    analysis: CharacterAnalysis,
    generationParams?: any
  ) => Promise<void>;
  clearCharacterAnalysis: () => void;

  // Generation state
  generationState: GenerationState;
  setGenerationState: (state: Partial<GenerationState>) => void;
  resetGenerationState: () => void;

  // Generation steps
  generationSteps: GenerationStep[];
  setGenerationSteps: (steps: GenerationStep[]) => void;

  // Generation timing
  timingData: {
    startTime?: number;
    characterAnalysisTime?: number;
    storyGenerationTime?: number;
    imageGenerationTime?: number;
    totalTime?: number;
  };
  setTimingData: (timing: Partial<StoryStore['timingData']>) => void;
  clearTimingData: () => void;

  // Utility methods
  startGeneration: () => void;
  completeGeneration: () => void;
  failGeneration: (error: string) => void;
  clearAllStoryData: () => void;
}

const initialGenerationState: GenerationState = {
  isGenerating: false,
  currentStepIndex: 0,
  progress: 0,
  complete: false,
};

const defaultGenerationSteps: GenerationStep[] = [
  { emoji: '✨', text: 'transformingHero' },
  { emoji: '🎭', text: 'bringingCharactersToLife' },
  { emoji: '📚', text: 'writingAdventure' },
  { emoji: '🎨', text: 'creatingIllustrationsStep' },
  { emoji: '🌟', text: 'addingMagicalTouches' },
  { emoji: '📖', text: 'finalizingStory' },
];

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      // Stories collection
      stories: [],
      addStory: (story: GeneratedStory, id: string) => {
        const newStory: StoredStory = {
          ...story,
          id,
          createdAt: new Date().toISOString(),
        };

        set(state => {
          // Check if story already exists
          const existingIndex = state.stories.findIndex(s => s.id === id);

          if (existingIndex >= 0) {
            // Update existing story
            const updatedStories = [...state.stories];
            updatedStories[existingIndex] = newStory;
            return { stories: updatedStories };
          } else {
            // Add new story
            return { stories: [newStory, ...state.stories] };
          }
        });

        console.log('✅ Story added to store collection:', id);
      },

      getStories: () => {
        const state = get();
        return [...state.stories].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      // Generated story data
      currentStory: null,
      currentStoryId: null,
      setCurrentStory: async story => {
        const state = get();
        set({ currentStory: story });

        // Only save to database if this story hasn't been saved yet
        if (!state.currentStoryId) {
          try {
            console.log('💾 Saving new story to database:', story.story_title);

            // Save story to database with character relationship
            const { data, error } = await saveStory({
              story_title: story.story_title,
              character_id: state.characterId || undefined, // Link to the character!
              generation_params: story, // Store entire story object as generation_params for now
              photo_generation_stats: story.photo_generation_stats || {
                total: 0,
                successful: 0,
                failed: 0,
              },
              generation_state: {
                isGenerating: false,
                complete: true,
                progress: 100,
              },
            });

            console.log('🔗 Linking story to character:', {
              storyTitle: story.story_title,
              characterId: state.characterId,
            });

            if (data) {
              set({ currentStoryId: data.id });
              console.log('✅ Story saved with ID:', data.id);

              // Save story pages
              if (story.pages && story.pages.length > 0) {
                const pagesData = story.pages.map(page => ({
                  page_number: page.page_number,
                  page_type: page.page_type,
                  chapter_title: page.chapter_title || undefined,
                  content: page.content,
                  reasoning: page.reasoning,
                  photo_description: page.photo_description,
                  photo_data: page.photo_data || undefined,
                  photo_url: page.photo_url || undefined,
                  image_generation_params: {}, // Add image generation params when available
                  page_metadata: {}, // Add metadata when available
                }));

                await saveStoryPages(data.id, pagesData);
                console.log(
                  `✅ Saved ${pagesData.length} pages for story ${data.id}`
                );
              }
            }
          } catch (error) {
            console.error('Failed to save story to database:', error);
          }
        } else {
          console.log(
            'ℹ️ Story already saved to database with ID:',
            state.currentStoryId
          );
        }
      },
      updateStoryWithImages: async story => {
        const state = get();
        const { addStory } = get();
        set({ currentStory: story });

        // Update the story in the stories collection if it has an ID
        if (state.currentStoryId) {
          addStory(story, state.currentStoryId);
        }

        // Update database with image URLs if story exists in DB
        if (state.currentStoryId) {
          try {
            console.log('🖼️ Updating story pages with generated images');

            // Extract page updates for database
            const pageUpdates = story.pages.map(page => ({
              page_number: page.page_number,
              photo_url: page.photo_url || null,
              photo_data: page.photo_data || undefined,
            }));

            const result = await updateStoryPagesWithImages(
              state.currentStoryId,
              pageUpdates
            );

            if (result.error) {
              console.error(
                'Failed to update pages with images:',
                result.error
              );
            } else {
              console.log(
                `✅ Updated ${result.stats?.successful || 0} pages with images`
              );
            }

            // Also update the story's photo generation stats
            if (story.photo_generation_stats) {
              await updateStory(state.currentStoryId, {
                photo_generation_stats: story.photo_generation_stats,
              });
            }
          } catch (error) {
            console.error('Failed to update story with images:', error);
          }
        } else {
          console.log(
            '⚠️ No story ID found - cannot update database with images'
          );
        }
      },
      clearCurrentStory: () =>
        set({ currentStory: null, currentStoryId: null }),

      // Character analysis data
      characterAnalysis: null,
      characterId: null,
      setCharacterAnalysis: async (analysis, generationParams) => {
        set({ characterAnalysis: analysis });

        try {
          console.log(
            '💾 Saving character analysis to database:',
            analysis.character_name
          );

          // Transform CharacterAnalysis to match database structure
          const characterData = {
            character_name: analysis.character_name,
            character_age: analysis.character_age,
            character_gender: analysis.character_gender,
            physical_characteristics: {
              body_type_build: analysis.body_type_build,
              height_perception: analysis.height_perception,
              hairstyle: analysis.hairstyle,
              hair_color: analysis.hair_color,
              eye_color: analysis.eye_color,
              nose_shape: analysis.nose_shape,
              eyebrow_style: analysis.eyebrow_style,
              chin_shape: analysis.chin_shape,
              jawline: analysis.jawline,
              cheek_shape: analysis.cheek_shape,
              ear_shape_placement: analysis.ear_shape_placement,
              distinctive_facial_features: analysis.distinctive_facial_features,
              facial_proportions_symmetry: analysis.facial_proportions_symmetry,
              skin_tone: analysis.skin_tone,
              accessories: analysis.accessories,
            },
            description: analysis.description,
            generation_params: generationParams || {},
            avatar_data: {},
          };

          const { data, error } = await saveCharacterAnalysis(characterData);

          if (data) {
            set({ characterId: data.id });
            console.log('✅ Character analysis saved with ID:', data.id);
          }
        } catch (error) {
          console.error(
            'Failed to save character analysis to database:',
            error
          );
        }
      },
      clearCharacterAnalysis: () =>
        set({ characterAnalysis: null, characterId: null }),

      // Generation state
      generationState: initialGenerationState,
      setGenerationState: state =>
        set(current => ({
          generationState: { ...current.generationState, ...state },
        })),
      resetGenerationState: () =>
        set({ generationState: initialGenerationState }),

      // Generation steps
      generationSteps: defaultGenerationSteps,
      setGenerationSteps: steps => set({ generationSteps: steps }),

      // Generation timing
      timingData: {},
      setTimingData: timing =>
        set(state => ({
          timingData: { ...state.timingData, ...timing },
        })),
      clearTimingData: () => set({ timingData: {} }),

      // Utility methods
      startGeneration: () => {
        console.log(
          '🚀 Starting new story generation - clearing previous data'
        );
        set({
          // Clear previous story data
          currentStory: null,
          currentStoryId: null,
          characterAnalysis: null,
          characterId: null,
          // Set generation state
          generationState: {
            isGenerating: true,
            currentStepIndex: 0,
            progress: 0,
            complete: false,
          },
          timingData: { startTime: Date.now() },
        });
      },

      completeGeneration: () => {
        const { timingData, currentStory, currentStoryId, addStory } = get();
        const totalTime = timingData.startTime
          ? Date.now() - timingData.startTime
          : 0;

        // Add completed story to the stories collection
        if (currentStory && currentStoryId) {
          addStory(currentStory, currentStoryId);
        }

        set(state => ({
          generationState: {
            ...state.generationState,
            isGenerating: false,
            complete: true,
            progress: 100,
          },
          timingData: {
            ...state.timingData,
            totalTime,
          },
        }));
      },

      failGeneration: error =>
        set(state => ({
          generationState: {
            ...state.generationState,
            isGenerating: false,
            complete: false,
            error,
          },
        })),

      clearAllStoryData: () => {
        console.log(
          '🧹 Clearing current generation data (keeping story collection)'
        );
        set({
          // Clear current generation data
          currentStory: null,
          currentStoryId: null,
          characterAnalysis: null,
          characterId: null,
          generationState: initialGenerationState,
          timingData: {},
          // Note: We keep the stories array intact
        });
      },
    }),
    {
      name: 'story-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the generated data, not the transient generation state
      partialize: state => ({
        stories: state.stories, // Persist stories collection
        currentStory: state.currentStory,
        currentStoryId: state.currentStoryId,
        characterAnalysis: state.characterAnalysis,
        characterId: state.characterId,
        timingData: state.timingData,
      }),
    }
  )
);
