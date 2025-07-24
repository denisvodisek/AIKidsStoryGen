'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  const pathname = usePathname();

  // Determine the locale from the pathname
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <html lang={locale}>
      <body>
        <div className="fixed inset-0 z-50">
          {/* Magical Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 via-purple-900 to-pink-900">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/50 opacity-70"></div>
              <div className="absolute top-40 right-28 h-2 w-2 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s]"></div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/emojis/Hear-No-Evil-Monkey.png"
                  alt={t('alt')}
                  width={80}
                  height={80}
                />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
                {t('title')}
              </h1>
              <p className="mb-8 text-lg text-white/80 sm:text-xl">
                {t('subtitle')}
              </p>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
