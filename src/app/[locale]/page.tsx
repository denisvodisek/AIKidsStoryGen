'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStoryStore } from '@/store/story-store';

export default function LandingPage() {
  const t = useTranslations();
  const { clearAllStoryData } = useStoryStore();
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Magical background elements */}
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

      {/* Hero Section with Floating Images */}
      <main className="relative z-20 container mx-auto px-4 py-16">
        {/* Floating Story Images */}
        <div className="absolute top-12 -rotate-12 transform transition-transform duration-500 hover:rotate-0 md:left-0 2xl:left-8">
          <div className="flex h-90 w-70 flex-col justify-between rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-2 shadow-2xl">
            <Image
              src="/images/lunascastle.jpg"
              alt="Princess Luna's Castle"
              width={356}
              height={356}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>

        <div className="absolute top-24 rotate-12 transform transition-transform duration-500 hover:rotate-0 md:right-0 2xl:right-8">
          <div className="flex h-90 w-70 flex-col justify-between rounded-2xl bg-gradient-to-br from-green-400 to-blue-500 p-2 shadow-2xl">
            <video
              src="/images/dragonfight.mp4"
              className="h-full w-full rounded-xl object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>

        {/* Centered Content */}
        <div className="relative z-30 mx-auto max-w-4xl text-center">
          {/* Magical title */}
          <div className="relative mb-8">
            <h1 className="mb-4 text-6xl leading-tight font-bold text-white drop-shadow-2xl md:text-7xl">
              <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                {t('landing.hero.title.createMagical')}
              </span>
              <br />
              <span className="flex items-center justify-center gap-1 text-white">
                {t('landing.hero.title.adventures')}{' '}
                <Image
                  src="/emojis/Sparkles.png"
                  alt={t('landing.hero.altTexts.sparkles')}
                  width={80}
                  height={80}
                />
              </span>
            </h1>
            {/* Floating elements around title */}
            <div className="absolute -top-4 -right-4 animate-bounce text-4xl">
              <Image
                src="/emojis/Bird.png"
                alt={t('landing.hero.altTexts.bird')}
                width={60}
                height={60}
              />
            </div>
            <div className="absolute -bottom-4 -left-4 text-3xl">
              <Image
                src="/emojis/Butterfly.png"
                alt={t('landing.hero.altTexts.butterfly')}
                width={60}
                height={60}
              />
            </div>
          </div>

          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed font-light text-white/90 drop-shadow-lg md:text-xl">
            {t('landing.hero.subtitle.makeChild')}{' '}
            <span className="inline-flex items-center justify-center gap-1 ps-1 pe-1">
              <Image
                src="/emojis/Star.png"
                alt={t('landing.hero.altTexts.star')}
                width={20}
                height={20}
              />
              <span className="mt-1.5 font-medium text-yellow-300">
                {t('landing.hero.subtitle.mainCharacter')}
              </span>
              <Image
                src="/emojis/Star.png"
                alt={t('landing.hero.altTexts.star')}
                width={20}
                height={20}
              />
            </span>
            {t('landing.hero.subtitle.inTheirStories')}
            <br />
            <span className="font-normal">
              {t('landing.hero.subtitle.aiCreates')}
            </span>{' '}
            <span className="inline-flex items-center justify-center gap-1 ps-1 pe-1">
              <Image
                src="/emojis/Books.png"
                alt={t('landing.hero.altTexts.book')}
                width={20}
                height={20}
              />

              <Image
                src="/emojis/Sparkles.png"
                alt={t('landing.hero.altTexts.sparkles')}
                width={20}
                height={20}
              />
            </span>
          </p>

          <div className="mb-16 flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Link
              href="/onboarding/step-1"
              className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-10 py-4 text-xl font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-blue-600"
              onClick={() => {
                clearAllStoryData();
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Image
                  src="/emojis/Rocket.png"
                  alt={t('landing.hero.altTexts.rocket')}
                  width={24}
                  height={24}
                />{' '}
                {t('landing.hero.cta.startCreating')}
              </span>
            </Link>
            <Link
              href="/examples"
              className="flex transform items-center justify-center space-x-2 rounded-full border-2 border-white/30 bg-white/20 px-10 py-4 text-xl font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
            >
              <span className="flex items-center justify-center gap-1">
                <Image
                  src="/emojis/Eyes.png"
                  alt={t('landing.hero.altTexts.eyes')}
                  width={24}
                  height={24}
                  className="-mt-1"
                />
                {t('landing.hero.cta.seeExamples')}
              </span>
            </Link>
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-32 max-w-5xl">
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div className="relative mb-8 flex justify-center gap-4 text-center">
              <Image
                src="/images/step1original.jpg"
                alt={t('landing.howItWorks.step1.altTexts.snapTransform')}
                width={200}
                height={200}
                className="-mt-10 h-auto rounded-2xl border-8 border-white object-cover object-right shadow-2xl"
              />
              <Image
                src="/images/arrow.png"
                alt={t('landing.howItWorks.step1.altTexts.arrow')}
                width={180}
                height={180}
                className="absolute top-0 z-10 invert"
              />
              <Image
                src="/images/step1transformed.jpg"
                alt={t('landing.howItWorks.step1.altTexts.snapTransform')}
                width={250}
                height={250}
                className="rotate-5 rounded-2xl border-8 border-white object-cover object-right shadow-2xl"
              />
            </div>
            <div className="group relative">
              <div className="relative flex h-full flex-col rounded-2xl">
                <div className="mb-2 text-3xl font-bold text-white">
                  {t('landing.howItWorks.step1.title')}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {t('landing.howItWorks.step1.heading')}
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  {t('landing.howItWorks.step1.description')}
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Locked.png"
                    alt={t('landing.howItWorks.step1.altTexts.lock')}
                    width={20}
                    height={20}
                  />{' '}
                  {t('landing.howItWorks.step1.security')}
                </p>
              </div>
            </div>
          </div>
          <div className="mb-16 grid gap-8 md:grid-cols-2">
            {/* Step 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl"></div>
              <div className="relative flex h-full flex-col rounded-2xl">
                <Image
                  src="/images/story_style_en.png"
                  alt="Choose Adventure"
                  width={1200}
                  height={1200}
                  className="mb-4 h-60 w-full rounded-2xl object-cover opacity-0"
                />
                <Image
                  src="/images/story_style_en.png"
                  alt="Choose Adventure"
                  width={1200}
                  height={1200}
                  className="absolute -top-5 -left-0 z-10 mb-4 h-60 w-60 -rotate-5 rounded-2xl border-6 border-white object-cover shadow-2xl"
                />
                <Image
                  src="/images/story_personalize_en.png"
                  alt="Personalize Story"
                  width={1200}
                  height={1200}
                  className="absolute -top-0 -right-0 mb-4 h-60 w-90 rotate-5 rounded-2xl border-6 border-white object-cover shadow-2xl"
                />
                <div className="mb-2 text-3xl font-bold text-white">
                  {t('landing.howItWorks.step2.title')}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {t('landing.howItWorks.step2.heading')}
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  {t('landing.howItWorks.step2.description')}
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Star.png"
                    alt={t('landing.howItWorks.step2.altTexts.sparkles')}
                    width={20}
                    height={20}
                  />{' '}
                  {t('landing.howItWorks.step2.possibilities')}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl"></div>
              <div className="relative flex h-full flex-col rounded-2xl">
                <Image
                  src="/images/Denis-and-the-Giggleberry-Adventure-page-1.jpg"
                  alt="Story Magic!"
                  width={1000}
                  height={1000}
                  className="h-60 w-full rounded-2xl border-8 border-white object-cover opacity-0 shadow-2xl"
                />
                <Image
                  src="/images/Denis-and-the-Giggleberry-Adventure-page-1.jpg"
                  alt="Story Magic!"
                  width={1000}
                  height={1000}
                  className="absolute -top-10 -right-40 mb-4 h-60 w-90 rotate-5 rounded-2xl border-6 border-white object-cover shadow-2xl"
                />

                <Image
                  src="/images/Ema-and-the-Friendship-Flame-page-1.jpg"
                  alt="Story Magic!"
                  width={1000}
                  height={1000}
                  className="absolute -top-9 left-0 mb-4 h-60 w-60 rounded-2xl border-6 border-white object-cover shadow-2xl"
                />
                <Image
                  src="/images/Denis-and-FireStation.png"
                  alt="Story Magic!"
                  width={1000}
                  height={1000}
                  className="absolute top-0 left-70 mb-4 h-60 w-auto -translate-x-1/2 rotate-10 rounded-2xl border-6 border-white object-cover shadow-2xl"
                />
                <div className="mb-2 text-3xl font-bold text-white">
                  {t('landing.howItWorks.step3.title')}
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {t('landing.howItWorks.step3.heading')}
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  {t('landing.howItWorks.step3.description')}
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Books.png"
                    alt={t('landing.howItWorks.step3.altTexts.book')}
                    width={20}
                    height={20}
                  />{' '}
                  {t('landing.howItWorks.step3.bedtime')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/onboarding/step-1"
              className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-10 py-4 text-xl font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-blue-600"
              onClick={() => {
                clearAllStoryData();
              }}
            >
              <span className="flex items-center justify-center gap-2">
                <Image
                  src="/emojis/Rocket.png"
                  alt={t('landing.hero.altTexts.rocket')}
                  width={24}
                  height={24}
                />{' '}
                {t('buttons.startYourOwnAdventure')}
              </span>
            </Link>
          </div>

          {/* <div className="text-center">
            <div className="relative rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 p-8 shadow-2xl">
              <div className="absolute top-4 left-4 animate-spin text-3xl">
                ⭐
              </div>
              <div className="absolute top-4 right-4 animate-bounce text-3xl">
                🎉
              </div>
              <div className="absolute bottom-4 left-4 animate-pulse text-3xl">
                🌟
              </div>
              <div className="absolute right-4 bottom-4 animate-ping text-3xl">
                ✨
              </div>
              <h3 className="mb-4 text-3xl font-bold text-white">
                Ready for Your First <br /> Magical Adventure? 🏰
              </h3>
              <p className="mx-auto mb-6 max-w-md font-light text-white/90">
                Join 50,000+ families already creating unforgettable story
                adventures!
              </p>
              <Link
                href="/onboarding/step-1"
                className="inline-flex transform items-center space-x-2 rounded-full bg-white px-10 py-4 text-lg font-semibold text-purple-600 shadow-xl transition-all duration-200 hover:scale-105 hover:bg-gray-100"
              >
                <span>🚀 Start Your Adventure</span>
              </Link>
            </div>
          </div> */}
        </div>

        {/* Enhanced Features Section */}
        <div className="mx-auto mt-24">
          {/* Main Feature - Magical Story Creation */}
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/images/nightsky.png"
              alt="Magical Story Creation"
              width={1024}
              height={1024}
              className="h-90 w-full rounded-3xl object-cover object-[100%_40%]"
            />
            {/* Floating magical elements over the image */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="absolute top-20 left-20 h-3 w-3 animate-pulse rounded-full bg-yellow-300/70"></div>
              <div className="absolute top-32 right-32 h-2 w-2 animate-ping rounded-full bg-pink-300/80"></div>
              <div className="absolute bottom-32 left-1/3 h-4 w-4 animate-pulse rounded-full bg-blue-300/60 [animation-delay:-1s]"></div>
              <div className="absolute top-1/2 right-20 h-3 w-3 animate-pulse rounded-full bg-purple-300/70 [animation-delay:-1.5s]"></div>
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          </div>
          <div className="mx-auto -mt-20 mb-10 max-w-5xl rounded-3xl bg-white/10 p-8 text-center backdrop-blur-sm">
            <h2 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-white drop-shadow-2xl md:text-5xl">
              {t('landing.storyStyles.title')}
              <Image
                src="/emojis/Parachute.png"
                alt={t('landing.storyStyles.altTexts.parachute')}
                width={50}
                height={50}
              />
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-white/95 drop-shadow-lg">
              {t('landing.storyStyles.subtitle')}
            </p>
          </div>

          {/* Story Style Showcase */}
          <div className="mb-16">
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
              {/* Classic Disney Style */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 p-1 backdrop-blur-md transition-all hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-50 blur-sm transition-all group-hover:opacity-75"></div>
                <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                  <div className="mb-4 aspect-16/13 overflow-hidden rounded-2xl">
                    <video
                      src="/images/classic-disney.mp4"
                      className="h-full w-full object-cover transition-all group-hover:scale-110"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('landing.storyStyles.disney.title')}
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      {t('landing.storyStyles.disney.description')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">
                        {t('landing.storyStyles.disney.badge')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pixar Adventure */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/20 to-green-600/20 p-1 backdrop-blur-md transition-all hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 to-green-400 opacity-50 blur-sm transition-all group-hover:opacity-75"></div>
                <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                  <div className="mb-4 aspect-16/13 overflow-hidden rounded-2xl">
                    <video
                      src="/images/disney-pixar.mp4"
                      className="h-full w-full object-cover transition-all group-hover:scale-110"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('landing.storyStyles.pixar.title')}
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      {t('landing.storyStyles.pixar.description')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">
                        {t('landing.storyStyles.pixar.badge')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lego Adventure */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/20 to-orange-600/20 p-1 backdrop-blur-md transition-all hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 to-orange-400 opacity-50 blur-sm transition-all group-hover:opacity-75"></div>
                <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                  <div className="mb-4 aspect-16/13 overflow-hidden rounded-2xl">
                    <video
                      src="/images/lego.mp4"
                      className="h-full w-full object-cover transition-all group-hover:scale-110"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('landing.storyStyles.lego.title')}
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      {t('landing.storyStyles.lego.description')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">
                        {t('landing.storyStyles.lego.badge')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paw Patrol Style */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 to-blue-600/20 p-1 backdrop-blur-md transition-all hover:scale-105">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-400 to-blue-400 opacity-50 blur-sm transition-all group-hover:opacity-75"></div>
                <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-md">
                  <div className="mb-4 aspect-16/13 overflow-hidden rounded-2xl">
                    <video
                      src="/images/paw-patrol.mp4"
                      className="h-full w-full object-cover transition-all group-hover:scale-110"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {t('landing.storyStyles.heroRescue.title')}
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      {t('landing.storyStyles.heroRescue.description')}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">
                        {t('landing.storyStyles.heroRescue.badge')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 space-y-16">
          <h2 className="mb-4 mb-16 flex items-center justify-center gap-3 text-4xl font-bold text-white drop-shadow-2xl md:text-5xl">
            {t('landing.features.bedtimeMagic')}
            <Image src="/emojis/Zzz.png" alt="zzz" width={50} height={50} />
          </h2>
          {/* Feature Grid */}
          <div className="relative mx-auto flex max-w-5xl">
            <Image
              src="/images/familybonding.png"
              alt="Family Bonding"
              width={1024}
              height={1024}
              className="h-90 w-1/2 rounded-tl-2xl rounded-bl-2xl object-cover"
            />
            <div className="relative flex-1 overflow-hidden rounded-tr-2xl rounded-br-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xs">
              {/* Floating magical elements over the image */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-50 left-20 h-3 w-3 animate-pulse rounded-full bg-indigo-300/70"></div>
                <div className="absolute top-32 right-10 h-2 w-2 animate-ping rounded-full bg-pink-300/80"></div>
                <div className="absolute bottom-12 left-1/3 h-4 w-4 animate-pulse rounded-full bg-red-300/60 [animation-delay:-1s]"></div>
                <div className="absolute top-1/2 right-17 h-3 w-3 animate-pulse rounded-full bg-purple-300/70 [animation-delay:-1.5s]"></div>
              </div>

              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <Image
                  src={'/emojis/Star.png'}
                  alt="Star"
                  width={24}
                  height={24}
                  className="absolute right-10 bottom-10 z-10"
                />
              </div>

              <h3 className="mb-3 flex items-center gap-2 text-2xl font-bold">
                {t('landing.features.familyBonds.title')}
                <Image
                  src="/emojis/Family.png"
                  alt="Heart"
                  width={32}
                  height={32}
                />
              </h3>
              <p className="text-lg leading-relaxed font-light">
                {t('landing.features.familyBonds.description')}
                <br />
                <br />
                {t('landing.features.familyBonds.subtitle')}
              </p>
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl">
            <div className="relative flex-1 rounded-tl-2xl rounded-bl-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xs">
              {/* Floating magical elements over the image */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-40 left-20 h-3 w-3 animate-pulse rounded-full bg-indigo-300/70"></div>
                <div className="absolute top-32 right-12 h-2 w-2 animate-ping rounded-full bg-pink-300/80"></div>
                <div className="absolute bottom-12 left-1/3 h-4 w-4 animate-pulse rounded-full bg-red-300/60 [animation-delay:-1s]"></div>
                <div className="absolute top-1/2 right-20 h-3 w-3 animate-pulse rounded-full bg-purple-300/70 [animation-delay:-1.5s]"></div>
              </div>

              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <Image
                  src={'/emojis/Cupcake.png'}
                  alt="Star"
                  width={24}
                  height={24}
                  className="absolute bottom-10 left-10 z-10"
                />
                <Image
                  src={'/emojis/Grinning-Cat.png'}
                  alt="Star"
                  width={24}
                  height={24}
                  className="absolute right-10 bottom-20 z-10"
                />
              </div>

              <h3 className="mb-3 flex gap-2 text-2xl font-bold">
                {t('landing.features.hassleFree.title')}
                <Image
                  src="/emojis/Hugging-Face.png"
                  alt="Clock"
                  width={32}
                  height={32}
                />
              </h3>
              <p className="text-lg leading-relaxed font-light">
                {t('landing.features.hassleFree.description')}
                <br />
                <br />
                {t('landing.features.hassleFree.subtitle')}
              </p>
            </div>
            <Image
              src="/images/hasslefreebedtime.png"
              alt="Hassle-Free Bedtime"
              width={1024}
              height={1024}
              className="h-90 w-1/2 rounded-2xl object-cover"
            />
          </div>
        </div>

        {/* Subscription CTA Section */}
        <div className="relative z-20 mx-auto mt-24 max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-blue-600/20 p-1 backdrop-blur-md">
            {/* Magical border shimmer */}
            <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-r from-pink-400 via-blue-400 via-purple-400 to-pink-400 opacity-75 blur-sm"></div>

            {/* Main content */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-800/90 p-12 backdrop-blur-md">
              {/* Floating magical elements */}
              <div className="absolute top-6 left-6 h-2 w-2 animate-pulse rounded-full bg-yellow-300/70"></div>
              <div className="absolute top-12 right-12 h-1 w-1 animate-ping rounded-full bg-pink-300/80"></div>
              <div className="absolute bottom-8 left-12 h-3 w-3 animate-pulse rounded-full bg-blue-300/60 [animation-delay:-1s]"></div>
              <div className="absolute right-6 bottom-6 h-2 w-2 animate-pulse rounded-full bg-purple-300/70 [animation-delay:-1.5s]"></div>

              <div className="text-center">
                {/* Compelling headline */}
                <h2 className="mb-4 text-4xl font-bold text-white md:text-4xl">
                  {t('landing.subscription.title')}
                </h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/90">
                  {t('landing.subscription.subtitle')}
                  <br />
                  <span className="font-semibold text-yellow-300">
                    {t('landing.subscription.getUnlimited')}
                  </span>
                </p>

                {/* Value proposition */}
                <div className="mb-8 grid gap-6 text-center md:grid-cols-3">
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex justify-center">
                      <Image
                        src="/emojis/Magic-Wand.png"
                        alt="Magic"
                        width={32}
                        height={32}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {t(
                        'landing.subscription.features.personalizedStories.title'
                      )}
                    </h3>
                    <p className="text-sm text-white/80">
                      {t(
                        'landing.subscription.features.personalizedStories.description'
                      )}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex justify-center">
                      <Image
                        src="/emojis/OK-Hand.png"
                        alt="Premium"
                        width={32}
                        height={32}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {t('landing.subscription.features.premiumQuality.title')}
                    </h3>
                    <p className="text-sm text-white/80">
                      {t(
                        'landing.subscription.features.premiumQuality.description'
                      )}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                    <div className="mb-3 flex justify-center">
                      <Image
                        src="/emojis/Heart-Hands.png"
                        alt="Safe"
                        width={32}
                        height={32}
                      />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {t('landing.subscription.features.safe.title')}
                    </h3>
                    <p className="text-sm text-white/80">
                      {t('landing.subscription.features.safe.description')}
                    </p>
                  </div>
                </div>

                {/* Pricing highlight */}
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-white">
                      {t('landing.subscription.pricing.price')}
                    </span>
                    <span className="text-2xl text-white/70">
                      {t('landing.subscription.pricing.period')}
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-white/80">
                    {t.rich('landing.subscription.pricing.comparison', {
                      image: () => (
                        <Image
                          src="/emojis/Pizza.png"
                          alt="Pizza"
                          width={24}
                          height={24}
                          className="-mt-0.5 inline-block"
                        />
                      ),
                    })}
                  </p>
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">
                  <Link
                    href="/subscription"
                    className="flex transform items-center justify-center gap-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-4 text-xl font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-pink-400 hover:to-purple-500"
                  >
                    <Image
                      src="/emojis/Crown.png"
                      alt="Crown"
                      width={24}
                      height={24}
                    />
                    {t('landing.subscription.cta.getUnlimited')}
                  </Link>
                  <Link
                    href="/onboarding/step-1"
                    className="flex transform items-center justify-center gap-3 rounded-full border-2 border-white/30 bg-white/20 px-10 py-4 text-xl font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
                    onClick={() => {
                      clearAllStoryData();
                    }}
                  >
                    <Image
                      src="/emojis/Rocket.png"
                      alt="Rocket"
                      width={24}
                      height={24}
                    />
                    {t('landing.subscription.cta.tryFree')}
                  </Link>
                </div>

                <p className="mt-6 text-sm text-white/60">
                  <Image
                    src="/emojis/Wrapped-Gift.png"
                    alt={t('landing.subscription.altTexts.gift')}
                    width={22}
                    height={22}
                    className="-mt-0.5 inline-block"
                  />{' '}
                  {t('landing.subscription.freeTokens.startWith')}{' '}
                  <span className="font-semibold text-yellow-300">
                    {t('landing.subscription.freeTokens.tokens')}
                  </span>{' '}
                  {t('landing.subscription.freeTokens.whenSignUp')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="relative z-20 mx-auto mt-24 max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 flex items-center justify-center gap-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
              {t('landing.testimonials.title')}
              <Image
                src="/emojis/Love-Letter.png"
                alt="Sparkles"
                width={60}
                height={60}
              />
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-white/80">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex h-full flex-col rounded-2xl p-8">
                <div className="mb-6 flex items-center space-x-3">
                  <Image
                    src={'/images/parentsreview1_en.jpeg'}
                    alt={'Parent Review Profile Photo'}
                    width={100}
                    height={100}
                    className="h-12 w-12 rounded-full shadow-lg"
                  />
                  <div>
                    <div className="font-semibold">
                      {t('landing.testimonials.reviews.sarah.name')}
                    </div>
                    <div className="text-sm text-pink-500">
                      {t('landing.testimonials.reviews.sarah.role')}
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <blockquote className="mb-4 flex-1 text-lg leading-relaxed font-light">
                  {t('landing.testimonials.reviews.sarah.quote')}
                </blockquote>
                <div className="text-sm text-gray-500">
                  {t('landing.testimonials.reviews.sarah.badge')}
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex h-full flex-col rounded-2xl p-8">
                <div className="mb-6 flex items-center space-x-3">
                  <Image
                    src={'/images/parentsreview2_en.jpeg'}
                    alt={'Parent Review Profile Photo'}
                    width={100}
                    height={100}
                    className="h-12 w-12 rounded-full shadow-lg"
                  />
                  <div>
                    <div className="font-semibold">
                      {t('landing.testimonials.reviews.mikeLisa.name')}
                    </div>
                    <div className="text-sm text-blue-500">
                      {t('landing.testimonials.reviews.mikeLisa.role')}
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <blockquote className="mb-4 flex-1 text-lg leading-relaxed font-light">
                  {t('landing.testimonials.reviews.mikeLisa.quote')}
                </blockquote>
                <div className="text-sm text-gray-500">
                  {t('landing.testimonials.reviews.mikeLisa.badge')}
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex h-full flex-col rounded-2xl p-8">
                <div className="mb-6 flex items-center space-x-3">
                  <Image
                    src={'/images/parentsreview4_en.jpeg'}
                    alt={'Parent Review Profile Photo'}
                    width={100}
                    height={100}
                    className="h-12 w-12 rounded-full shadow-lg"
                  />
                  <div>
                    <div className="font-semibold">
                      {t('landing.testimonials.reviews.teacherAmy.name')}
                    </div>
                    <div className="text-sm text-green-500">
                      {t('landing.testimonials.reviews.teacherAmy.role')}
                    </div>
                  </div>
                </div>
                <div className="mb-4 flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>
                <blockquote className="mb-4 flex-1 text-lg leading-relaxed font-light">
                  {t('landing.testimonials.reviews.teacherAmy.quote')}
                </blockquote>
                <div className="text-sm text-gray-500">
                  {t('landing.testimonials.reviews.teacherAmy.badge')}
                </div>
              </div>
            </div>
          </div>

          {/* Additional testimonials row */}
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Testimonial 4 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex gap-3 rounded-2xl p-8">
                <Image
                  src={'/images/parentsreview6_en.jpeg'}
                  alt={'Parent Review Profile Photo'}
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full shadow-lg"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <div className="font-semibold">
                      {t('landing.testimonials.reviews.drRodriguez.name')}
                    </div>
                    <div className="text-sm text-orange-500">
                      {t('landing.testimonials.reviews.drRodriguez.role')}
                    </div>
                  </div>
                  <div className="mb-3 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed font-light">
                    {t('landing.testimonials.reviews.drRodriguez.quote')}
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex gap-3 rounded-2xl p-8">
                <Image
                  src={'/images/parentsreview5_en.jpeg'}
                  alt={'Parent Review Profile Photo'}
                  width={100}
                  height={100}
                  className="h-12 w-12 rounded-full shadow-lg"
                />
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <div className="font-semibold">
                      {t('landing.testimonials.reviews.techMomJenny.name')}
                    </div>
                    <div className="text-sm text-purple-500">
                      {t('landing.testimonials.reviews.techMomJenny.role')}
                    </div>
                  </div>
                  <div className="mb-3 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-lg text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <blockquote className="text-lg leading-relaxed font-light">
                    {t('landing.testimonials.reviews.techMomJenny.quote')}
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
