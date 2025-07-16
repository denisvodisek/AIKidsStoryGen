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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto mt-6 max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">
              {isSignUp ? (
                <>
                  One-Click
                  <br />
                  Account Creation
                </>
              ) : (
                'Welcome Back!'
              )}{' '}
              ✨
            </h1>
            <p className="text-xl text-gray-600">
              {nextAction === 'generate'
                ? 'One more step to create your magical story!'
                : 'Sign in to access your magical stories'}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Social Login Options */}
            <div className="mb-6 text-center">
              Sign in with your trusted social media accounts
            </div>
            <div className="grid grid-cols-1">
              <button className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50">
                <Image
                  src="/images/google-logo.png"
                  alt="Google"
                  width={24}
                  height={24}
                  className="mr-2 h-5 w-5"
                />
                Google
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-50">
                <Image
                  src="/images/facebook-logo.png"
                  alt="Facebook"
                  width={24}
                  height={24}
                  className="h-5 w-5 object-contain invert"
                />
                Facebook
              </button>
              <button className="flex w-full items-center justify-center rounded-xl border border-gray-300 bg-black px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-50">
                <Image
                  src="/images/apple-logo.png"
                  alt="Apple"
                  width={24}
                  height={24}
                  className="mr-2 h-5 w-5 object-contain"
                />
                Apple
              </button>
            </div>

            {/* Privacy Notice */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <div className="flex items-start space-x-2">
                <span className="text-blue-600">🔒</span>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800">
                    Safe & Secure
                  </h4>
                  <p className="text-xs text-blue-600">
                    Your data is encrypted and protected. We never share your
                    information or your child's photos with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
