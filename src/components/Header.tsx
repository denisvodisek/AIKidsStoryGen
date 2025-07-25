'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { HeaderProps } from '@/types';
import { useStoryStore } from '@/store/story-store';
import { useAuthStore } from '@/store/auth-store';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Header({ showAuthButton = true }: HeaderProps) {
  const { clearAllStoryData } = useStoryStore();
  const { user, signOut, initialize, isInitialized } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('header');

  // Initialize auth on component mount
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="relative container mx-auto px-4 py-4 md:py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100/20 to-orange-200/40 shadow-lg md:h-10 md:w-10">
              <Image
                src="/emojis/Bug.png"
                alt="Sparkles"
                width={30}
                height={30}
                className="h-6 w-6 md:h-7 md:w-7"
              />
            </div>
            <span className="text-xl font-bold tracking-wide text-white md:text-2xl">
              {t('brand')}
            </span>
          </Link>
        </div>

        {showAuthButton && (
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated user UI
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* My Stories Link - Hidden on mobile */}
                <Link
                  href="/my-stories"
                  className="hidden font-medium text-white/90 transition-colors hover:text-yellow-300 lg:block"
                >
                  {t('myStories')}
                </Link>

                {/* Create Story Button - Responsive */}
                <Link
                  href="/onboarding/step-1"
                  className="flex transform items-center justify-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-2 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700 md:px-4"
                  onClick={() => {
                    clearAllStoryData();
                  }}
                >
                  <span className="sm:inline">{t('createStory')}</span>
                  <Image
                    src="/emojis/Magic-Wand.png"
                    alt="Magic Wand"
                    width={16}
                    height={16}
                  />
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 rounded-full bg-white/10 px-2 py-2 transition-all hover:bg-white/20 md:px-3"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
                        <span className="text-sm font-bold text-white">
                          {user.user_metadata?.full_name?.charAt(0) ||
                            user.email?.charAt(0) ||
                            '?'}
                        </span>
                      </div>
                    )}
                    <div className="hidden text-left lg:block">
                      <div className="text-sm font-medium text-white">
                        {user.user_metadata?.full_name ||
                          user.email?.split('@')[0]}
                      </div>
                      <div className="max-w-[120px] truncate text-xs text-white/70">
                        {user.email}
                      </div>
                    </div>
                    <svg
                      className={`h-4 w-4 text-white transition-transform ${showUserMenu ? 'rotate-180' : ''} `}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute top-full right-0 z-50 mt-2 w-full max-w-sm min-w-[280px] rounded-xl bg-white shadow-2xl ring-1 ring-black/5 md:w-64">
                      <div className="p-3">
                        {/* User Info Header */}
                        <div className="mb-3 border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-3">
                            {user.user_metadata?.avatar_url ? (
                              <Image
                                src={user.user_metadata.avatar_url}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500">
                                <span className="font-bold text-white">
                                  {user.user_metadata?.full_name?.charAt(0) ||
                                    user.email?.charAt(0) ||
                                    '?'}
                                </span>
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-semibold text-gray-900">
                                {user.user_metadata?.full_name || 'User'}
                              </div>
                              <div className="truncate text-xs text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-1">
                          <Link
                            href="/my-stories"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Image
                              src="/emojis/Books.png"
                              alt="Stories"
                              width={18}
                              height={18}
                            />
                            {t('myStories')}
                          </Link>

                          <Link
                            href="/subscription"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Image
                              src="/emojis/Gem-Stone.png"
                              alt="Subscription"
                              width={18}
                              height={18}
                            />
                            {t('subscription')}
                          </Link>

                          <div className="my-2 border-t border-gray-100" />

                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 active:bg-red-100"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            {t('signOut')}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Unauthenticated user UI
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link
                  href="/auth"
                  className="font-medium text-white/90 transition-colors hover:text-yellow-300"
                >
                  {t('signIn')}
                </Link>
                <Link
                  href="/onboarding/step-1"
                  className="flex transform items-center justify-center gap-1 space-x-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
                  onClick={() => {
                    clearAllStoryData();
                  }}
                >
                  {t('startMagic')}
                  <Image
                    src="/emojis/Magic-Wand.png"
                    alt="Magic Wand"
                    width={20}
                    height={20}
                  />
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
