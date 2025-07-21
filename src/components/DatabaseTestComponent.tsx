'use client';

import { useEffect, useState } from 'react';
import { useOnboardingStore, useStoryStore } from '@/store';
import {
  OnboardingData,
  OnboardingStep2Data,
  CharacterAnalysis,
  GeneratedStory,
} from '@/types';
import { getAllStoriesByUser, getOnboardingSession } from '@/lib/supabase';

export default function DatabaseTestComponent() {
  const {
    sessionToken,
    initializeSession,
    setStep1Data,
    setStep2Data,
    step1Data,
    step2Data,
  } = useOnboardingStore();

  const {
    currentStory,
    currentStoryId,
    characterAnalysis,
    characterId,
    setCurrentStory,
    updateStoryWithImages,
    setCharacterAnalysis,
  } = useStoryStore();

  const [allStories, setAllStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize onboarding session on component mount
    initializeSession();
  }, []);

  const testOnboardingStep1 = async () => {
    setLoading(true);
    const testData: OnboardingData = {
      name: 'Alice Test',
      age: 5,
      gender: 'female',
      photoUrl: 'https://example.com/photo.jpg',
      photoPath: 'test-photos/alice.jpg',
    };

    await setStep1Data(testData);
    console.log('✅ Step 1 data saved to DB!');
    setLoading(false);
  };

  const testOnboardingStep2 = async () => {
    setLoading(true);
    const testData: OnboardingStep2Data = {
      destination: 'magical forest',
      themes: ['adventure', 'friendship'],
      style: 'disney-pixar',
      customPrompt: 'A story about courage and kindness',
      pageCount: 10,
    };

    await setStep2Data(testData);
    console.log('✅ Step 2 data saved to DB!');
    setLoading(false);
  };

  const testCharacterAnalysis = async () => {
    setLoading(true);
    const testCharacter: CharacterAnalysis = {
      character_name: 'Alice Test',
      character_age: '5',
      character_gender: 'female',
      body_type_build: 'average child build',
      height_perception: 'average height for age',
      hairstyle: 'shoulder-length wavy',
      hair_color: 'brown',
      eye_color: 'blue',
      nose_shape: 'small button nose',
      eyebrow_style: 'natural arched',
      chin_shape: 'rounded',
      jawline: 'soft',
      cheek_shape: 'full cheeks',
      ear_shape_placement: 'proportional',
      distinctive_facial_features: 'freckles across nose',
      facial_proportions_symmetry: 'well-proportioned',
      skin_tone: 'fair',
      accessories: 'small star earrings',
      description:
        'A cheerful 5-year-old girl with wavy brown hair and bright blue eyes.',
    };

    await setCharacterAnalysis(testCharacter, { source: 'test' });
    console.log('✅ Character analysis saved to DB!');
    setLoading(false);
  };

  const testStoryGeneration = async () => {
    setLoading(true);
    const testStory: GeneratedStory = {
      id: `test-story-${Date.now()}`,
      story_title: "Alice's Magical Adventure",
      pages: [
        {
          page_number: 1,
          page_type: 'cover',
          content: "Alice's Magical Adventure",
          reasoning: 'Cover page with title',
          photo_description: 'A magical forest scene with Alice',
          photo_data: null,
          photo_url: null,
        },
        {
          page_number: 2,
          page_type: 'story_page',
          content: 'Once upon a time, Alice discovered a magical forest...',
          reasoning: 'Opening scene to set the magical tone',
          photo_description: 'Alice standing at the edge of a glowing forest',
          photo_data: null,
          photo_url: null,
        },
      ],
      photo_generation_stats: {
        total: 2,
        successful: 0,
        failed: 0,
      },
    };

    await setCurrentStory(testStory);
    console.log('✅ Story with pages saved to DB!');
    setLoading(false);
  };

  const testImageUpdates = async () => {
    if (!currentStory || !currentStoryId) {
      alert('Please generate a story first!');
      return;
    }

    setLoading(true);

    // Simulate images being generated (fake URLs for testing)
    const storyWithImages: GeneratedStory = {
      ...currentStory,
      pages: currentStory.pages.map(page => ({
        ...page,
        photo_url: `https://example.com/fake-image-page-${page.page_number}.jpg`,
        photo_data: `fake-base64-data-${page.page_number}`,
      })),
      photo_generation_stats: {
        total: currentStory.pages.length,
        successful: currentStory.pages.length,
        failed: 0,
      },
    };

    await updateStoryWithImages(storyWithImages);
    console.log('✅ Story pages updated with fake image URLs!');
    setLoading(false);
  };

  const loadAllStories = async () => {
    setLoading(true);
    const { data, error } = await getAllStoriesByUser();
    if (data) {
      setAllStories(data);
      console.log('✅ Loaded all stories from DB:', data);
    } else {
      console.error('❌ Failed to load stories:', error);
    }
    setLoading(false);
  };

  const testDatabaseRetreval = async () => {
    if (sessionToken) {
      const { data, error } = await getOnboardingSession(sessionToken);
      if (data) {
        console.log('✅ Retrieved onboarding session from DB:', data);
      } else {
        console.log('ℹ️ No onboarding session found or error:', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">🧪 Database Test Component</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Test Buttons */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Database Saving</h2>

          <button
            onClick={testOnboardingStep1}
            disabled={loading}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '👶'} Test Onboarding Step 1
          </button>

          <button
            onClick={testOnboardingStep2}
            disabled={loading}
            className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '⚙️'} Test Onboarding Step 2
          </button>

          <button
            onClick={testCharacterAnalysis}
            disabled={loading}
            className="w-full rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '👤'} Test Character Analysis
          </button>

          <button
            onClick={testStoryGeneration}
            disabled={loading}
            className="w-full rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '📚'} Test Story Generation
          </button>

          <button
            onClick={testImageUpdates}
            disabled={loading || !currentStoryId}
            className="w-full rounded bg-pink-500 px-4 py-2 text-white hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '🖼️'} Test Image Updates
          </button>

          <button
            onClick={loadAllStories}
            disabled={loading}
            className="w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '📖'} Load All Stories
          </button>

          <button
            onClick={testDatabaseRetreval}
            disabled={loading || !sessionToken}
            className="w-full rounded bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? '⏳' : '🔍'} Test Database Retrieval
          </button>
        </div>

        {/* Current State */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Current State</h2>

          <div className="rounded bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Session Info</h3>
            <p className="text-sm">
              Token: {sessionToken ? '✅ Set' : '❌ Not set'}
            </p>
          </div>

          <div className="rounded bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Onboarding Data</h3>
            <p className="text-sm">
              Step 1: {step1Data ? '✅ Completed' : '❌ Not set'}
            </p>
            <p className="text-sm">
              Step 2: {step2Data ? '✅ Completed' : '❌ Not set'}
            </p>
          </div>

          <div className="rounded bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Character Analysis</h3>
            <p className="text-sm">
              Status: {characterAnalysis ? '✅ Completed' : '❌ Not set'}
            </p>
            <p className="text-sm">DB ID: {characterId || 'Not saved'}</p>
          </div>

          <div className="rounded bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Current Story</h3>
            <p className="text-sm">
              Status: {currentStory ? '✅ Generated' : '❌ Not set'}
            </p>
            <p className="text-sm">DB ID: {currentStoryId || 'Not saved'}</p>
            <p className="text-sm">Pages: {currentStory?.pages?.length || 0}</p>
          </div>

          <div className="rounded bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">
              All Stories ({allStories.length})
            </h3>
            {allStories.slice(0, 3).map((story, index) => (
              <p key={story.id} className="text-sm">
                {index + 1}. {story.story_title} (
                {story.story_pages?.length || 0} pages)
              </p>
            ))}
            {allStories.length > 3 && (
              <p className="text-sm text-gray-500">
                ... and {allStories.length - 3} more
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
        <h3 className="mb-2 font-medium text-yellow-800">💡 How to Use</h3>
        <ol className="space-y-1 text-sm text-yellow-700">
          <li>
            1. Click the test buttons to save data to your Supabase database
          </li>
          <li>
            2. Check your Supabase dashboard to see the data being inserted
          </li>
          <li>3. Use "Load All Stories" to verify data retrieval works</li>
          <li>4. Check the browser console for detailed logs</li>
          <li>5. Remove this component when you're ready for production!</li>
        </ol>
      </div>
    </div>
  );
}
