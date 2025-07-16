'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingStep2() {
  const router = useRouter();
  const [childData, setChildData] = useState<any>(null);
  const [formData, setFormData] = useState({
    destination: '',
    themes: [] as string[],
    customPrompt: '',
  });
  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);

  useEffect(() => {
    // Get data from step 1
    const step1Data = localStorage.getItem('onboarding-step1');
    if (step1Data) {
      setChildData(JSON.parse(step1Data));
    }
    // Uncomment below if you want to force users to complete step 1 first
    // if (!step1Data) {
    //   router.push('/onboarding/step-1');
    //   return;
    // }
  }, [router]);

  const destinations = [
    '🏰 Enchanted Castle',
    '🌲 Magical Forest',
    '🏴‍☠️ Pirate Ship',
    '🚀 Space Station',
    '🦄 Rainbow Kingdom',
    '🏔️ Dragon Mountain',
    '🌊 Underwater Kingdom',
    '🎪 Circus Adventure',
  ];

  const themeOptions = [
    { id: 'kindness', label: '💝 Kindness', color: 'from-pink-400 to-red-400' },
    { id: 'sharing', label: '🎁 Sharing', color: 'from-green-400 to-blue-400' },
    {
      id: 'teamwork',
      label: '🤝 Teamwork',
      color: 'from-blue-400 to-purple-400',
    },
    {
      id: 'honesty',
      label: '📢 Honesty',
      color: 'from-yellow-400 to-orange-400',
    },
    { id: 'courage', label: '🦁 Courage', color: 'from-orange-400 to-red-400' },
    {
      id: 'friendship',
      label: '👫 Friendship',
      color: 'from-purple-400 to-pink-400',
    },
    { id: 'empathy', label: '💙 Empathy', color: 'from-cyan-400 to-blue-400' },
    {
      id: 'heroism',
      label: '🦸 Heroism',
      color: 'from-indigo-400 to-purple-400',
    },
    {
      id: 'cleanliness',
      label: '🧼 Cleanliness',
      color: 'from-green-400 to-cyan-400',
    },
    {
      id: 'second-chance',
      label: '🔄 Second Chance',
      color: 'from-yellow-400 to-green-400',
    },
    { id: 'safety', label: '🛡️ Safety', color: 'from-blue-400 to-indigo-400' },
  ];

  const displayedDestinations = showAllDestinations
    ? destinations
    : destinations.slice(0, 4);
  const displayedThemes = showAllThemes
    ? themeOptions
    : themeOptions.slice(0, 6);

  // Determine which mode user is in
  const hasCustomInput = formData.customPrompt.trim().length > 0;
  const hasPresetSelections =
    Boolean(formData.destination) || formData.themes.length > 0;
  const isUsingCustomMode = hasCustomInput && !hasPresetSelections;
  const isUsingPresetMode = hasPresetSelections && !hasCustomInput;

  const handleDestinationSelect = (destination: string) => {
    if (hasCustomInput) return; // Don't allow if custom prompt is active
    setFormData(prev => ({
      ...prev,
      destination: prev.destination === destination ? '' : destination,
    }));
  };

  const handleThemeToggle = (themeId: string) => {
    if (hasCustomInput) return; // Don't allow if custom prompt is active
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.includes(themeId)
        ? prev.themes.filter(t => t !== themeId)
        : [...prev.themes, themeId],
    }));
  };

  const handleCustomPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      customPrompt: value,
      // Clear preset selections when starting to type
      ...(value.trim().length > 0 && { destination: '', themes: [] }),
    }));
  };

  const clearCustomPrompt = () => {
    setFormData(prev => ({ ...prev, customPrompt: '' }));
  };

  const clearPresetSelections = () => {
    setFormData(prev => ({ ...prev, destination: '', themes: [] }));
  };

  const isFormValid = () => {
    return (
      (formData.destination && formData.themes.length > 0) ||
      formData.customPrompt.trim().length > 0
    );
  };

  const handleGenerate = () => {
    if (isFormValid()) {
      // Store step 2 data
      localStorage.setItem('onboarding-step2', JSON.stringify(formData));
      // Redirect to auth before story generation
      router.push('/auth?next=generate');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative mt-6 mb-8 text-center">
            {/* Simple Back Button */}
            <div className="absolute top-1 left-0 container mx-auto">
              <button
                onClick={() => router.push('/onboarding/step-1')}
                className="flex items-center space-x-2 rounded-full border bg-white px-3 py-2 text-sm transition-colors hover:text-gray-800"
              >
                <span>←</span>
                <span>Back</span>
              </button>
            </div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
              Create {childData?.name || 'your child'}'s Adventure! 🌟
            </h1>
            <p className="text-lg text-gray-600">
              Choose how you'd like to create your story
            </p>
          </div>

          {/* Main Content: Side by Side with Vertical OR */}
          <div className="mb-8 flex flex-col gap-8 lg:flex-row lg:gap-0">
            {/* Left Side: Custom Prompt */}
            <div
              className={`flex-1 transition-all duration-300 ${hasPresetSelections ? 'pointer-events-none opacity-40' : 'opacity-100'}`}
            >
              <div className="relative h-full rounded-2xl border-2 border-purple-200 bg-white p-8 shadow-lg">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-500 text-lg text-white shadow-lg">
                  ✍️
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Tell Us Your Story Ideas
                  </h2>
                  {hasCustomInput && (
                    <button
                      onClick={clearCustomPrompt}
                      className="text-sm text-gray-500 transition-colors hover:text-red-500"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <textarea
                  value={formData.customPrompt}
                  onChange={handleCustomPromptChange}
                  placeholder="Describe the adventure you'd like for your child... Include characters, settings, challenges, and the lessons you want them to learn. Be as creative as you want!"
                  className="h-64 w-full resize-none rounded-xl border-2 border-gray-200 p-4 text-lg transition-colors focus:border-purple-400 focus:outline-none"
                  maxLength={1000}
                  disabled={hasPresetSelections}
                />

                <div className="mt-4 flex justify-between">
                  <p className="text-sm text-gray-500">
                    Write your own unique story concept
                  </p>
                  <span className="text-sm text-gray-400">
                    {formData.customPrompt.length}/1000
                  </span>
                </div>

                {isUsingCustomMode && (
                  <div className="mt-4 rounded-xl bg-purple-50 p-4">
                    <p className="text-sm font-medium text-purple-700">
                      ✨ Great! We'll create a personalized story based on your
                      ideas.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Vertical OR Divider - Desktop */}
            <div className="hidden lg:flex lg:items-center lg:justify-center lg:px-8">
              <div className="flex flex-col items-center">
                <div className="h-24 w-px bg-gray-300"></div>
                <div className="my-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  OR
                </div>
                <div className="h-24 w-px bg-gray-300"></div>
              </div>
            </div>

            {/* Horizontal OR Divider - Mobile */}
            <div className="flex items-center justify-center py-4 lg:hidden">
              <div className="flex items-center">
                <div className="h-px w-20 bg-gray-300"></div>
                <div className="mx-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                  OR
                </div>
                <div className="h-px w-20 bg-gray-300"></div>
              </div>
            </div>

            {/* Right Side: Preset Options */}
            <div
              className={`flex-1 transition-all duration-300 ${hasCustomInput ? 'pointer-events-none opacity-40' : 'opacity-100'}`}
            >
              <div className="relative h-full rounded-2xl border-2 border-blue-200 bg-white p-8 shadow-lg">
                <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg text-white shadow-lg">
                  🎯
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Choose From Options
                  </h2>
                  {hasPresetSelections && (
                    <button
                      onClick={clearPresetSelections}
                      className="text-sm text-gray-500 transition-colors hover:text-red-500"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Destination Selection */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-700">
                      📍 Where will the adventure take place?
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {displayedDestinations.map(destination => (
                        <button
                          key={destination}
                          onClick={() => handleDestinationSelect(destination)}
                          disabled={hasCustomInput}
                          className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                            formData.destination === destination
                              ? 'border-purple-400 bg-purple-50 text-purple-800 shadow-md'
                              : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
                          } ${hasCustomInput ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {destination}
                        </button>
                      ))}
                    </div>

                    {!showAllDestinations && destinations.length > 4 && (
                      <button
                        onClick={() => setShowAllDestinations(true)}
                        disabled={hasCustomInput}
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800"
                      >
                        + {destinations.length - 4} more
                      </button>
                    )}
                  </div>

                  {/* Story Themes */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-700">
                      💡 What should they learn?
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {displayedThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeToggle(theme.id)}
                          disabled={hasCustomInput}
                          className={`rounded-lg border-2 p-3 text-left text-sm transition-all ${
                            formData.themes.includes(theme.id)
                              ? 'border-purple-400 bg-purple-50 text-purple-800 shadow-md'
                              : 'border-gray-200 bg-white hover:border-purple-200 hover:shadow-md'
                          } ${hasCustomInput ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {theme.label}
                        </button>
                      ))}
                    </div>

                    {!showAllThemes && themeOptions.length > 6 && (
                      <button
                        onClick={() => setShowAllThemes(true)}
                        disabled={hasCustomInput}
                        className="mt-2 text-sm font-medium text-purple-600 hover:text-purple-800"
                      >
                        + {themeOptions.length - 6} more
                      </button>
                    )}
                  </div>
                </div>

                {isUsingPresetMode && (
                  <div className="mt-6 rounded-xl bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-700">
                      🎯 Perfect! We'll create a story with your selected
                      preferences.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={handleGenerate}
              disabled={!isFormValid()}
              className={`transform rounded-full px-12 py-4 text-xl font-semibold transition-all ${
                isFormValid()
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                  : 'cursor-not-allowed bg-gray-300 text-gray-500'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span>🎭</span>
                <span>Generate Story</span>
              </span>
            </button>

            {isFormValid() && (
              <p className="mt-4 text-sm text-gray-600">
                You'll be asked to sign in before we create your magical story!
              </p>
            )}

            {!isFormValid() && (
              <p className="mt-4 text-sm text-red-500">
                Please either write your own story ideas OR select from the
                options above
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
