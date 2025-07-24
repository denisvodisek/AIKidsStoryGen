'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  analyzeCharacterImage,
  generateStory,
  artStylePromptEnhancer,
  generateImages,
} from '@/lib/gemini';
import { useOnboardingStore, useStoryStore } from '@/store';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export default function GeneratePage() {
  const { step1Data, step2Data } = useOnboardingStore();
  const {
    generationState,
    generationSteps,
    currentStory,
    currentStoryId,
    setGenerationState,
    setCharacterAnalysis,
    setCurrentStory,
    updateStoryWithImages,
    setTimingData,
    timingData,
    startGeneration,
    completeGeneration,
    failGeneration,
    clearAllStoryData,
  } = useStoryStore();
  const t = useTranslations('generate');
  // Live timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const {
    isGenerating,
    currentStepIndex,
    progress,
    complete: generationComplete,
    error: generationError,
  } = generationState;

  useEffect(() => {
    // Check if story is already generated
    if (currentStory && !generationComplete && !isGenerating) {
      // Story already exists, mark as complete
      completeGeneration();
      return;
    }
    if (
      step1Data &&
      step2Data &&
      !isGenerating &&
      !generationComplete &&
      !currentStory &&
      !generationError // <-- This prevents auto-retry after errors
    ) {
      handleGeneration();
    }
  }, [
    step1Data,
    step2Data,
    isGenerating,
    generationComplete,
    currentStory,
    generationError, // <-- Add this to dependencies
    completeGeneration,
  ]);

  // Live timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isGenerating) {
      // Start the timer when generation begins
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalId = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Date.now() - startTimeRef.current;
          setElapsedTime(elapsed);
        }
      }, 100); // Update every 100ms for smooth display
    } else {
      // Stop the timer when generation completes/fails
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (generationComplete || generationError) {
        startTimeRef.current = null; // Reset for next generation
      }
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGenerating, generationComplete, generationError]);
  // Confetti effect when story generation completes
  useEffect(() => {
    if (generationComplete) {
      // Trigger confetti animation
      const duration = 7000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Launch confetti from different positions
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [generationComplete]);

  // Remove the simulated progress - we'll use real progress from handleGeneration

  const handleGeneration = async () => {
    if (isGenerating) {
      console.log('Already generating...');
      return;
    }
    startGeneration();
    const startTime = Date.now();
    console.log(
      `[${new Date().toISOString()}] Starting story generation process...`
    );

    // Step 0: Starting character analysis (5% progress)
    setGenerationState({ currentStepIndex: 0, progress: 5 });

    const characterAnalysisStart = Date.now();
    console.log(`[${new Date().toISOString()}] Starting character analysis...`);

    try {
      if (!step1Data?.photoUrl) {
        throw new Error('Photo URL is required for character analysis');
      }

      const characterAnalyzer = await analyzeCharacterImage(
        step1Data.photoUrl as string,
        {
          character_name: step1Data?.name || '',
          character_age: step1Data?.age || 0,
          character_gender: step1Data?.gender || '',
        }
      );

      // Step 1: Character analysis complete, moving to story generation (30% progress)
      setGenerationState({ currentStepIndex: 1, progress: 30 });
      const characterAnalysisTime = Date.now() - characterAnalysisStart;
      setTimingData({ characterAnalysisTime });
      setCharacterAnalysis(characterAnalyzer);

      console.log(
        `[${new Date().toISOString()}] Character analysis completed in ${characterAnalysisTime}ms`
      );

      const storyGenerationStart = Date.now();
      console.log(`[${new Date().toISOString()}] Starting story generation...`);

      const storyGenerator = await generateStory({
        kidCharacterName: step1Data?.name || '',
        kidCharacterDescription: characterAnalyzer.description || '',
        storyArtStyle:
          step2Data?.style ||
          'disney-pixar'
            .replace('-', ' ')
            .replace(/\b\w/g, (char: string) => char.toUpperCase()),
        storyArtStyleDescription: artStylePromptEnhancer(
          step2Data?.style || 'disney-pixar'
        ),
        kidAge: step1Data?.age || 0,
        desiredPageCount: step2Data?.pageCount || 10,
        parentStoryIdea:
          step2Data?.customPrompt ||
          'LOCATION: ' +
            (step2Data?.destination || '') +
            ' ' +
            'LESSONS: ' +
            (step2Data?.themes || []).join(', '),
      });

      // Step 2: Story generation complete (70% progress)
      setGenerationState({ currentStepIndex: 2, progress: 70 });
      const storyGenerationTime = Date.now() - storyGenerationStart;
      const totalTime = Date.now() - startTime;

      setTimingData({
        storyGenerationTime,
        totalTime,
      });
      const storyID = generateId();
      setCurrentStory({ ...storyGenerator, id: storyID });

      console.log(
        `[${new Date().toISOString()}] Story generation completed in ${storyGenerationTime}ms`
      );
      console.log(
        `[${new Date().toISOString()}] Total process time: ${totalTime}ms`
      );
      console.log('storyGenerator', storyGenerator);

      // Step 3: Starting image generation (would be 75% if enabled)
      setGenerationState({ currentStepIndex: 3, progress: 75 });

      // Image generation is currently commented out, so we'll simulate a brief pause
      await new Promise(resolve => setTimeout(resolve, 1000));

      const imageGenerationStart = Date.now();
      console.log(`[${new Date().toISOString()}] Starting image generation...`);
      const imageGenerator = await generateImages(
        { ...storyGenerator, id: currentStoryId || storyID },
        (completed, total) => {
          const imageProgress = (completed / total) * 20; // 20% of total progress for images
          setGenerationState({ progress: Math.min(75 + imageProgress, 95) });
          console.log(
            `Image generation progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`
          );
        }
      );
      setGenerationState({ currentStepIndex: 4, progress: 95 });
      console.log('imageGenerator', imageGenerator);
      const imageGenerationTime = Date.now() - imageGenerationStart;
      setTimingData({ imageGenerationTime });
      // Update the story with generated images (both in store and database)
      await updateStoryWithImages(imageGenerator);

      // Step 4: Adding final touches (90% progress)
      setGenerationState({ currentStepIndex: 4, progress: 90 });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 5: Finalizing (95% progress)
      setGenerationState({ currentStepIndex: 5, progress: 95 });
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(
        `[${new Date().toISOString()}] Image generation completed in ${storyGenerationTime}ms`
      );
      console.log(
        `[${new Date().toISOString()}] Total process time: ${totalTime}ms`
      );

      console.log();
      // Complete generation (100% progress)
      completeGeneration();
    } catch (error) {
      console.error('Generation failed:', error);

      // Handle specific error types
      let errorMessage =
        'An unexpected error occurred while generating your story.';

      if (error instanceof Error) {
        const errorString = error.message.toLowerCase();

        if (
          errorString.includes('429') ||
          errorString.includes('quota') ||
          errorString.includes('rate limit')
        ) {
          errorMessage =
            "We've hit the API rate limit. Please wait a moment and try again, or contact support if this persists.";
        } else if (errorString.includes('analyze character image')) {
          errorMessage =
            "There was an issue analyzing your child's photo. Please try again or contact support.";
        } else if (
          errorString.includes('network') ||
          errorString.includes('fetch')
        ) {
          errorMessage =
            'Network connection issue. Please check your internet and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      failGeneration(errorMessage);
    }
  };

  const handleManualRetry = () => {
    // Reset error state and timer, then try again
    setGenerationState({ error: undefined });
    setElapsedTime(0);
    startTimeRef.current = null;
    handleGeneration();
  };

  if (!step1Data || !step2Data) {
    return (
      <div className="inset-0 z-50">
        {/* Missing Data Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 transition-all duration-1000 ease-in-out">
          {/* Floating guidance elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gentle floating particles with guidance theme */}
            <div className="absolute top-24 left-20 h-3 w-3 animate-pulse rounded-full bg-blue-300/50 opacity-70"></div>
            <div className="absolute top-36 right-28 h-2 w-2 animate-pulse rounded-full bg-purple-300/60 opacity-80 [animation-delay:-0.5s]"></div>
            <div className="absolute bottom-40 left-1/4 h-4 w-4 animate-pulse rounded-full bg-indigo-300/40 opacity-60 [animation-delay:-1s]"></div>
            <div className="absolute top-2/3 right-1/3 h-3 w-3 animate-pulse rounded-full bg-pink-300/50 opacity-70 [animation-delay:-1.5s]"></div>

            {/* Soft guiding orbs */}
            <div className="absolute top-28 right-20 h-18 w-18 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-blue-400/20 blur-lg [animation-delay:-0.8s]"></div>
            <div className="absolute bottom-28 left-20 h-22 w-22 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-lg [animation-delay:-1.3s]"></div>
            <div className="absolute top-1/2 right-1/4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-pink-400/20 blur-lg [animation-delay:-1.8s]"></div>

            {/* Path indicator sparkles */}
            <div className="absolute top-20 left-1/2 animate-ping text-xl opacity-60 [animation-duration:2.5s]">
              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
                width={32}
                height={32}
              />
            </div>
            <div className="absolute right-1/2 bottom-20 animate-ping text-2xl opacity-70 [animation-delay:-0.6s] [animation-duration:3.5s]">
              <Image
                src="/emojis/Robot.png"
                alt="Robot"
                width={32}
                height={32}
              />
            </div>
            <div className="absolute top-1/3 left-16 animate-ping text-lg opacity-50 [animation-delay:-1.1s] [animation-duration:4.5s]">
              <Image
                src="/emojis/Monkey.png"
                alt="Monkey"
                width={32}
                height={32}
              />
            </div>
            <div className="absolute right-20 bottom-1/3 animate-ping text-xl opacity-65 [animation-delay:-1.7s] [animation-duration:3.5s]">
              <Image
                src="/emojis/Helicopter.png"
                alt="Helicopter"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="animate-fade-in w-full max-w-2xl">
            {/* Guidance Icon & Title */}
            <div className="mb-12 text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-500 p-4 shadow-2xl">
                    <Image
                      src="/emojis/Compass.png"
                      alt="Guidance Compass"
                      width={80}
                      height={80}
                    />
                  </div>
                  {/* Guiding sparkles around the compass */}
                  <div className="absolute -top-3 -left-3 h-3 w-3 animate-ping rounded-full bg-purple-300"></div>
                  <div className="absolute -right-3 -bottom-3 h-3 w-3 animate-ping rounded-full bg-blue-300 [animation-delay:0.5s]"></div>
                  <div className="absolute -top-3 -right-3 h-2 w-2 animate-ping rounded-full bg-indigo-300 [animation-delay:1s]"></div>
                  <div className="absolute -bottom-3 -left-3 h-2 w-2 animate-ping rounded-full bg-pink-300 [animation-delay:1.5s]"></div>
                </div>
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text p-2 text-3xl font-bold text-transparent md:text-5xl">
                {t('missingData.title')}
              </h1>
              <div className="mx-auto max-w-lg rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                <p className="text-lg leading-relaxed text-white/90">
                  {t('missingData.description')}
                </p>
              </div>
            </div>

            {/* Journey Steps Preview */}
            <div className="mb-10 rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="mb-6 text-center text-lg font-semibold text-white">
                {t('missingData.journeyAhead')}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/20">
                    <Image
                      src="/emojis/Camera-With-Flash.png"
                      alt="Photo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {t('missingData.step1')}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('missingData.step1Description')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-400/20">
                    <Image
                      src="/emojis/Flying-Saucer.png"
                      alt="Adventure"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {t('missingData.step2')}
                    </div>
                    <div className="text-sm text-white/70">
                      {t('missingData.step2Description')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Link
                href="/onboarding/step-1"
                className="group hover:shadow-3xl relative block w-full overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 to-blue-600 px-8 py-6 text-center shadow-2xl transition-all hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center gap-4 text-2xl font-bold text-white">
                  <Image
                    src="/emojis/Rocket.png"
                    alt="Start Adventure"
                    width={38}
                    height={38}
                  />
                  {t('missingData.cta')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (generationComplete) {
    return (
      <div className="inset-0 z-50">
        {/* Celebratory Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 transition-all duration-1000 ease-in-out">
          {/* Floating celebration elements */}
          <div className="absolute inset-0">
            {/* Animated confetti particles */}
            <div className="absolute top-10 left-20 h-4 w-4 animate-bounce rounded-full bg-yellow-400 opacity-80 [animation-delay:-0.5s]"></div>
            <div className="absolute top-32 right-16 h-3 w-3 animate-bounce rounded-full bg-pink-400 [animation-delay:-1s]"></div>
            <div className="absolute top-48 left-1/3 h-5 w-5 animate-bounce rounded-full bg-blue-400 opacity-70 [animation-delay:-1.5s]"></div>
            <div className="absolute right-1/4 bottom-32 h-4 w-4 animate-bounce rounded-full bg-green-400 [animation-delay:-2s]"></div>
            <div className="absolute bottom-48 left-24 h-3 w-3 animate-bounce rounded-full bg-purple-400 opacity-90"></div>

            {/* Large celebration orbs */}
            <div className="absolute top-20 right-20 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/30 blur-lg [animation-delay:-0.5s]"></div>
            <div className="absolute bottom-20 left-20 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-green-400/30 to-teal-400/30 blur-lg [animation-delay:-1s]"></div>
            <div className="absolute top-1/2 right-32 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-pink-400/30 to-purple-400/30 blur-lg [animation-delay:-1.5s]"></div>

            {/* Sparkle effects */}
            <div className="absolute top-24 left-1/2 animate-ping text-2xl opacity-70 [animation-duration:3.5s]">
              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
                width={32}
                height={32}
              />
            </div>
            <div className="absolute right-1/3 bottom-24 animate-ping text-3xl opacity-60 [animation-delay:-0.7s] [animation-duration:2.5s]">
              <Image src="/emojis/Star.png" alt="Star" width={32} height={32} />
            </div>
            <div className="absolute top-1/3 right-12 animate-ping text-xl opacity-80 [animation-delay:-1.2s] [animation-duration:2.5s]">
              <Image
                src="/emojis/Compass.png"
                alt="Compass"
                width={32}
                height={32}
              />
            </div>
            <div className="absolute bottom-1/3 left-16 animate-ping text-2xl opacity-75 [animation-delay:-1.8s] [animation-duration:4.5s]">
              <Image
                src="/emojis/Robot.png"
                alt="Robot"
                width={32}
                height={32}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="animate-fade-in w-full max-w-2xl">
            {/* Success Icon & Title */}
            <div className="mb-12 text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-200 p-4 shadow-2xl">
                    <Image
                      src="/emojis/Party-Popper.png"
                      alt="Confetti"
                      width={80}
                      height={80}
                    />
                  </div>
                  {/* Celebration sparkles */}
                  <div className="absolute -top-4 -left-4 h-3 w-3 animate-ping rounded-full bg-yellow-300"></div>
                  <div className="absolute -right-4 -bottom-4 h-4 w-4 animate-ping rounded-full bg-pink-400 [animation-delay:0.5s]"></div>
                  <div className="absolute -top-4 -right-4 h-2 w-2 animate-ping rounded-full bg-blue-400 [animation-delay:1s]"></div>
                  <div className="absolute -bottom-4 -left-4 h-3 w-3 animate-ping rounded-full bg-green-400 [animation-delay:1.5s]"></div>
                </div>
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-white via-yellow-200 to-emerald-200 bg-clip-text p-2 text-3xl font-bold text-transparent md:text-4xl">
                {t('generationComplete.title')}
              </h1>
              <p className="text-lg text-white/90 md:text-xl">
                {t('generationComplete.description')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Primary CTA */}
              <Link
                href={
                  currentStoryId
                    ? `/my-stories/${currentStoryId}/preview`
                    : '/my-stories'
                }
                className="group hover:shadow-3xl relative block w-full overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 to-blue-600 px-4 py-3 text-center shadow-2xl transition-all hover:scale-105 md:px-6 md:py-4"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                <span className="relative flex items-center justify-center gap-4 text-lg font-bold text-white md:text-xl">
                  <Image
                    src="/emojis/Maracas.png"
                    alt="Maracas"
                    width={38}
                    height={38}
                  />
                  {t('generationComplete.readStory')}
                </span>
              </Link>

              {/* Secondary Actions Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Link
                  href={
                    currentStory?.id
                      ? `/my-stories/${currentStoryId}/edit`
                      : '/my-stories'
                  }
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                >
                  <Image
                    src="/emojis/Pencil.png"
                    alt="Pencil"
                    width={24}
                    height={24}
                  />
                  <span className="text-lg font-semibold text-white">
                    {t('generationComplete.editStory')}
                  </span>
                </Link>

                <Link
                  href="/my-stories"
                  className="group flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                >
                  <Image
                    src="/emojis/Books.png"
                    alt="Pencil"
                    width={24}
                    height={24}
                  />
                  <span className="text-lg font-semibold text-white">
                    {t('generationComplete.myStories')}
                  </span>
                </Link>
              </div>

              {/* Create Another Story */}
              <Link
                href="/onboarding/step-1"
                className="group block w-full rounded-3xl bg-white/10 px-6 py-4 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                onClick={() => {
                  clearAllStoryData();
                }}
              >
                <span className="flex items-center justify-center gap-3 text-lg font-semibold text-white md:text-xl">
                  <Image
                    src="/emojis/Sparkles.png"
                    alt="Confetti"
                    width={24}
                    height={24}
                  />
                  {t('generationComplete.createAnother')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (generationError) {
    const isRateLimit =
      generationError?.toLowerCase().includes('rate limit') ||
      generationError?.toLowerCase().includes('quota') ||
      generationError?.toLowerCase().includes('429');

    const isNetworkError =
      generationError?.toLowerCase().includes('network') ||
      generationError?.toLowerCase().includes('fetch') ||
      generationError?.toLowerCase().includes('connection');

    return (
      <div className="inset-0 z-50">
        {/* Error Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-red-600 via-pink-700 to-orange-800 transition-all duration-1000 ease-in-out">
          {/* Floating error elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gentle floating particles (less aggressive than celebration) */}
            <div className="absolute top-20 left-24 h-3 w-3 animate-pulse rounded-full bg-yellow-300/40 opacity-60"></div>
            <div className="absolute top-40 right-32 h-2 w-2 animate-pulse rounded-full bg-orange-300/50 opacity-70 [animation-delay:-0.5s]"></div>
            <div className="absolute bottom-32 left-1/3 h-4 w-4 animate-pulse rounded-full bg-red-300/30 opacity-50 [animation-delay:-1s]"></div>
            <div className="absolute top-1/2 right-1/4 h-3 w-3 animate-pulse rounded-full bg-pink-300/40 opacity-60 [animation-delay:-1.5s]"></div>

            {/* Soft glowing orbs */}
            <div className="absolute top-32 right-24 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-orange-400/20 to-red-400/20 blur-xl [animation-delay:-0.7s]"></div>
            <div className="absolute bottom-24 left-24 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-pink-400/20 to-orange-400/20 blur-xl [animation-delay:-1.2s]"></div>
            <div className="absolute top-2/3 right-1/3 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-pink-400/20 blur-xl [animation-delay:-1.8s]"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="animate-fade-in w-full max-w-2xl">
            {/* Error Icon & Title */}
            <div className="mb-12 text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 p-4 shadow-2xl">
                    <Image
                      src="/emojis/Hear-No-Evil-Monkey.png"
                      alt="Error"
                      width={64}
                      height={64}
                    />
                  </div>
                  {/* Gentle sparkles around the error icon */}
                  <div className="absolute -top-2 -left-2 h-2 w-2 animate-pulse rounded-full bg-orange-300 opacity-60"></div>
                  <div className="absolute -right-2 -bottom-2 h-2 w-2 animate-pulse rounded-full bg-yellow-300 opacity-70 [animation-delay:0.5s]"></div>
                  <div className="absolute -top-2 -right-2 h-1 w-1 animate-pulse rounded-full bg-red-300 opacity-50 [animation-delay:1s]"></div>
                  <div className="absolute -bottom-2 -left-2 h-1 w-1 animate-pulse rounded-full bg-pink-300 opacity-60 [animation-delay:1.5s]"></div>
                </div>
              </div>

              <h1 className="mb-6 bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text p-2 text-4xl font-bold text-transparent md:text-5xl">
                {isRateLimit
                  ? t('generationError.rateLimitTitle')
                  : isNetworkError
                    ? t('generationError.connectionIssueTitle')
                    : t('generationError.defaultTitle')}
              </h1>
              <div className="mx-auto max-w-xl rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                <p className="text-lg leading-relaxed text-white/90">
                  {isRateLimit
                    ? t('generationError.rateLimitDescription')
                    : isNetworkError
                      ? t('generationError.connectionIssueDescription')
                      : generationError ||
                        t('generationError.defaultDescription')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-6">
              {/* Primary Retry Button */}
              <button
                onClick={handleManualRetry}
                disabled={isGenerating}
                className={`group relative block w-full overflow-hidden rounded-3xl px-8 py-6 text-center shadow-2xl transition-all ${
                  isGenerating
                    ? 'cursor-not-allowed bg-gray-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:from-blue-400 hover:to-purple-500'
                }`}
              >
                {!isGenerating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
                )}
                <span className="relative flex items-center justify-center gap-4 text-lg font-bold text-white md:text-2xl">
                  <Image
                    src="/emojis/Nerd-Face.png"
                    alt="Retry"
                    width={32}
                    height={32}
                    className={isGenerating ? 'animate-spin' : ''}
                  />
                  {isGenerating
                    ? t('generationError.retrying')
                    : t('generationError.retry')}
                </span>
              </button>

              {/* Secondary Actions */}
              <div className="space-y-4">
                <Link
                  href="/onboarding/step-1"
                  className="group flex items-center justify-center gap-4 rounded-2xl bg-white/10 px-8 py-5 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                  onClick={() => {
                    clearAllStoryData();
                  }}
                >
                  <Image
                    src="/emojis/Raising-Hands.png"
                    alt="Start Over"
                    width={28}
                    height={28}
                  />
                  <span className="text-xl font-semibold text-white">
                    {t('generationError.startFresh')}
                  </span>
                </Link>

                {/* Help Section */}
                <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="mb-4 text-center text-lg font-semibold text-white">
                    {t('generationError.needHelp')}
                  </h3>
                  <div className="space-y-3 text-center">
                    <p className="text-sm text-white/80">
                      {isRateLimit
                        ? t('generationError.rateLimitHelp')
                        : isNetworkError
                          ? t('generationError.connectionIssueHelp')
                          : t('generationError.defaultHelp')}
                    </p>
                    <a
                      href="mailto:support@aikidsstorygen.com"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
                    >
                      <Image
                        src="/emojis/Love-Letter.png"
                        alt="Email"
                        width={16}
                        height={16}
                      />
                      {t('generationError.contactSupport')}
                    </a>
                  </div>
                </div>

                {/* Quick Tips */}
                {(isNetworkError || isRateLimit) && (
                  <div className="rounded-2xl bg-white/5 p-6 backdrop-blur-sm">
                    <h3 className="mb-3 text-center text-lg font-semibold text-white">
                      {t('generationError.quickTips')}
                    </h3>
                    <div className="space-y-2 text-sm text-white/80">
                      {isRateLimit ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-300">•</span>
                            <span>{t('generationError.rateLimitTip1')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-300">•</span>
                            <span>{t('generationError.rateLimitTip2')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-300">•</span>
                            <span>{t('generationError.rateLimitTip3')}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-300">•</span>
                            <span>
                              {t('generationError.connectionIssueTip1')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-300">•</span>
                            <span>
                              {t('generationError.connectionIssueTip2')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-300">•</span>
                            <span>
                              {t('generationError.connectionIssueTip3')}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0 z-50">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300 opacity-70"></div>
          <div className="absolute top-32 right-32 h-2 w-2 animate-ping rounded-full bg-pink-300"></div>
          <div className="absolute top-60 left-1/4 h-4 w-4 animate-pulse rounded-full bg-blue-300 opacity-60"></div>
          <div className="absolute right-1/4 bottom-40 h-3 w-3 animate-ping rounded-full bg-green-300"></div>
          <div className="absolute bottom-60 left-32 h-2 w-2 animate-pulse rounded-full bg-purple-300"></div>

          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl"></div>
          <div className="absolute right-1/4 bottom-1/4 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-xl [animation-delay:1s]"></div>
          <div className="absolute top-1/2 left-1/2 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-pink-400/20 to-yellow-400/20 blur-xl [animation-delay:2s]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="animate-fade-in w-full max-w-2xl">
          {/* Main Logo/Title Area */}
          <div className="mb-12 text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-2 shadow-2xl">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <Image
                      src="/emojis/Writing-Hand.png"
                      alt="Writing Hand"
                      width={48}
                      height={48}
                    />
                  </div>
                </div>
                {/* Magic sparkles around the logo */}
                <div className="absolute -top-2 -left-2 h-2 w-2 animate-ping rounded-full bg-yellow-400"></div>
                <div className="absolute -right-2 -bottom-2 h-2 w-2 animate-ping rounded-full bg-pink-400 [animation-delay:0.5s]"></div>
                <div className="absolute -top-2 -right-2 h-1 w-1 animate-pulse rounded-full bg-blue-400"></div>
                <div className="absolute -bottom-2 -left-2 h-1 w-1 animate-pulse rounded-full bg-purple-400 [animation-delay:1s]"></div>
              </div>
            </div>

            <h1 className="mb-4 bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text p-2 text-3xl font-bold text-transparent md:text-5xl">
              {t('generating.title')}
            </h1>
            <p className="text-lg text-white/80 md:text-xl">
              {t('generating.subtitle')}{' '}
              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
                width={24}
                height={24}
                className="inline-block"
              />
            </p>
            <div className="mt-2 text-xs text-white/60">
              {t('generating.eta')}
            </div>
          </div>

          {/* Current Step Indicator */}
          <div className="mb-10">
            <div className="relative mx-auto max-w-md rounded-2xl bg-white/10 px-6 py-8 backdrop-blur-md">
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`absolute top-1.5 right-2 text-sm transition-all duration-300 ${
                    isGenerating
                      ? 'animate-pulse text-yellow-300'
                      : 'text-white/80'
                  }`}
                >
                  {isGenerating ? (
                    <span className="font-medium tabular-nums">
                      <Image
                        src="/emojis/Hourglass-Done.png"
                        alt="Clock"
                        width={16}
                        height={16}
                        className="me-1 -mt-0.5 inline-block"
                      />
                      {Math.floor(elapsedTime / 1000)}s
                    </span>
                  ) : (
                    <span className="tabular-nums">
                      {timingData?.totalTime
                        ? Math.round(timingData.totalTime / 1000 / 60)
                        : 0}
                      s
                    </span>
                  )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  <span className="animate-pulse text-2xl">
                    {generationSteps[currentStepIndex]?.emoji}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white transition-all duration-500">
                    {t(
                      `generating.status.${generationSteps[currentStepIndex]?.text}`
                    )}
                    ...
                  </p>
                  <div className="mt-2 flex space-x-1">
                    <div className="h-1 w-6 animate-pulse rounded-full bg-white/40 [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-4 animate-pulse rounded-full bg-white/30 [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-8 animate-pulse rounded-full bg-white/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-8">
            {/* Main Progress Bar */}
            <div className="mx-auto max-w-lg space-y-4">
              <div className="flex justify-between text-white">
                <span className="text-lg font-medium">
                  {t('generating.progress')}
                </span>
                <span className="text-xl font-bold text-yellow-300">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="relative h-6 overflow-hidden rounded-full bg-white/10 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 shadow-lg transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="animate-shimmer h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>

                {/* Progress glow effect */}
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-yellow-400/50 via-pink-400/50 to-purple-400/50 blur-sm transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="text-center">
                <p className="text-sm text-white/90 transition-all duration-500">
                  {progress < 30 && t('generating.status.analyzing')}
                  {progress >= 30 &&
                    progress < 70 &&
                    t('generating.status.crafting')}
                  {progress >= 70 &&
                    progress < 90 &&
                    t('generating.status.creatingIllustrations')}
                  {progress >= 90 &&
                    progress < 100 &&
                    t('generating.status.finalTouches')}
                  {progress >= 100 && t('generating.status.ready')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
