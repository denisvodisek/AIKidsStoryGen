'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useStoryStore } from '@/store';
import { useTranslations } from 'next-intl';

export default function SubscriptionPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('subscription');
  const { getStories } = useStoryStore();

  // Mock current subscription data - replace with real data later
  const currentTokens = 50; // Low to create urgency
  const isSubscribed = false; // Set to true when user has subscription
  const stories = getStories();

  const handleSubscribe = async (planId: string, price: number) => {
    setIsProcessing(true);
    // TODO: Integrate with Stripe
    console.log(`Subscribing to plan: ${planId} for $${price}`);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Successfully subscribed to ${planId}!`);
    }, 2000);
  };

  return (
    <div className="inset-0">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/50 opacity-70"></div>
          <div className="absolute top-40 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s]"></div>
          <div className="absolute bottom-32 left-1/4 h-4 w-4 animate-pulse rounded-full bg-blue-300/40 opacity-60 [animation-delay:-1s]"></div>
          <div className="absolute top-2/3 right-1/3 h-3 w-3 animate-pulse rounded-full bg-purple-300/50 opacity-70 [animation-delay:-1.5s]"></div>

          <div className="absolute top-24 right-20 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-lg [animation-delay:-0.8s]"></div>
          <div className="absolute bottom-24 left-20 h-20 w-20 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-lg [animation-delay:-1.3s]"></div>

          <div className="absolute top-16 right-1/2 animate-ping text-2xl opacity-60">
            ✨
          </div>
          <div className="absolute bottom-20 left-1/3 animate-ping text-xl opacity-70 [animation-delay:-0.6s]">
            ⭐
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto mt-4 max-w-4xl sm:mt-6">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-3 shadow-2xl sm:h-24 sm:w-24">
                    <Image
                      src="/emojis/Crown.png"
                      alt="Crown"
                      width={40}
                      height={40}
                      className="sm:h-12 sm:w-12"
                    />
                  </div>
                  <div className="absolute -top-2 -left-2 h-3 w-3 animate-ping rounded-full bg-yellow-300"></div>
                  <div className="absolute -right-2 -bottom-2 h-3 w-3 animate-ping rounded-full bg-pink-300 [animation-delay:0.5s]"></div>
                </div>
              </div>

              <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-white/90">
                {t('subtitle')}
              </p>
            </div>

            {/* Token Balance - Current Status */}
            <div className="mb-12">
              <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-md">
                <div className="text-center">
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <Image
                      src="/emojis/Gem-Stone.png"
                      alt="Tokens"
                      width={24}
                      height={24}
                    />
                    <span className="text-2xl font-bold text-white">
                      {currentTokens}
                    </span>
                    <span className="text-white/70">{t('tokens.remaining')}</span>
                  </div>

                  {currentTokens < 100 && (
                    <div className="rounded-lg bg-orange-500/20 p-3 backdrop-blur-sm">
                      <p className="text-sm font-medium text-orange-200">
                        {t('tokens.low')}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 text-sm text-white/60">
                    {t('tokens.storiesCreated', { count: stories.length })} •{' '}
                    {t('tokens.storiesLeft', {
                      count: Math.floor(currentTokens / 100),
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Subscription Plan */}
            {!isSubscribed && (
              <div className="mb-16">
                <div className="mx-auto max-w-md">
                  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-1 backdrop-blur-md">
                    {/* Shimmer effect border */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 opacity-75 blur-sm"></div>

                    <div className="relative rounded-3xl bg-white/10 p-8 backdrop-blur-md">
                      <div className="text-center">
                        {/* Popular badge */}
                        <div className="mb-4 flex justify-center">
                          <span className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 text-sm font-bold text-white">
                            {t('unlimited.popular')}
                          </span>
                        </div>

                        <div className="mb-4 flex justify-center">
                          <Image
                            src="/emojis/Magic-Wand.png"
                            alt="Magic Wand"
                            width={48}
                            height={48}
                          />
                        </div>

                        <h2 className="mb-2 text-2xl font-bold text-white">
                          {t('unlimited.title')}
                        </h2>
                        <p className="mb-6 text-white/80">
                          {t('unlimited.subtitle')}
                        </p>

                        <div className="mb-6">
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-5xl font-bold text-white">
                              {t('unlimited.price')}
                            </span>
                            <span className="text-white/70">
                              {t('unlimited.period')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-white/60">
                            {t('unlimited.comparison')}
                          </p>
                        </div>

                        <div className="mb-8 space-y-3">
                          <div className="flex items-center justify-center gap-3">
                            <Image
                              src="/emojis/Sparkles.png"
                              alt="Feature"
                              width={20}
                              height={20}
                            />
                            <span className="text-white">
                              {t('unlimited.feature1')}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Image
                              src="/emojis/Books.png"
                              alt="Feature"
                              width={20}
                              height={20}
                            />
                            <span className="text-white">
                              {t('unlimited.feature2')}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Image
                              src="/emojis/Crown.png"
                              alt="Feature"
                              width={20}
                              height={20}
                            />
                            <span className="text-white">
                              {t('unlimited.feature3')}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-3">
                            <Image
                              src="/emojis/Unlocked.png"
                              alt="Feature"
                              width={20}
                              height={20}
                            />
                            <span className="text-white">
                              {t('unlimited.feature4')}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleSubscribe('unlimited', 5.99)}
                          disabled={isProcessing}
                          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:from-pink-400 hover:to-purple-500 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                              {t('unlimited.processing')}
                            </div>
                          ) : (
                            <>{t('unlimited.cta')}</>
                          )}
                        </button>

                        <p className="mt-3 text-xs text-white/60">
                          {t('unlimited.guarantee')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Token Add-ons */}
            <div className="mb-16">
              <div className="mb-8 text-center">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  {t('addons.title')}
                </h2>
                <p className="text-white/80">{t('addons.subtitle')}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* 300 Tokens */}
                <div className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/15">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Image
                        src="/emojis/Gem-Stone.png"
                        alt="Tokens"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('addons.plan1.tokens')}
                    </h3>
                    <p className="mb-4 text-white/70">
                      {t('addons.plan1.stories')}
                    </p>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white">
                        {t('addons.plan1.price')}
                      </div>
                      <p className="text-sm text-white/60">
                        {t('addons.plan1.description')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSubscribe('tokens-300', 8.99)}
                      disabled={isProcessing}
                      className="w-full rounded-xl bg-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/30"
                    >
                      {t('addons.cta')}
                    </button>
                  </div>
                </div>

                {/* 500 Tokens - Best Value */}
                <div className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/15">
                  {/* Popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-3 py-1 text-xs font-bold text-white">
                      {t('addons.plan2.badge')}
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Image
                        src="/emojis/Star-Struck.png"
                        alt="Star"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('addons.plan2.tokens')}
                    </h3>
                    <p className="mb-4 text-white/70">
                      {t('addons.plan2.stories')}
                    </p>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white">
                        {t('addons.plan2.price')}
                      </div>
                      <p className="text-sm text-white/60">
                        {t('addons.plan2.description')}
                      </p>
                      <p className="text-xs text-green-300">
                        {t('addons.plan2.value')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSubscribe('tokens-500', 13.99)}
                      disabled={isProcessing}
                      className="w-full rounded-xl bg-gradient-to-r from-green-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-green-400 hover:to-blue-500"
                    >
                      {t('addons.cta')}
                    </button>
                  </div>
                </div>

                {/* 1000 Tokens */}
                <div className="relative rounded-2xl bg-white/10 p-6 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/15">
                  <div className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Image
                        src="/emojis/Sports-Medal.png"
                        alt="Medal"
                        width={40}
                        height={40}
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('addons.plan3.tokens')}
                    </h3>
                    <p className="mb-4 text-white/70">
                      {t('addons.plan3.stories')}
                    </p>
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-white">
                        {t('addons.plan3.price')}
                      </div>
                      <p className="text-sm text-white/60">
                        {t('addons.plan3.description')}
                      </p>
                      <p className="text-xs text-purple-300">
                        {t('addons.plan3.value')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleSubscribe('tokens-1000', 24.99)}
                      disabled={isProcessing}
                      className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-400 hover:to-pink-500"
                    >
                      {t('addons.cta')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center">
              <div className="mx-auto max-w-2xl rounded-2xl bg-white/10 p-8 backdrop-blur-md">
                <div className="mb-4 flex justify-center">
                  <Image
                    src="/emojis/Sparkles.png"
                    alt="Sparkles"
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {t('faq.title')}
                </h3>
                <p className="mb-6 text-white/80">{t('faq.subtitle')}</p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/my-stories"
                    className="rounded-xl bg-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/30"
                  >
                    {t('faq.stories')}
                  </Link>
                  <button className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-400 hover:to-blue-500">
                    {t('faq.support')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
