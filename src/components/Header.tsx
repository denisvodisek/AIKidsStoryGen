'use client';

import Link from 'next/link';
import { HeaderProps } from '@/types';
import { useStoryStore } from '@/store/story-store';
import Image from 'next/image';

export default function Header({ showAuthButton = true }: HeaderProps) {
  const { clearAllStoryData } = useStoryStore();

  return (
    <header className="container mx-auto px-4 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100/20 to-orange-200/40 shadow-lg">
              <Image
                src="/emojis/Bug.png"
                alt="Sparkles"
                width={30}
                height={30}
              />
            </div>
            <span className="text-2xl font-bold tracking-wide text-white">
              Bubika
            </span>
          </Link>
        </div>
        {showAuthButton && (
          <div className="flex items-center space-x-4">
            <Link
              href="/auth"
              className="font-medium text-white/90 transition-colors hover:text-yellow-300"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding/step-1"
              className="flex transform items-center justify-center gap-1 space-x-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-pink-600 hover:to-purple-700"
              onClick={() => {
                clearAllStoryData();
              }}
            >
              Start Magic
              <Image
                src="/emojis/Magic-Wand.png"
                alt="Magic Wand"
                width={20}
                height={20}
              />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
