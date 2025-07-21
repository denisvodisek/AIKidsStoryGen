'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextAction = searchParams?.get('next');

  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      // After successful auth, redirect based on next parameter
      if (nextAction === 'generate') {
        router.push('/generate');
      } else {
        router.push('/dashboard');
      }
    }, 2000);
  };

  const isFormValid = () => {
    if (isSignUp) {
      return formData.email && formData.password && formData.name;
    }
    return formData.email && formData.password;
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
            {/* Welcome Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-white drop-shadow-2xl md:text-4xl">
                One-Click Magic Access
                <Image
                  src="/emojis/Magic-Wand.png"
                  alt="Magic"
                  width={32}
                  height={32}
                  className="ml-2 inline-block"
                />
              </h1>
              <p className="text-lg text-white/90">
                Choose your preferred sign-in method
              </p>
            </div>

            {/* Auth Card */}
            <div className="relative rounded-3xl backdrop-blur-md">
              <div className="relative">
                {/* Floating particles inside card */}
                <div className="absolute top-4 left-4 h-2 w-2 animate-ping rounded-full bg-yellow-300/80"></div>
                <div className="absolute top-6 right-6 h-3 w-3 animate-pulse rounded-full bg-pink-300/70 [animation-delay:-0.5s]"></div>
                <div className="absolute bottom-4 left-6 h-2 w-2 animate-ping rounded-full bg-blue-300/60 [animation-delay:-1s]"></div>

                {/* Google Login - Primary */}
                <button className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 text-lg font-bold text-gray-700 shadow-xl transition-all hover:scale-105 hover:bg-gray-50">
                  <Image
                    src="/images/google-logo.png"
                    alt="Google"
                    width={24}
                    height={24}
                  />
                  Continue with Google
                </button>

                {/* Facebook & Apple */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-blue-700">
                    <Image
                      src="/images/facebook-logo.png"
                      alt="Facebook"
                      width={20}
                      height={20}
                      className="invert"
                    />
                    Facebook
                  </button>
                  <button className="flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2 font-bold text-white shadow-xl transition-all hover:scale-105 hover:bg-gray-900">
                    <Image
                      src="/images/apple-logo.png"
                      alt="Apple"
                      width={20}
                      height={20}
                    />
                    Apple
                  </button>
                </div>

                {/* Benefits Showcase */}
                <div className="mt-8 space-y-3 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <Image
                      src="/emojis/Gem-Stone.png"
                      alt="Gem"
                      width={20}
                      height={20}
                    />
                    <span className="text-sm font-bold text-yellow-300">
                      120 FREE tokens
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
                      Create your first story instantly
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
                      Safe & secure for your family
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <Image
                      src="/emojis/Heart-Hands.png"
                      alt="Heart"
                      width={20}
                      height={20}
                    />
                    <span className="text-sm">Join 50,000+ happy families</span>
                  </div>
                </div>

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
                        Safe & Secure
                      </h4>
                      <p className="text-xs leading-relaxed text-white/80">
                        Your data is encrypted and protected. We never share
                        your information or your child's photos with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">
                By signing in, you agree to our magical terms ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
