'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const GENERATION_STEPS = [
  { emoji: '✨', text: 'Transforming your child into a story hero' },
  { emoji: '🎨', text: 'Creating beautiful illustrations' },
  { emoji: '📚', text: 'Writing your personalized adventure' },
  { emoji: '🌟', text: 'Adding magical touches' },
  { emoji: '🎭', text: 'Bringing characters to life' },
  { emoji: '📖', text: 'Finalizing your story' },
];

export default function GeneratePage() {
  const [step1Data, setStep1Data] = useState<any>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Get onboarding data from localStorage
    const step1 = localStorage.getItem('onboarding-step1');
    const step2 = localStorage.getItem('onboarding-step2');

    if (step1) setStep1Data(JSON.parse(step1));
    if (step2) setStep2Data(JSON.parse(step2));

    // Auto-start generation
    if (step1 && step2) {
      startGeneration();
    }
  }, []);

  useEffect(() => {
    // if (!isGenerating) return;

    // Cycle through steps every 2 seconds
    const stepInterval = setInterval(() => {
      setCurrentStepIndex(prev => (prev + 1) % GENERATION_STEPS.length);
    }, 2000);

    // Simulate realistic progress - gradually increase to 70-80%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 75) {
          // Slower progress initially, then faster
          const increment =
            prev < 30 ? Math.random() * 3 + 1 : Math.random() * 2 + 0.5;
          return Math.min(prev + increment, 80);
        }
        return prev;
      });
    }, 200);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  const startGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentStepIndex(0);

    // Complete generation after 6 seconds
    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationComplete(true);
      }, 500); // Small delay to show 100% progress
    }, 6000);
  };

  if (!step1Data || !step2Data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
        <div className="mx-auto max-w-md text-center">
          <div className="rounded-3xl bg-white p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 text-6xl">🚫</div>
            <h2 className="mb-4 text-3xl font-bold text-gray-800">
              Oops! Story Data Missing
            </h2>
            <p className="mb-6 text-gray-600">
              We couldn't find your story preferences. Let's start your magical
              journey!
            </p>
            <Link
              href="/onboarding/step-1"
              className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            >
              ✨ Start Your Adventure
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (generationComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="rounded-3xl bg-white p-12 shadow-2xl backdrop-blur-sm">
              <div className="mb-8 text-6xl">🎉</div>
              <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                {step1Data?.name || "Your child's"} Story is Ready! ✨
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Your magical adventure has been crafted with love and
                creativity!
              </p>

              <div className="space-y-4">
                <Link
                  href="/story/view"
                  className="group block w-full overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-blue-600 px-8 py-5 text-xl font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-3">
                    📖 Read Your Story
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/onboarding/step-1"
                  className="block w-full rounded-2xl border-2 border-purple-400 bg-white px-8 py-5 text-xl font-semibold text-purple-600 transition-all hover:scale-105 hover:bg-purple-50"
                >
                  ✨ Create Another Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl bg-white/80 p-12 shadow-2xl backdrop-blur-sm">
            <div className="mb-8 animate-bounce text-6xl">🪄</div>
            <h1 className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
              Creating {step1Data?.name || "Your child's"} Magical Story...
            </h1>
            <p className="mb-10 text-xl text-gray-600">
              Our AI wizards are weaving magic into every word! ✨
            </p>

            {/* Current Step Indicator */}
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 p-6">
              <div className="text- flex items-center justify-center gap-4">
                <span className="animate-pulse text-2xl">
                  {GENERATION_STEPS[currentStepIndex].emoji}
                </span>
                <p className="font-medium text-gray-700 transition-all duration-500">
                  {GENERATION_STEPS[currentStepIndex].text}...
                </p>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="mb-8 space-y-6">
              <div className="flex justify-center space-x-3">
                <div className="h-4 w-4 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-pink-400 [animation-delay:-0.15s]"></div>
                <div className="h-4 w-4 animate-bounce rounded-full bg-indigo-400"></div>
              </div>

              {/* Step Progress Indicators */}
              <div className="flex justify-center space-x-2">
                {GENERATION_STEPS.map((step, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      index <= currentStepIndex
                        ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-lg font-medium text-gray-700">
                <span>Story Progress</span>
                <span className="text-purple-600">{Math.round(progress)}%</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 shadow-lg transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="h-full w-full animate-pulse bg-gradient-to-r from-white/30 to-transparent"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {progress < 30 && 'Getting started...'}
                {progress >= 30 && progress < 60 && 'Making great progress...'}
                {progress >= 60 && progress < 90 && 'Almost there...'}
                {progress >= 90 && 'Putting finishing touches...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
