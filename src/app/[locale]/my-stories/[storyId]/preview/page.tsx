'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
} from 'lucide-react';
import { StoryPage, GeneratedStory } from '@/types';
import { useTranslations } from 'next-intl';

interface Story extends Omit<GeneratedStory, 'pages'> {
  story_pages: (StoryPage & { id: string })[];
  generation_params: any;
  created_at: string;
}

export default function StoryPreviewPage() {
  const params = useParams();
  const storyId = params?.storyId as string;
  const t = useTranslations('storyPreview');

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Touch/swipe handling
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stories/${storyId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch story');
        }

        const { story: fetchedStory } = await response.json();

        // Sort pages by page number
        const sortedStory = {
          ...fetchedStory,
          story_pages: [...fetchedStory.story_pages].sort(
            (a, b) => a.page_number - b.page_number
          ),
        };
        console.log('sortedStory', sortedStory);
        setStory(sortedStory);
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [storyId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousPage();
      } else if (e.key === 'ArrowRight') {
        goToNextPage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPageIndex, story]);

  const goToPreviousPage = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - 1));
  };

  const goToNextPage = () => {
    if (story) {
      setCurrentPageIndex(prev =>
        Math.min(story.story_pages.length - 1, prev + 1)
      );
    }
  };

  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = story && currentPageIndex < story.story_pages.length - 1;

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && canGoNext) {
      goToNextPage();
    }
    if (isRightSwipe && canGoPrevious) {
      goToPreviousPage();
    }
  };

  // Download image functionality
  const handleDownloadImage = async () => {
    if (
      !story ||
      shouldShowFallback ||
      !story.story_pages[currentPageIndex]?.photo_url
    )
      return;

    try {
      setIsDownloading(true);
      const imageUrl = story.story_pages[currentPageIndex].photo_url!;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${story.story_title}-page-${currentPageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      setShowControls(true);
      timeoutId = setTimeout(() => setShowControls(false), 3000);
    };

    const handleUserActivity = () => resetTimeout();

    // Set initial timeout
    resetTimeout();

    // Add event listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Magical Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/50 opacity-70"></div>
            <div className="absolute top-40 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s]"></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/emojis/Hourglass-Done.png"
                alt="Hourglass Done"
                width={64}
                height={64}
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">{t('loading')}</h2>
            <p className="text-white/80">{t('subloading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="fixed inset-0 z-50">
        {/* Magical Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/50 opacity-70"></div>
            <div className="absolute top-40 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s]"></div>
          </div>
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
                <Image
                  src="/emojis/Star.png"
                  alt="Star"
                  width={32}
                  height={32}
                />
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
        </div>

        {/* Error Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src="/emojis/Hear-No-Evil-Monkey.png"
                alt="Story Not Found"
                width={64}
                height={64}
              />
            </div>
            <h1 className="mb-4 text-2xl font-bold text-white">
              {t('notFound.title')}
            </h1>
            <p className="mb-6 text-white/80">{t('notFound.subtitle')}</p>
            <Link
              href="/my-stories"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              {t('notFound.cta')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentPage = story.story_pages[currentPageIndex];

  // TEMPORARY DEBUG: Force show fallbacks for all pages (remove this when satisfied)
  // const shouldShowFallback = true; // <-- Uncomment this line to force all fallbacks
  const shouldShowFallback = !currentPage?.photo_url; // Normal logic

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-Screen Image Background */}
      <div className="absolute inset-0">
        {!shouldShowFallback ? (
          <img
            src={currentPage.photo_url || ''}
            alt={`Page ${currentPage.page_number} of ${story.story_title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800">
            <div className="text-center">
              {(() => {
                const emojiImages = [
                  'Whale.png',
                  'T-Rex.png',
                  'Rabbit.png',
                  'Panda.png',
                  'Hamster.png',
                  'Fox.png',
                  'Dodo.png',
                  'Bear.png',
                  'Otter.png',
                  'Penguin.png',
                  'Sloth.png',
                ];
                // Use page number to deterministically select emoji - same page = same emoji
                const emojiIndex = currentPage?.page_number
                  ? (currentPage.page_number - 1) % emojiImages.length
                  : 0;
                const selectedEmoji = emojiImages[emojiIndex];
                return (
                  <Image
                    src={`/emojis/${selectedEmoji}`}
                    alt="Story Page"
                    width={80}
                    height={80}
                    className="mx-auto mb-4"
                  />
                );
              })()}
              <p className="text-white">{t('noImage')}</p>
            </div>
          </div>
        )}

        {/* Subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
      </div>

      {/* Top Controls Bar */}
      <div
        className={`absolute top-0 right-0 left-0 z-20 transition-all duration-300 ${
          showControls
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-b from-black/80 to-transparent p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/my-stories"
                className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t('topBar.back')}</span>
              </Link>

              <div className="hidden h-6 w-px bg-white/30 sm:block"></div>

              <h1 className="line-clamp-1 text-lg font-bold text-white sm:text-xl">
                {story.story_title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-white/80">
                {currentPageIndex + 1} / {story.story_pages.length}
              </span>

              {!shouldShowFallback && (
                <button
                  onClick={handleDownloadImage}
                  disabled={isDownloading}
                  className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:opacity-50"
                >
                  <DownloadIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isDownloading
                      ? t('topBar.downloading')
                      : t('topBar.download')}
                  </span>
                </button>
              )}

              <Link
                href={`/my-stories/${storyId}/edit`}
                className="flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30"
              >
                <EditIcon className="h-4 w-4" />
                <span className="hidden sm:inline">{t('topBar.edit')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Overlay - Top Left */}
      <div className="absolute top-20 right-4 left-4 z-10 sm:top-24 sm:right-auto sm:left-8 sm:max-w-lg">
        <div className="rounded-2xl bg-black/50 p-4 backdrop-blur-md sm:p-6">
          {currentPage && (
            <div className="space-y-4">
              {/* Page Title */}
              {currentPage.chapter_title && (
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  {currentPage.chapter_title}
                </h2>
              )}

              {/* Text Content */}
              <div className="text-white">
                {currentPage.page_type === 'cover' ? (
                  <div className="text-center sm:text-left">
                    <h1 className="mb-4 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                      {currentPage.content.split('\\n')[0]}
                    </h1>
                    {currentPage.content.split('\\n')[1] && (
                      <p className="text-lg text-white/90 sm:text-xl">
                        {currentPage.content.split('\\n')[1]}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-base leading-relaxed whitespace-pre-line sm:text-lg">
                    {currentPage.content}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div
        className={`absolute right-0 bottom-0 left-0 z-20 transition-all duration-300 ${
          showControls
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        }`}
      >
        <div className="bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <button
              onClick={goToPreviousPage}
              disabled={!canGoPrevious}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t('navigation.previous')}
              </span>
            </button>

            {/* Page Indicators */}
            <div className="flex items-center gap-2">
              {story.story_pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPageIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3 ${
                    index === currentPageIndex
                      ? 'scale-125 bg-white'
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={!canGoNext}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-white backdrop-blur-sm transition-all hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="hidden sm:inline">{t('navigation.next')}</span>
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Swipe Instructions - Mobile Only */}
      <div
        className={`absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transition-all duration-300 sm:hidden ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm text-white/80">{t('navigation.swipe')}</p>
        </div>
      </div>

      {/* Keyboard Instructions - Desktop Only */}
      <div
        className={`absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 transition-all duration-300 sm:block ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="rounded-full bg-black/50 px-4 py-2 backdrop-blur-sm">
          <p className="text-sm text-white/80">{t('navigation.keyboard')}</p>
        </div>
      </div>
    </div>
  );
}
