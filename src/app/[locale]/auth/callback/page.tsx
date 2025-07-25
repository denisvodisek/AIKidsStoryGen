'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);

        // Get the URL hash that contains the auth tokens
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setLoading(false);
          return;
        }

        if (data.session?.user) {
          console.log(
            'User authenticated successfully:',
            data.session.user.email
          );
          setUser(data.session.user);

          // Get the 'next' parameter from the original auth URL
          const nextUrl =
            searchParams?.get('next') || localStorage.getItem('auth_next_url');

          // Clean up the stored next URL
          localStorage.removeItem('auth_next_url');

          // Redirect based on next parameter
          if (nextUrl === 'generate') {
            router.push('/generate');
          } else if (nextUrl) {
            router.push(nextUrl);
          } else {
            router.push('/dashboard');
          }
        } else {
          setError('No user session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams, setUser, setLoading]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
        <div className="text-center">
          <div className="mb-4">
            <Image
              src="/emojis/Ghost.png"
              alt="Error"
              width={64}
              height={64}
              className="mx-auto"
            />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-white">
            Authentication Error
          </h1>
          <p className="mb-6 text-white/80">{error}</p>
          <button
            onClick={() => router.push('/auth')}
            className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
      <div className="text-center">
        {/* Magical loading animation */}
        <div className="relative mb-8">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/emojis/Magic-Wand.png"
              alt="Magic"
              width={32}
              height={32}
              className="animate-pulse"
            />
          </div>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-white">
          Welcome to the magical world!
        </h1>
        <p className="text-white/80">Setting up your account...</p>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-24 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/60"></div>
          <div className="absolute top-36 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/70 [animation-delay:-0.5s]"></div>
          <div className="absolute bottom-40 left-1/4 h-4 w-4 animate-pulse rounded-full bg-blue-300/50 [animation-delay:-1s]"></div>
        </div>
      </div>
    </div>
  );
}
