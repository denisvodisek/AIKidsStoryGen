'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ExampleStory {
  id: string;
  story_title: string;
  story_pages: {
    id: string;
    page_number: number;
    page_type: string;
    content: string;
    photo_url?: string;
    photo_description: string;
  }[];
  created_at: string;
}

export default function ExamplesPage() {
  const [stories, setStories] = useState<ExampleStory[]>([]);
  const [loading, setLoading] = useState(true);

  // Specific story IDs to showcase
  const exampleStoryIds = [
    '44f6b461-4f8f-48d7-9cd2-3797f0190da9',
    '7448b5fc-bce3-41d9-a5cc-9b9e193f63b8',
    '11c2d890-3b33-489a-9e1e-a3770383596f',
    '7bf8743f-7484-4489-a594-0505273e2801',
  ];

  useEffect(() => {
    const fetchExampleStories = async () => {
      try {
        setLoading(true);
        const storyPromises = exampleStoryIds.map(async storyId => {
          try {
            const response = await fetch(`/api/stories/${storyId}`);
            if (response.ok) {
              const { story } = await response.json();
              return {
                ...story,
                story_pages: [...story.story_pages].sort(
                  (a, b) => a.page_number - b.page_number
                ),
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching story ${storyId}:`, error);
            return null;
          }
        });

        const fetchedStories = await Promise.all(storyPromises);
        const validStories = fetchedStories.filter(story => story !== null);
        setStories(validStories);
      } catch (error) {
        console.error('Error fetching example stories:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    fetchExampleStories();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Magical background elements */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          <div className="absolute top-10 left-10 h-2 w-2 animate-pulse rounded-full bg-yellow-300"></div>
          <div className="absolute top-20 right-20 h-1 w-1 animate-ping rounded-full bg-pink-300"></div>
          <div className="absolute top-40 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300"></div>
          <div className="absolute right-1/4 bottom-20 h-2 w-2 animate-ping rounded-full bg-green-300"></div>
        </div>

        {/* Header */}
        <div className="relative z-20">
          <Header />
        </div>

        {/* Loading Content */}
        <div className="relative z-10 -mt-25 flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src={'/emojis/Hourglass-Done.png'}
                alt="Hourglass"
                width={64}
                height={64}
              />
            </div>
            <h2 className="mb-2 text-xl font-bold text-white">
              Loading magical examples...
            </h2>
            <p className="text-white/80">
              Preparing incredible adventures to inspire you
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Magical background elements - Same as landing page */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="absolute top-10 left-10 h-2 w-2 animate-pulse rounded-full bg-yellow-300"></div>
        <div className="absolute top-20 right-20 h-1 w-1 animate-ping rounded-full bg-pink-300"></div>
        <div className="absolute top-40 left-1/4 h-3 w-3 animate-pulse rounded-full bg-blue-300"></div>
        <div className="absolute right-1/4 bottom-20 h-2 w-2 animate-ping rounded-full bg-green-300"></div>
        <div className="absolute bottom-40 left-20 h-1 w-1 animate-pulse rounded-full bg-purple-300"></div>
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Hero Section */}
      <main className="relative z-20 container mx-auto px-4 py-16">
        <div className="relative z-30 mx-auto max-w-4xl text-center">
          <div className="relative mb-8">
            <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-2xl md:text-5xl">
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                See the Magic
              </span>{' '}
              <span className="inline-flex items-center justify-center gap-1 text-white">
                in Action!{' '}
                <Image
                  src="/emojis/Eyes.png"
                  alt="Eyes"
                  width={80}
                  height={80}
                />
              </span>
            </h1>

            {/* Floating elements around title */}
            <div className="absolute -top-4 -right-4 animate-bounce text-4xl">
              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
                width={60}
                height={60}
              />
            </div>
            <div className="absolute -bottom-4 -left-4 text-3xl">
              <Image
                src="/emojis/Magic-Wand.png"
                alt="Magic Wand"
                width={60}
                height={60}
              />
            </div>
          </div>

          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed font-light text-white/90 drop-shadow-lg md:text-xl">
            Discover incredible adventures created by our AI!
            <br />
            <span className="font-normal">
              Each story is personalized with real children as the heroes of
              their own magical tales.
            </span>{' '}
            <span className="inline-flex items-center justify-center gap-1 ps-1 pe-1">
              <Image
                src="/emojis/Star-Struck.png"
                alt="Star Struck"
                width={20}
                height={20}
              />
              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
                width={20}
                height={20}
              />
            </span>
          </p>
        </div>

        {/* Stories Showcase */}
        <div className="relative z-20 mx-auto max-w-6xl">
          {stories.length === 0 ? (
            <div className="text-center">
              <div className="mx-auto mb-8 max-w-md rounded-2xl bg-white/10 p-8 backdrop-blur-md">
                <div className="mb-6 flex justify-center">
                  <Image
                    src="/emojis/Hear-No-Evil-Monkey.png"
                    alt="Oops"
                    width={48}
                    height={48}
                  />
                </div>
                <h2 className="mb-4 text-xl font-bold text-white">
                  Examples Coming Soon!
                </h2>
                <p className="mb-6 text-white/80">
                  We're preparing amazing story examples to inspire you!
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
                  Create Your Own Story
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Featured Story - Large Card */}
              {stories[0] && (
                <div className="mb-16">
                  <h2 className="mb-8 text-center text-3xl font-bold text-white">
                    ✨ Featured Adventure ✨
                  </h2>
                  <Link
                    href={`/my-stories/${stories[0].id}/preview`}
                    className="group relative block overflow-hidden rounded-3xl bg-white/10 p-8 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                  >
                    <div className="grid gap-8 md:grid-cols-2">
                      {/* Story Image */}
                      <div className="aspect-square overflow-hidden rounded-2xl bg-white/20">
                        {stories[0].story_pages?.[0]?.photo_url ? (
                          <img
                            src={stories[0].story_pages[0].photo_url}
                            alt={stories[0].story_title}
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Image
                              src="/emojis/Sparkles.png"
                              alt="Story"
                              width={64}
                              height={64}
                              className="opacity-70"
                            />
                          </div>
                        )}
                      </div>

                      {/* Story Info */}
                      <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-3xl font-bold text-white">
                          {stories[0].story_title}
                        </h3>
                        <p className="text-lg leading-relaxed text-white/80">
                          {stories[0].story_pages?.[1]?.content?.substring(
                            0,
                            200
                          )}
                          ...
                        </p>
                        <div className="flex items-center gap-4 text-white/60">
                          <span className="flex items-center gap-1">
                            <Image
                              src="/emojis/Books.png"
                              alt="Pages"
                              width={20}
                              height={20}
                            />
                            {stories[0].story_pages?.length || 0} pages
                          </span>
                          <span className="flex items-center gap-1">
                            <Image
                              src="/emojis/Magic-Wand.png"
                              alt="Magic"
                              width={20}
                              height={20}
                            />
                            AI Generated
                          </span>
                        </div>
                        <div className="flex items-center gap-2 pt-4">
                          <span className="text-lg font-semibold text-pink-300">
                            Click to Read →
                          </span>
                          <Image
                            src="/emojis/Sparkles.png"
                            alt="Sparkles"
                            width={24}
                            height={24}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  </Link>
                </div>
              )}

              {/* More Examples Grid */}
              {stories.length > 1 && (
                <>
                  <h2 className="mb-8 text-center text-3xl font-bold text-white">
                    🌟 More Amazing Stories 🌟
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stories.slice(1).map(story => (
                      <Link
                        key={story.id}
                        href={`/my-stories/${story.id}/preview`}
                        className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                      >
                        {/* Story Image */}
                        <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-white/20">
                          {story.story_pages?.[0]?.photo_url ? (
                            <img
                              src={story.story_pages[0].photo_url}
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
                            {story.story_pages?.[1]?.content?.substring(
                              0,
                              100
                            ) ||
                              story.story_pages?.[0]?.content?.substring(
                                0,
                                100
                              )}
                            ...
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="flex items-center gap-1 text-xs text-white/60">
                              <Image
                                src="/emojis/Books.png"
                                alt="Pages"
                                width={16}
                                height={16}
                              />
                              {story.story_pages?.length || 0} pages
                            </span>
                            <span className="text-xs font-semibold text-pink-300">
                              Read Story →
                            </span>
                          </div>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 transition-opacity group-hover:opacity-100"></div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="mx-auto max-w-2xl rounded-3xl bg-white/10 p-8 backdrop-blur-md">
              <h2 className="mb-4 text-2xl font-bold text-white">
                Ready to Create Your Child's Adventure?
              </h2>
              <p className="mb-6 text-white/80">
                Join thousands of families creating personalized magical
                stories!
              </p>
              <Link
                href="/onboarding/step-1"
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-400 to-blue-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-110"
              >
                <Image
                  src="/emojis/Rocket.png"
                  alt="Rocket"
                  width={24}
                  height={24}
                />
                Start Creating Now
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
