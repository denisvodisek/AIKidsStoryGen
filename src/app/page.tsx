'use client';

import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useStoryStore } from '@/store/story-store';

export default function LandingPage() {
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
                Create Magical
              </span>
              <br />
              <span className="flex items-center justify-center gap-1 text-white">
                Adventures!{' '}
                <Image
                  src="/emojis/Sparkles.png"
                  alt="Star"
                  width={80}
                  height={80}
                />
              </span>
            </h1>
            {/* Floating elements around title */}
            <div className="absolute -top-4 -right-4 animate-bounce text-4xl">
              <Image src="/emojis/Bird.png" alt="Bird" width={60} height={60} />
            </div>
            <div className="absolute -bottom-4 -left-4 text-3xl">
              <Image
                src="/emojis/Butterfly.png"
                alt="Butterfly"
                width={60}
                height={60}
              />
            </div>
          </div>

          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed font-light text-white/90 drop-shadow-lg md:text-xl">
            Make your child the{' '}
            <span className="inline-flex items-center justify-center gap-1 ps-1 pe-1">
              <Image src="/emojis/Star.png" alt="Star" width={20} height={20} />
              <span className="mt-1.5 font-medium text-yellow-300">
                main character
              </span>
              <Image src="/emojis/Star.png" alt="Star" width={20} height={20} />
            </span>
            in their own magical stories!
            <br />
            <span className="font-normal">
              AI creates personalized tales with beautiful pictures in seconds!
            </span>{' '}
            <span className="inline-flex items-center justify-center gap-1 ps-1 pe-1">
              <Image
                src="/emojis/Books.png"
                alt="Book"
                width={20}
                height={20}
              />

              <Image
                src="/emojis/Sparkles.png"
                alt="Sparkles"
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
                  alt="Rocket"
                  width={24}
                  height={24}
                />{' '}
                Start Creating
              </span>
            </Link>
            <Link
              href="/stories"
              className="flex transform items-center justify-center space-x-2 rounded-full border-2 border-white/30 bg-white/20 px-10 py-4 text-xl font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
            >
              <span className="flex items-center justify-center gap-1">
                <Image
                  src="/emojis/Eyes.png"
                  alt="Eyes"
                  width={24}
                  height={24}
                  className="-mt-1"
                />
                See Examples
              </span>
            </Link>
          </div>
        </div>

        <div className="relative z-20 mx-auto mt-32 max-w-5xl">
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div className="relative mb-8 flex justify-center gap-4 text-center">
              <Image
                src="/images/step1original.jpg"
                alt="Snap & Transform"
                width={200}
                height={200}
                className="-mt-10 h-auto rounded-2xl border-8 border-white object-cover object-right shadow-2xl"
              />
              <Image
                src="/images/arrow.png"
                alt="Arrow"
                width={180}
                height={180}
                className="absolute top-0 z-10 invert"
              />
              <Image
                src="/images/step1transformed.jpg"
                alt="Snap & Transform"
                width={250}
                height={250}
                className="rotate-5 rounded-2xl border-8 border-white object-cover object-right shadow-2xl"
              />
            </div>
            <div className="group relative">
              <div className="relative flex h-full flex-col rounded-2xl">
                <div className="mb-2 text-3xl font-bold text-white">STEP 1</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Upload & Transform
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  Upload your child's photo and watch our AI magically transform
                  them into a story hero!
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Locked.png"
                    alt="Lock"
                    width={20}
                    height={20}
                  />{' '}
                  100% secure & private - photos are never stored
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
                  src="/images/story_choose_en.png"
                  alt="Choose Adventure"
                  width={1200}
                  height={1200}
                  className="mb-4 h-60 w-full rounded-2xl object-cover opacity-0"
                />
                <Image
                  src="/images/story_choose_en.png"
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
                <div className="mb-2 text-3xl font-bold text-white">STEP 2</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Choose Adventure
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  Pick from magical templates or create your own unique
                  storyline. Dragons, castles, space adventures - you choose!
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Star.png"
                    alt="Sparkles"
                    width={20}
                    height={20}
                  />{' '}
                  Unlimited possibilities await
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
                <div className="mb-2 text-3xl font-bold text-white">STEP 3</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Story Magic!
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  Watch your personalized story come to life with beautiful
                  illustrations. Reading time just became magical!
                </p>
                <p className="flex items-center gap-1 text-sm font-light text-gray-300">
                  <Image
                    src="/emojis/Books.png"
                    alt="Book"
                    width={20}
                    height={20}
                  />{' '}
                  Perfect for bedtime stories
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
                  alt="Rocket"
                  width={24}
                  height={24}
                />{' '}
                Start Your Own Adventure
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
              Pick Their Perfect Adventure
              <Image
                src="/emojis/Parachute.png"
                alt="Parachute"
                width={50}
                height={50}
              />
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-white/95 drop-shadow-lg">
              Watch your child's eyes light up as they see themselves in their
              favorite world!
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
                      Classic Disney Magic
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      Transform your child into a Disney princess or prince!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">Parent favorite</span>
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
                      Pixar Adventures
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      Epic quests with incredible character development!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">Kids love it</span>
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
                      Lego Adventures
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      Build incredible worlds brick by brick with your hero!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">Kid approved</span>
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
                      Hero Rescue Stories
                    </h3>
                    <p className="mb-4 text-sm text-white/80">
                      Your little one saves the day with courage and teamwork!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-yellow-300">
                      <span className="text-lg">⭐⭐⭐⭐⭐</span>
                      <span className="text-sm">Top requested</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 space-y-36">
          <h2 className="mb-4 mb-16 flex items-center justify-center gap-3 text-4xl font-bold text-white drop-shadow-2xl md:text-5xl">
            ... and never run out of bedtime magic
            <Image src="/emojis/Zzz.png" alt="zzz" width={50} height={50} />
          </h2>
          {/* Feature Grid */}
          <div className="mx-auto flex max-w-5xl items-end">
            <Image
              src="/images/familybonding.png"
              alt="Family Bonding"
              width={1024}
              height={1024}
              className="h-90 w-1/2 rounded-2xl object-cover"
            />
            <div className="sticky top-0 -mb-10 -ml-10 h-full flex-1 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xs">
              <h3 className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold">
                Strengthen Family Bonds
                <Image
                  src="/emojis/Family.png"
                  alt="Heart"
                  width={32}
                  height={32}
                />
              </h3>
              <p className="text-lg leading-relaxed font-light">
                Actively participate in your child's bedtime storytelling,
                creating cherished shared moments. Involve loved ones, invent
                characters, and explore together!
              </p>
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl items-start">
            <div className="relative -mt-10 -mr-10 h-full flex-1 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-xs">
              <h3 className="mb-3 flex items-center justify-center gap-2 text-2xl font-bold">
                Hassle-Free Bedtime
                <Image
                  src="/emojis/Hugging-Face.png"
                  alt="Clock"
                  width={32}
                  height={32}
                />
              </h3>
              <p className="text-lg leading-relaxed font-light">
                Fresh stories for bedtime every night, saving parents time and
                ensuring a smooth, magical bedtime routine. No more "tell me
                another story" struggles!
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
                  Ready to Create Magic Every Night?
                </h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-white/90">
                  Join 50,000+ families already creating unforgettable
                  adventures!
                  <br />
                  Get{' '}
                  <span className="font-semibold text-yellow-300">
                    unlimited personalized stories
                  </span>{' '}
                  for less than a coffee.
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
                      Personalized Stories
                    </h3>
                    <p className="text-sm text-white/80">
                      600 tokens monthly - never run out of bedtime magic*!
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
                      Premium Quality
                    </h3>
                    <p className="text-sm text-white/80">
                      Beautiful illustrations & personalized adventures!
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
                      100% Safe
                    </h3>
                    <p className="text-sm text-white/80">
                      Private, secure, and designed for families!
                    </p>
                  </div>
                </div>

                {/* Pricing highlight */}
                <div className="mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-white">$5.99</span>
                    <span className="text-2xl text-white/70">/month</span>
                  </div>
                  <p className="mt-2 text-lg text-white/80">
                    Less than a pizza{' '}
                    <Image
                      src="/emojis/Pizza.png"
                      alt="Pizza"
                      width={24}
                      height={24}
                      className="-mt-0.5 inline-block"
                    />{' '}
                    • Cancel anytime • 30-day guarantee
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
                    Get Unlimited Magic
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
                    Try Free First
                  </Link>
                </div>

                <p className="mt-6 text-sm text-white/60">
                  <Image
                    src="/emojis/Wrapped-Gift.png"
                    alt="Gift"
                    width={22}
                    height={22}
                    className="-mt-0.5 inline-block"
                  />{' '}
                  Start with{' '}
                  <span className="font-semibold text-yellow-300">
                    120 free tokens
                  </span>{' '}
                  when you sign up - create your first magical story today!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="relative z-20 mx-auto mt-24 max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 flex items-center justify-center gap-2 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
              What Parents Say
              <Image
                src="/emojis/Love-Letter.png"
                alt="Sparkles"
                width={60}
                height={60}
              />
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-white/80">
              Real families sharing their magical story adventures!
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
                    <div className="font-semibold">Sarah M.</div>
                    <div className="text-sm text-pink-500">Mom of Emma, 6</div>
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
                  "Emma absolutely LOVES seeing herself as a princess! 👸 She
                  asks for her special stories every night. The AI makes her the
                  hero of every adventure!"
                </blockquote>
                <div className="text-sm text-gray-500">
                  💝 "Best bedtime routine ever!"
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
                    <div className="font-semibold">Mike & Lisa</div>
                    <div className="text-sm text-blue-500">
                      Parents of Jake, 4
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
                  "Our shy little Jake has become so confident! 🦸‍♂️ He loves
                  telling everyone about his dragon adventures. The stories are
                  so creative and safe!"
                </blockquote>
                <div className="text-sm text-gray-500">
                  🌟 "Boosted his imagination!"
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
                    <div className="font-semibold">Teacher Amy</div>
                    <div className="text-sm text-green-500">
                      Mom of twins, 5
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
                  "As a teacher AND a mom, I'm amazed! 📚 My twins each get
                  their own unique adventures. Great for reading skills and
                  creativity!"
                </blockquote>
                <div className="text-sm text-gray-500">
                  🎯 "Educational AND fun!"
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
                    <div className="font-semibold">Dr. Rodriguez</div>
                    <div className="text-sm text-orange-500">
                      Dad of Sofia, 7
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
                    "Sofia went from reluctant reader to story enthusiast! 📖
                    She's reading 30 minutes longer each night because she loves
                    her magical adventures."
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
                    <div className="font-semibold">Tech Mom Jenny</div>
                    <div className="text-sm text-purple-500">
                      Mom of Alex, 8
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
                    "I love how safe and private it is! 🔒 Alex gets amazing
                    stories while I know his data is protected. Perfect for
                    tech-savvy parents!"
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
