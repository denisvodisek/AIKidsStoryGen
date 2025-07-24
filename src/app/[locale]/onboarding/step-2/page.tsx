'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useOnboardingStore } from '@/store';

export default function OnboardingStep2() {
  const router = useRouter();
  const {
    step1Data,
    step2FormData,
    setStep2FormData,
    setStep2Data,
    isStep2Valid,
  } = useOnboardingStore();

  const [showAllDestinations, setShowAllDestinations] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);

  useEffect(() => {
    // Redirect if step 1 not completed
    if (!step1Data) {
      router.push('/onboarding/step-1');
      return;
    }
  }, [step1Data, router]);

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
      label: '🔄 2nd Chance',
      color: 'from-yellow-400 to-green-400',
    },
    { id: 'safety', label: '🛡️ Safety', color: 'from-blue-400 to-indigo-400' },
  ];

  const styleOptions = [
    {
      id: 'disney-pixar',
      label: 'Disney Pixar',
      description: 'Colorful 3D animation style',
      video: '/images/disney-pixar.mp4',
    },
    {
      id: 'paw-patrol',
      label: 'Paw Patrol',
      description: 'Fun cartoon adventure style',
      video: '/images/paw-patrol.mp4',
    },
    {
      id: 'lego',
      label: 'Lego',
      description: 'Blocky building brick style',
      video: '/images/lego.mp4',
    },
    {
      id: 'classic-disney',
      label: 'Classic Disney',
      description: 'Traditional hand-drawn style',
      video: '/images/classic-disney.mp4',
    },
  ];

  const displayedDestinations = showAllDestinations
    ? destinations
    : destinations.slice(0, 4);
  const displayedThemes = showAllThemes
    ? themeOptions
    : themeOptions.slice(0, 6);

  // Determine which mode user is in
  const hasCustomInput = step2FormData.customPrompt.trim().length > 0;
  const hasPresetSelections =
    Boolean(step2FormData.destination) || step2FormData.themes.length > 0;
  const isUsingCustomMode = hasCustomInput && !hasPresetSelections;
  const isUsingPresetMode = hasPresetSelections && !hasCustomInput;

  const handleDestinationSelect = (destination: string) => {
    if (hasCustomInput) return; // Don't allow if custom prompt is active
    setStep2FormData({
      destination: step2FormData.destination === destination ? '' : destination,
    });
  };

  const handleThemeToggle = (themeId: string) => {
    if (hasCustomInput) return; // Don't allow if custom prompt is active
    const currentThemes = step2FormData.themes;
    const newThemes = currentThemes.includes(themeId)
      ? currentThemes.filter(t => t !== themeId) // Remove if already selected
      : currentThemes.length < 2 // Only add if less than 2 themes selected
        ? [...currentThemes, themeId]
        : currentThemes; // Don't add if already at max (2)

    setStep2FormData({ themes: newThemes });
  };

  const handleStyleSelect = (styleId: string) => {
    setStep2FormData({
      style: step2FormData.style === styleId ? '' : styleId,
    });
  };

  const handleCustomPromptChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setStep2FormData({
      customPrompt: value,
      // Clear preset selections when starting to type
      ...(value.trim().length > 0 && {
        destination: '',
        themes: [],
        style: '',
      }),
    });
  };

  const clearCustomPrompt = () => {
    setStep2FormData({ customPrompt: '' });
  };

  const clearPresetSelections = () => {
    setStep2FormData({ destination: '', themes: [], style: '' });
  };

  const handleGenerate = async () => {
    if (isStep2Valid()) {
      // Store step 2 data using Zustand
      setStep2Data({
        destination: step2FormData.destination,
        themes: step2FormData.themes,
        style: step2FormData.style,
        customPrompt: step2FormData.customPrompt,
        pageCount: step2FormData.pageCount,
      });

      router.push('/auth?next=/generate');
    }
  };

  return (
    <div className="inset-0">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gentle floating particles - responsive positioning */}
          <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-cyan-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
          <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-yellow-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
          <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-pink-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          <div className="absolute top-2/3 right-1/3 h-2 w-2 animate-pulse rounded-full bg-blue-300/50 opacity-70 [animation-delay:-1.5s] sm:h-3 sm:w-3"></div>

          {/* Soft magical orbs - responsive sizes */}
          <div className="absolute top-20 right-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-lg [animation-delay:-0.8s] sm:top-28 sm:right-20 sm:h-16 sm:w-16"></div>
          <div className="absolute bottom-20 left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-lg [animation-delay:-1.3s] sm:bottom-28 sm:left-20 sm:h-20 sm:w-20"></div>
          <div className="absolute top-1/2 left-1/2 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-lg [animation-delay:-1.8s] sm:h-16 sm:w-16"></div>

          {/* Sparkle effects - hidden on mobile for cleaner look */}
          <div className="absolute top-12 right-1/2 hidden animate-ping text-lg opacity-60 sm:block sm:text-xl">
            ✨
          </div>
          <div className="absolute bottom-16 left-1/3 hidden animate-ping text-xl opacity-70 [animation-delay:-0.6s] sm:block sm:text-2xl">
            ⭐
          </div>
          <div className="absolute top-1/3 right-8 hidden animate-ping text-base opacity-50 [animation-delay:-1.1s] sm:right-16 sm:block sm:text-lg">
            🌟
          </div>
          <div className="absolute bottom-1/3 left-8 hidden animate-ping text-lg opacity-65 [animation-delay:-1.7s] sm:left-20 sm:block sm:text-xl">
            💫
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto mt-4 max-w-7xl sm:mt-6">
            {/* Header */}
            <div className="relative mb-6 text-center sm:mb-8">
              {/* Back Button */}
              <div className="absolute top-0 left-0 sm:top-2 sm:left-0">
                <Link
                  href="/onboarding/step-1"
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-white/90 backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Back</span>
                </Link>
              </div>

              {/* Generate Button - Top Right */}
              <div className="absolute top-0 right-0 sm:top-2 sm:right-0">
                <button
                  onClick={handleGenerate}
                  disabled={!isStep2Valid()}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                    isStep2Valid()
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105'
                      : 'cursor-not-allowed bg-white/20 text-white/50'
                  }`}
                >
                  <Image
                    src="/emojis/Magic-Wand.png"
                    alt="Magic Wand"
                    width={16}
                    height={16}
                  />
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 mb-6 flex justify-center sm:mt-8">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                  <div className="h-2 w-8 rounded-full bg-white/20"></div>
                  <span className="ml-2 text-sm text-white/70">
                    Step 2 of 3
                  </span>
                </div>
              </div>

              <h1 className="mb-4 text-2xl leading-tight font-bold text-white sm:mb-6 xl:text-4xl">
                Create {step1Data?.name || 'your child'}'s Adventure!
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
                Choose how you'd like to create your magical story
              </p>
            </div>

            {/* Style Selection Section */}
            <div className="mb-8 rounded-2xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-8">
              <div className="mb-6 text-center">
                <h2 className="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-white sm:text-xl">
                  <Image
                    src="/emojis/Pencil.png"
                    alt="Art"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  Choose Your Story Style
                </h2>
                <p className="text-white/80">
                  Select the visual style for your magical story
                </p>
              </div>

              <div className="flex max-w-7xl flex-wrap items-center justify-center gap-2 sm:gap-4">
                {styleOptions.map(style => (
                  <div
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`group relative max-w-3/7 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 md:max-w-1/5 ${
                      step2FormData.style === style.id
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-lg backdrop-blur-sm'
                        : 'border-white/20 bg-white/10 backdrop-blur-sm hover:scale-102 hover:border-cyan-300/60 hover:shadow-md'
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <video
                        className="h-full w-full scale-115 object-cover"
                        src={style.video}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={e => {
                          const video = e.currentTarget;
                          video.currentTime = 0;
                          video.play().catch(console.error);
                        }}
                        onMouseLeave={e => {
                          const video = e.currentTarget;
                          video.pause();
                          video.currentTime = 0;
                        }}
                        onError={e => console.error('Video error:', e)}
                      />
                      {/* <div className="bg-opacity-20 group-hover:bg-opacity-10 absolute inset-0 bg-black transition-opacity"></div> */}
                    </div>

                    <div className="p-3">
                      <h3 className="mb-1 text-sm font-semibold text-white">
                        {style.label}
                      </h3>
                      <p className="text-xs text-white/70">
                        {style.description}
                      </p>
                    </div>

                    {step2FormData.style === style.id && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-white shadow-lg">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content: Side by Side with Vertical OR */}
            <div className="mb-8 flex flex-col gap-1 lg:flex-row lg:gap-0">
              {/* Left Side: Custom Prompt */}
              <div
                className={`flex-1 transition-all duration-300 ${hasPresetSelections ? 'pointer-events-none opacity-40' : 'opacity-100'}`}
              >
                <div className="relative h-full rounded-2xl border-2 border-purple-300/30 bg-white/10 p-6 shadow-lg backdrop-blur-md sm:p-8">
                  <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-lg text-white shadow-lg">
                    <Image
                      src="/emojis/Writing-Hand.png"
                      alt="Writing"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white xl:text-2xl">
                      Tell Us Your Story Ideas
                    </h2>
                    {hasCustomInput && (
                      <button
                        onClick={clearCustomPrompt}
                        className="text-sm text-white/70 transition-colors hover:text-red-400"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <textarea
                    value={step2FormData.customPrompt}
                    onChange={handleCustomPromptChange}
                    placeholder="Describe the adventure you'd like for your child... Include characters, settings, challenges, and the lessons you want them to learn. Be as creative as you want!"
                    className="h-48 w-full resize-none rounded-xl border-2 border-white/20 bg-white/10 p-4 text-white backdrop-blur-sm transition-colors placeholder:text-white/60 focus:border-purple-400 focus:outline-none sm:h-64"
                    maxLength={1000}
                    disabled={hasPresetSelections}
                  />

                  <div className="mt-4 flex justify-between">
                    <p className="text-sm text-white/70">
                      Write your own unique story concept
                    </p>
                    <span className="text-sm text-white/60">
                      {step2FormData.customPrompt.length}/1000
                    </span>
                  </div>

                  {isUsingCustomMode && (
                    <div className="mt-4 rounded-xl border border-purple-300/30 bg-purple-500/20 p-4 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm font-medium text-purple-200">
                        <Image
                          src="/emojis/Sparkles.png"
                          alt="Sparkles"
                          width={16}
                          height={16}
                        />
                        Great! We'll create a personalized story based on your
                        ideas.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical OR Divider - Desktop */}
              <div className="hidden lg:flex lg:items-center lg:justify-center lg:px-8">
                <div className="flex flex-col items-center">
                  <div className="h-24 w-px bg-white/30"></div>
                  <div className="my-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    OR
                  </div>
                  <div className="h-24 w-px bg-white/30"></div>
                </div>
              </div>

              {/* Horizontal OR Divider - Mobile */}
              <div className="flex items-center justify-center py-4 lg:hidden">
                <div className="flex items-center">
                  <div className="h-px w-20 bg-white/30"></div>
                  <div className="mx-4 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                    OR
                  </div>
                  <div className="h-px w-20 bg-white/30"></div>
                </div>
              </div>

              {/* Right Side: Preset Options */}
              <div
                className={`flex-1 transition-all duration-300 ${hasCustomInput ? 'pointer-events-none opacity-40' : 'opacity-100'}`}
              >
                <div className="relative h-full rounded-2xl border-2 border-blue-300/30 bg-white/10 p-6 shadow-lg backdrop-blur-md sm:p-8">
                  <div className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-lg text-white shadow-lg">
                    <Image
                      src="/emojis/Flying-Saucer.png"
                      alt="Adventure"
                      width={20}
                      height={20}
                    />
                  </div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white xl:text-2xl">
                      Choose From Options
                    </h2>
                    {hasPresetSelections && (
                      <button
                        onClick={clearPresetSelections}
                        className="text-sm text-white/70 transition-colors hover:text-red-400"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Destination Selection */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-white xl:text-lg">
                        <Image
                          src="/emojis/World-Map.png"
                          alt="Location"
                          width={20}
                          height={20}
                        />
                        Where will the adventure take place?
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayedDestinations.map(destination => (
                          <button
                            key={destination}
                            onClick={() => handleDestinationSelect(destination)}
                            disabled={hasCustomInput}
                            className={`rounded-lg border-2 p-3 text-left text-sm backdrop-blur-sm transition-all ${
                              step2FormData.destination === destination
                                ? 'border-cyan-400 bg-cyan-500/30 text-cyan-200 shadow-md'
                                : 'border-white/20 bg-white/10 text-white hover:border-cyan-300/60 hover:bg-white/20 hover:shadow-md'
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
                          className="mt-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
                        >
                          + {destinations.length - 4} more
                        </button>
                      )}
                    </div>

                    {/* Story Themes */}
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-white xl:text-lg">
                        <Image
                          src="/emojis/Star.png"
                          alt="Star"
                          width={20}
                          height={20}
                        />
                        What should they learn?
                        <span className="ml-2 text-sm text-white/60">
                          {step2FormData.themes.length > 0
                            ? `(${step2FormData.themes.length}/2 selected)`
                            : '(Max. 2 options)'}
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {displayedThemes.map(theme => {
                          const isSelected = step2FormData.themes.includes(
                            theme.id
                          );
                          const isMaxReached = step2FormData.themes.length >= 2;
                          const isDisabled =
                            hasCustomInput || (!isSelected && isMaxReached);

                          return (
                            <button
                              key={theme.id}
                              onClick={() => handleThemeToggle(theme.id)}
                              disabled={isDisabled}
                              className={`truncate rounded-lg border-2 p-3 text-left text-sm leading-none backdrop-blur-sm transition-all ${
                                isSelected
                                  ? 'border-pink-400 bg-pink-500/30 text-pink-200 shadow-md'
                                  : isDisabled
                                    ? 'cursor-not-allowed border-white/20 bg-white/5 text-white/40'
                                    : 'cursor-pointer border-white/20 bg-white/10 text-white hover:border-pink-300/60 hover:bg-white/20 hover:shadow-md'
                              }`}
                            >
                              {theme.label}
                            </button>
                          );
                        })}
                      </div>

                      {!showAllThemes && themeOptions.length > 6 && (
                        <button
                          onClick={() => setShowAllThemes(true)}
                          disabled={hasCustomInput}
                          className="mt-2 text-sm font-medium text-pink-300 hover:text-pink-200"
                        >
                          + {themeOptions.length - 6} more
                        </button>
                      )}
                    </div>
                  </div>

                  {isUsingPresetMode && (
                    <div className="mt-6 rounded-xl border border-blue-300/30 bg-blue-500/20 p-4 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm font-medium text-blue-200">
                        <Image
                          src="/emojis/Star-Struck.png"
                          alt="Adventure"
                          width={20}
                          height={20}
                        />
                        Perfect! We'll create a story with your selected
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
                disabled={!isStep2Valid()}
                className={`transform rounded-2xl px-8 py-4 text-lg font-semibold transition-all sm:rounded-full sm:px-12 sm:text-xl ${
                  isStep2Valid()
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                    : 'cursor-not-allowed bg-white/20 text-white/50'
                }`}
              >
                <span className="flex items-center justify-center gap-3">
                  <Image
                    src="/emojis/Magic-Wand.png"
                    alt="Magic Wand"
                    width={24}
                    height={24}
                  />
                  <span>Generate Magical Story</span>
                </span>
              </button>

              {isStep2Valid() && (
                <p className="mt-4 text-sm text-white/70">
                  You'll be asked to sign in before we create your magical
                  story!
                </p>
              )}

              {!isStep2Valid() && (
                <p className="mt-4 text-sm text-red-400">
                  Please either write your own story ideas OR select from the
                  options above
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
