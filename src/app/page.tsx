import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LandingPage() {
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
              <span className="text-white">Adventures! 🌟</span>
            </h1>
            {/* Floating elements around title */}
            <div className="absolute -top-4 -right-4 animate-bounce text-4xl">
              🦄
            </div>
            <div className="absolute -bottom-4 -left-4 animate-pulse text-3xl">
              🌈
            </div>
          </div>

          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed font-light text-white/90 drop-shadow-lg md:text-xl">
            Make your child the ⭐{' '}
            <span className="font-medium text-yellow-300">main character</span>{' '}
            ⭐ in their own magical stories!
            <br />
            <span className="font-normal">
              AI creates personalized tales with beautiful pictures in seconds!
            </span>{' '}
            📚✨
          </p>

          <div className="mb-16 flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Link
              href="/onboarding/step-1"
              className="flex transform items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500 px-10 py-4 text-xl font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-green-500 hover:to-blue-600"
            >
              <span>🚀 Start Creating!</span>
            </Link>
            <Link
              href="/stories"
              className="flex transform items-center justify-center space-x-2 rounded-full border-2 border-white/30 bg-white/20 px-10 py-4 text-xl font-medium text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/30"
            >
              <span>👀 See Examples</span>
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
                className="h-auto rounded-2xl object-cover"
              />
              <Image
                src="/images/arrow.png"
                alt="Arrow"
                width={180}
                height={180}
                className="absolute top-0 invert"
              />
              <Image
                src="/images/step1transformed.jpg"
                alt="Snap & Transform"
                width={250}
                height={250}
                className="rounded-2xl"
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
                <p className="text-sm font-light text-gray-300">
                  🔒 100% secure & private - photos are never stored
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
                  src="/images/step2.png"
                  alt="Choose Adventure"
                  width={1200}
                  height={1200}
                  className="mb-4 h-60 w-full rounded-2xl object-cover"
                />
                <div className="mb-2 text-3xl font-bold text-white">STEP 2</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Choose Adventure
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  Pick from magical templates or create your own unique
                  storyline. Dragons, castles, space adventures - you choose!
                </p>
                <p className="text-sm font-light text-gray-300">
                  🌟 Unlimited possibilities await
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl"></div>
              <div className="relative flex h-full flex-col rounded-2xl">
                <Image
                  src="/images/step1transformed.jpg"
                  alt="Story Magic!"
                  width={200}
                  height={200}
                  className="mb-4 h-60 w-full rounded-2xl object-cover"
                />
                <div className="mb-2 text-3xl font-bold text-white">STEP 3</div>
                <h3 className="mb-4 text-2xl font-bold text-white">
                  Story Magic!
                </h3>
                <p className="mb-4 leading-relaxed font-light text-white/80">
                  Watch your personalized story come to life with beautiful
                  illustrations. Reading time just became magical!
                </p>
                <p className="text-sm font-light text-gray-300">
                  📚 Perfect for bedtime stories
                </p>
              </div>
            </div>
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
          {/* Main Feature - New Story Every Night */}
          <Image
            src="/images/nightsky.png"
            alt="A New Story Every Night"
            width={1024}
            height={1024}
            className="parallax h-90 w-full rounded-2xl object-cover object-[100%_40%]"
          />
          <div className="to-pink-7 00 relative z-10 mx-auto -mt-20 mb-16 max-w-5xl rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-900 p-8 text-center shadow-2xl shadow-purple-500/50">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              A New Story Every Night 🌙
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed font-light text-white/90">
              Your children become the{' '}
              <span className="font-semibold text-yellow-300">
                heroes of their own personalized stories
              </span>
              , making bedtime a magical experience for the whole family! The
              stories are supported with{' '}
              <span className="font-semibold text-pink-300">
                loving illustrations
              </span>{' '}
              that stimulate children's imagination.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 space-y-36">
          {/* Feature Grid */}
          <div className="mx-auto flex max-w-5xl items-end">
            <Image
              src="/images/familybonding.png"
              alt="Family Bonding"
              width={1024}
              height={1024}
              className="h-90 w-1/2 rounded-2xl object-cover"
            />
            <div className="sticky top-0 -mb-10 -ml-10 h-full flex-1 rounded-2xl bg-white/90 p-8 shadow-2xl">
              <h3 className="mb-3 text-2xl font-bold">
                Strengthen Family Bonds 💖
              </h3>
              <p className="text-lg leading-relaxed font-light">
                Actively participate in your child's bedtime storytelling,
                creating cherished shared moments. Involve loved ones, invent
                characters, and explore together!
              </p>
            </div>
          </div>
          <div className="mx-auto flex max-w-5xl items-start">
            <div className="relative -mt-10 -mr-10 h-full flex-1 rounded-2xl bg-white/90 p-8 shadow-2xl">
              <h3 className="mb-3 text-2xl font-bold">
                Hassle-Free Bedtime ⏰
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

        {/* REVIEWS */}
        <div className="relative z-20 mx-auto mt-24 max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
              What Parents Say ✨
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-2xl shadow-lg">
                    👩‍💼
                  </div>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 text-2xl shadow-lg">
                    👨‍👩‍👧‍👦
                  </div>
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-2xl shadow-lg">
                    🧑‍🏫
                  </div>
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
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Testimonial 4 */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-white transition duration-300 group-hover:opacity-80"></div>
              <div className="relative flex rounded-2xl p-8">
                <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-3xl shadow-lg">
                  👨‍⚕️
                </div>
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
              <div className="relative flex rounded-2xl p-8">
                <div className="mr-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-3xl shadow-lg">
                  👩‍💻
                </div>
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
