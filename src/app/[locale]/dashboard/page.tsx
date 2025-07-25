'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { getAllStoriesByUser } from '@/lib/supabase';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';

export default function Dashboard() {
  const { user, initialize, isInitialized } = useAuthStore();
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/auth');
    }
  }, [user, isInitialized, router]);

  // Load user stories
  useEffect(() => {
    const loadStories = async () => {
      if (user) {
        setLoading(true);
        const { data, error } = await getAllStoriesByUser(user.id);
        if (error) {
          console.error('Error loading stories:', error);
        } else {
          setStories(data || []);
        }
        setLoading(false);
      }
    };

    if (user) {
      loadStories();
    }
  }, [user]);

  if (!isInitialized || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          </div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Welcome back,{' '}
            {user.user_metadata?.full_name || user.email?.split('@')[0]}!
            <Image
              src="/emojis/Star-Struck.png"
              alt="Star Struck"
              width={40}
              height={40}
              className="ml-2 inline-block"
            />
          </h1>
          <p className="text-lg text-white/90">
            Ready to create more magical stories?
          </p>
        </div>

        {/* Create New Story Button */}
        <div className="mb-8 text-center">
          <Link
            href="/onboarding/step-1"
            className="inline-flex transform items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
          >
            <Image
              src="/emojis/Magic-Wand.png"
              alt="Magic Wand"
              width={24}
              height={24}
            />
            Create New Story
          </Link>
        </div>

        {/* Stories Section */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-3">
            <Image src="/emojis/Books.png" alt="Books" width={32} height={32} />
            <h2 className="text-2xl font-bold text-white">
              Your Magical Stories
            </h2>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              </div>
              <p className="text-white/80">Loading your stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl bg-white/10 p-8 text-center backdrop-blur-md">
              <div className="mb-4">
                <Image
                  src="/emojis/Sparkles.png"
                  alt="Sparkles"
                  width={48}
                  height={48}
                  className="mx-auto"
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                No stories yet!
              </h3>
              <p className="mb-6 text-white/80">
                Create your first magical story to get started.
              </p>
              <Link
                href="/onboarding/step-1"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
              >
                <Image
                  src="/emojis/Magic-Wand.png"
                  alt="Magic"
                  width={20}
                  height={20}
                />
                Create Your First Story
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stories.map(story => (
                <div
                  key={story.id}
                  className="group overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20"
                >
                  <div className="p-6">
                    {/* Story Cover Image */}
                    {(story.cover_photo ||
                      story.story_pages?.find(
                        (page: any) => page.photo_url
                      )) && (
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <img
                          src={
                            story.story_pages.find(
                              (page: any) => page.photo_url
                            )?.photo_url
                          }
                          alt={story.story_title}
                          className="h-32 w-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    )}

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
                      {story.story_title}
                    </h3>

                    {/* Character Info */}
                    {story.characters && (
                      <div className="mb-2 flex items-center gap-2 text-sm text-yellow-300">
                        <Image
                          src={
                            story.characters.character_gender === 'female'
                              ? '/emojis/Girl.png'
                              : '/emojis/Boy.png'
                          }
                          alt="Character"
                          width={16}
                          height={16}
                        />
                        <span className="font-medium">
                          {story.characters.character_name},{' '}
                          {story.characters.character_age} years old
                        </span>
                      </div>
                    )}

                    <p className="mb-4 text-sm text-white/70">
                      {story.story_pages?.length || 0} pages • Created{' '}
                      {new Date(story.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex gap-2">
                      <Link
                        href={`/my-stories/${story.id}/preview`}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-center text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-indigo-700"
                      >
                        Read Story
                      </Link>
                      <Link
                        href={`/my-stories/${story.id}/edit`}
                        className="flex-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-center text-sm font-medium text-white transition-all hover:from-green-600 hover:to-emerald-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
