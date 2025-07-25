'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAction = searchParams?.get('next');
  const isStoryCreationFlow = nextAction === 'generate';

  const { signInWithGoogle, isLoading, user } = useAuthStore();
  const t = useTranslations('auth');
  const locale = useLocale();

  // Store next URL for after auth callback
  useEffect(() => {
    if (nextAction) {
      localStorage.setItem('auth_next_url', nextAction);
    }
  }, [nextAction]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (nextAction === 'generate') {
        router.push('/generate');
      } else if (nextAction) {
        router.push(nextAction);
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, nextAction, router]);

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle(locale);
    if (error) {
      console.error('Sign in error:', error);
      // You could show an error toast here
    }
  };

  const handleFacebookSignIn = async () => {
    // TODO: Implement Facebook auth when needed
    console.log('Facebook auth not implemented yet');
  };

  const handleAppleSignIn = async () => {
    // TODO: Implement Apple auth when needed
    console.log('Apple auth not implemented yet');
  };

  return (
    <div className="inset-0 z-50">
      {/* Magical Authentication Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gentle floating particles with magical theme */}
          <div className="absolute top-24 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/60 opacity-80"></div>
          <div className="absolute top-36 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/70 opacity-90 [animation-delay:-0.5s]"></div>
          <div className="absolute bottom-40 left-1/4 h-4 w-4 animate-pulse rounded-full bg-blue-300/50 opacity-70 [animation-delay:-1s]"></div>
          <div className="absolute top-2/3 right-1/3 h-3 w-3 animate-pulse rounded-full bg-purple-300/60 opacity-80 [animation-delay:-1.5s]"></div>

          {/* Magical floating orbs */}
          <div className="absolute top-28 right-20 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-xl [animation-delay:-0.8s]"></div>
          <div className="absolute bottom-28 left-20 h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-xl [animation-delay:-1.3s]"></div>
          <div className="absolute top-1/2 right-1/4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-green-400/20 blur-xl [animation-delay:-1.8s]"></div>

          <div className="absolute right-1/2 bottom-20 animate-ping text-2xl opacity-80 [animation-delay:-0.6s] [animation-duration:3.5s]">
            <Image
              src="/emojis/Magic-Wand.png"
              alt="Magic Wand"
              width={32}
              height={32}
            />
          </div>
          <div className="absolute top-1/3 left-20 animate-ping text-lg opacity-60 [animation-delay:-1.2s] [animation-duration:4s]">
            <Image src="/emojis/Star.png" alt="Star" width={24} height={24} />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
          <div className="mx-auto w-full max-w-md">
            {isStoryCreationFlow && (
              <div className="mb-6 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-400"></div>
                  <span className="ml-2 text-sm text-white/70">
                    {t('storyFlow.progressStep')}
                  </span>
                </div>
              </div>
            )}

            {/* Welcome Header */}
            <div className="mb-8 text-center">
              {isStoryCreationFlow ? (
                <>
                  <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-2xl md:text-4xl">
                    {t('storyFlow.title')}
                    <Image
                      src="/emojis/Magic-Wand.png"
                      alt="Magic"
                      width={32}
                      height={32}
                      className="ml-2 inline-block"
                    />
                  </h1>
                  <div className="my-2 flex items-center justify-center gap-2 text-yellow-300">
                    <Image
                      src="/emojis/Sparkles.png"
                      alt="Sparkles"
                      width={16}
                      height={16}
                    />
                    <span className="text-sm font-bold">
                      {t('storyFlow.waitingText')}
                    </span>
                    <Image
                      src="/emojis/Sparkles.png"
                      alt="Sparkles"
                      width={16}
                      height={16}
                    />
                  </div>
                  <p className="text-lg text-white/90">
                    {t('storyFlow.subtitle')}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-2xl md:text-4xl">
                    {t('general.title')}
                    <Image
                      src="/emojis/Magic-Wand.png"
                      alt="Magic"
                      width={32}
                      height={32}
                      className="ml-2 inline-block"
                    />
                  </h1>
                  <p className="text-lg text-white/90">
                    {t('general.subtitle')}
                  </p>
                </>
              )}
            </div>

            {/* Auth Card */}
            <div className="relative rounded-3xl backdrop-blur-md">
              <div className="relative">
                {/* Floating particles inside card */}
                <div className="absolute top-4 left-4 h-2 w-2 animate-ping rounded-full bg-yellow-300/80"></div>
                <div className="absolute top-6 right-6 h-3 w-3 animate-pulse rounded-full bg-pink-300/70 [animation-delay:-0.5s]"></div>
                <div className="absolute bottom-4 left-6 h-2 w-2 animate-ping rounded-full bg-blue-300/60 [animation-delay:-1s]"></div>

                {/* Google Login - Primary */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-lg font-bold text-gray-700 shadow-xl transition-all hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                  ) : (
                    <Image
                      src="/images/google-logo.png"
                      alt="Google"
                      width={24}
                      height={24}
                    />
                  )}
                  {isLoading
                    ? 'Signing in...'
                    : isStoryCreationFlow
                      ? t('storyFlow.createAccountWithGoogle')
                      : t('general.continueWithGoogle')}
                </button>

                {/* Facebook & Apple */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleFacebookSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Image
                      src="/images/facebook-logo.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="invert"
                    />
                    {t('general.facebook')}
                  </button>
                  <button
                    onClick={handleAppleSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Image
                      src="/images/apple-logo.png"
                      alt="Apple"
                      width={20}
                      height={20}
                    />
                    {t('general.apple')}
                  </button>
                </div>

                {/* Benefits Showcase */}
                <div className="mt-8 space-y-3 rounded-2xl bg-white/10 p-4">
                  {isStoryCreationFlow ? (
                    <>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Magic-Wand.png"
                          alt="Magic"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm font-bold text-yellow-300">
                          {t('storyFlow.benefits.readyInMinutes')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Gem-Stone.png"
                          alt="Gem"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          <span className="font-bold text-yellow-300">
                            {t('storyFlow.benefits.freeTokens')}
                          </span>{' '}
                        </span>
                        <Image
                          src="/emojis/Party-Popper.png"
                          alt="Party"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Books.png"
                          alt="Books"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          {t('storyFlow.benefits.personalizedDetails')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Star-Struck.png"
                          alt="Star Struck"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          {t('storyFlow.benefits.shareInstantly')}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Gem-Stone.png"
                          alt="Gem"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm font-bold text-yellow-300">
                          {t('benefits.freeTokens')}
                        </span>
                        <Image
                          src="/emojis/Party-Popper.png"
                          alt="Party"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Magic-Wand.png"
                          alt="Magic"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          {t('benefits.createInstantly')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Family.png"
                          alt="Family"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          {t('benefits.safeSecure')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-white/90">
                        <Image
                          src="/emojis/Heart-Hands.png"
                          alt="Heart"
                          width={20}
                          height={20}
                        />
                        <span className="text-sm">
                          {t('benefits.happyFamilies')}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Urgency/Excitement for Story Creation Flow */}
                {isStoryCreationFlow && (
                  <div className="mt-4 rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 backdrop-blur-sm">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <Image
                        src="/emojis/Fire.png"
                        alt="Fire"
                        width={20}
                        height={20}
                      />
                      <span className="text-sm font-bold text-yellow-300">
                        {t('storyFlow.urgency.almostThere')}
                      </span>
                      <Image
                        src="/emojis/Fire.png"
                        alt="Fire"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/80">
                        {t('storyFlow.urgency.nextSteps')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Security Notice */}
                <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <Image
                        src="/emojis/Locked.png"
                        alt="Secure"
                        width={16}
                        height={16}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {t('security.title')}
                      </h4>
                      <p className="text-xs leading-relaxed text-white/80">
                        {t('security.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                {isStoryCreationFlow
                  ? t('storyFlow.termsText')
                  : t('general.termsText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
