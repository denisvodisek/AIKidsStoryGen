import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ABeeZee } from 'next/font/google';
import '@/styles/globals.css';
import { setRequestLocale } from 'next-intl/server';

const abeezee = ABeeZee({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-abeezee',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  console.log('🌍 Locale:', locale);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${abeezee.variable} font-abeezee antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
