'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Footer() {
  const t = useTranslations('footer');
  const [currentYear, setCurrentYear] = useState(2025); // Fixed fallback

  // Set the actual year on client-side to avoid hydration mismatch
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative z-20 mt-24 border-t border-white/10 bg-gray-900/80 py-16 text-white backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center space-x-2">
              <Image
                src="/emojis/Bug.png"
                alt="Sparkles"
                width={30}
                height={30}
              />
              <span className="text-2xl font-bold tracking-wide text-white">
                {t('brand')}
              </span>
            </div>
            <p className="text-lg leading-relaxed font-light text-gray-300">
              {t('description')}
              <span className="mt-1 flex items-center gap-1">
                <Image
                  src="/emojis/Globe.png"
                  alt="Globe"
                  width={30}
                  height={30}
                />
                <Image
                  src="/emojis/Full-Moon-Face.png"
                  alt="Moon"
                  width={30}
                  height={30}
                />
              </span>
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-purple-300">
              {t('funStuff')}
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/features"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('features')}
              </Link>
              <Link
                href="/subscription"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('pricing')}
              </Link>
              <Link
                href="/examples"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('examples')}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-purple-300">
              {t('helpSupport')}
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/help"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('helpCenter')}
              </Link>
              <Link
                href="/contact"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('contactUs')}
              </Link>
              <Link
                href="/privacy"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('privacySafety')}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold text-purple-300">
              {t('aboutUs')}
            </h4>
            <div className="space-y-2 text-gray-300">
              <Link
                href="/about"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('about')}
              </Link>
              <Link
                href="/blog"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('blog')}
              </Link>
              <Link
                href="/careers"
                className="block font-normal transition-colors hover:text-purple-300"
              >
                {t('joinTeam')}
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p className="text-lg font-light">
            © {currentYear} {t('brand')}. {t('copyright')}{' '}
            <Image
              src="/emojis/Smiling-Face-With-Hearts.png"
              alt="Smiling-Face-With-Hearts"
              width={24}
              height={24}
              className="inline"
            />{' '}
            {t('forAmazingKidsAndFamilies')}
          </p>
        </div>
      </div>
    </footer>
  );
}
