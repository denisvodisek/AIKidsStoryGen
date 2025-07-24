'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStoryStore } from '@/store';

export default function MyStoriesPage() {
  const [loading, setLoading] = useState(true);
  const { getStories, clearAllStoryData } = useStoryStore();
  const stories = getStories();

  useEffect(() => {
    // Simple loading simulation since stories come directly from store
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="inset-0">
        {/* Magical Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 transition-all duration-1000 ease-in-out">
          {/* Floating magical elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
            <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
            <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            </div>
            <p className="text-lg text-white/90">
              Loading your magical stories...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inset-0">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
          <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
          <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          <div className="absolute top-2/3 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-300/50 opacity-70 [animation-delay:-1.5s] sm:h-3 sm:w-3"></div>

          <div className="absolute top-20 right-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-lg [animation-delay:-0.8s] sm:top-28 sm:right-20 sm:h-16 sm:w-16"></div>
          <div className="absolute bottom-20 left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-lg [animation-delay:-1.3s] sm:bottom-28 sm:left-20 sm:h-20 sm:w-20"></div>

          <div className="absolute top-12 right-1/2 hidden animate-ping text-lg opacity-60 sm:block sm:text-xl">
            ✨
          </div>
          <div className="absolute bottom-16 left-1/3 hidden animate-ping text-xl opacity-70 [animation-delay:-0.6s] sm:block sm:text-2xl">
            ⭐
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto mt-4 max-w-6xl sm:mt-6">
            {/* Header */}
            <div className="mb-8 text-center sm:mb-12">
              <h1 className="mb-4 text-2xl leading-tight font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
                Your Magical Stories
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
                All your wonderful adventures in one enchanted library
              </p>
            </div>

            {/* Stories Grid */}
            {stories.length === 0 ? (
              <div className="text-center">
                <div className="mx-auto mb-8 max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md">
                  <div className="mb-6 flex justify-center">
                    <Image
                      src="/emojis/Sparkles.png"
                      alt="Sparkles"
                      width={48}
                      height={48}
                    />
                  </div>
                  <h2 className="mb-4 text-xl font-bold text-white">
                    No Stories Yet
                  </h2>
                  <p className="mb-6 text-white/80">
                    Create your first magical adventure and it will appear here!
                  </p>
                  <Link
                    href="/onboarding/step-1"
                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
                  >
                    <Image
                      src="/emojis/Rocket.png"
                      alt="Rocket"
                      width={20}
                      height={20}
                    />
                    Create Your First Story
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stories.map(story => (
                  <Link
                    key={story.id}
                    href={`/my-stories/${story.id}/preview`}
                    className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                  >
                    {/* Story Image or Placeholder */}
                    <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-white/20">
                      {story.pages?.[0]?.photo_url ? (
                        <img
                          src={story.pages[0].photo_url}
                          alt={story.story_title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Image
                            src="/emojis/Magic-Wand.png"
                            alt="Story"
                            width={48}
                            height={48}
                            className="opacity-70"
                          />
                        </div>
                      )}
                    </div>

                    {/* Story Info */}
                    <div className="space-y-2">
                      <h3 className="line-clamp-2 text-lg font-bold text-white">
                        {story.story_title}
                      </h3>
                      <p className="line-clamp-3 text-sm text-white/70">
                        {story.pages?.[0]?.content?.substring(0, 100)}...
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-white/60">
                          {story.pages?.length || 0} pages
                        </span>
                        <span className="text-xs text-white/60">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </Link>
                ))}
              </div>
            )}

            {/* Create New Story Button */}
            <div className="mt-12 text-center">
              <Link
                href="/onboarding/step-1"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-105"
                onClick={() => {
                  clearAllStoryData();
                }}
              >
                <Image
                  src="/emojis/Sparkles.png"
                  alt="Sparkles"
                  width={24}
                  height={24}
                />
                Create New Adventure
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
