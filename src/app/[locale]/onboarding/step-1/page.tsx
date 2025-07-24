'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RangeSlider from '@/components/RangeSlider';
import { uploadChildPhoto } from '@/lib/supabase';
import { useOnboardingStore } from '@/store';
import { useTranslations } from 'next-intl';

export default function OnboardingStep1() {
  const router = useRouter();
  const t = useTranslations('onboarding.step1');
  const {
    step1FormData,
    setStep1FormData,
    isUploading,
    setIsUploading,
    setStep1Data,
    isStep1Valid,
  } = useOnboardingStore();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create preview for immediate display
      const reader = new FileReader();
      reader.onload = e => {
        setStep1FormData({
          photoPreview: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const { data, error } = await uploadChildPhoto(file);

      if (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload photo. Please try again.');
        return;
      }

      if (data) {
        // Note: photoUrl is a signed URL that expires in 24 hours
        setStep1FormData({
          photo: file,
          photoUrl: data.publicUrl,
          photoPath: data.path,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setStep1FormData({ [field]: value });
  };

  const handleContinue = () => {
    if (isStep1Valid()) {
      // Store form data using Zustand store
      const dataToStore = {
        name: step1FormData.name,
        age: step1FormData.age,
        gender: step1FormData.gender,
        photoUrl: step1FormData.photoUrl,
        photoPath: step1FormData.photoPath, // For cleanup if needed
      };
      setStep1Data(dataToStore);
      router.push('/onboarding/step-2');
    }
  };

  return (
    <div className="inset-0">
      {/* Magical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-indigo-700 to-pink-800 transition-all duration-1000 ease-in-out">
        {/* Floating magical elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gentle floating particles - responsive positioning */}
          <div className="absolute top-16 left-4 h-2 w-2 animate-pulse rounded-full bg-yellow-300/50 opacity-70 sm:top-24 sm:left-20 sm:h-3 sm:w-3"></div>
          <div className="absolute top-32 right-4 h-1 w-1 animate-pulse rounded-full bg-pink-300/60 opacity-80 [animation-delay:-0.5s] sm:top-40 sm:right-28 sm:h-2 sm:w-2"></div>
          <div className="absolute bottom-32 left-1/4 h-3 w-3 animate-pulse rounded-full bg-cyan-300/40 opacity-60 [animation-delay:-1s] sm:bottom-40 sm:h-4 sm:w-4"></div>
          <div className="absolute top-2/3 right-1/3 h-2 w-2 animate-pulse rounded-full bg-purple-300/50 opacity-70 [animation-delay:-1.5s] sm:h-3 sm:w-3"></div>

          {/* Soft magical orbs - responsive sizes */}
          <div className="absolute top-20 right-4 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-lg [animation-delay:-0.8s] sm:top-28 sm:right-20 sm:h-16 sm:w-16"></div>
          <div className="absolute bottom-20 left-4 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-lg [animation-delay:-1.3s] sm:bottom-28 sm:left-20 sm:h-20 sm:w-20"></div>
          <div className="absolute top-1/2 left-1/2 h-12 w-12 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-pink-400/20 blur-lg [animation-delay:-1.8s] sm:h-16 sm:w-16"></div>

          {/* Sparkle effects - hidden on mobile for cleaner look */}
          <div className="absolute top-12 right-1/2 hidden animate-ping text-lg opacity-60 sm:block sm:text-xl">
            ✨
          </div>
          <div className="absolute bottom-16 left-1/3 hidden animate-ping text-xl opacity-70 [animation-delay:-0.6s] sm:block sm:text-2xl">
            ⭐
          </div>
          <div className="absolute top-1/3 right-8 hidden animate-ping text-base opacity-50 [animation-delay:-1.1s] sm:right-16 sm:block sm:text-lg">
            🌟
          </div>
          <div className="absolute bottom-1/3 left-8 hidden animate-ping text-lg opacity-65 [animation-delay:-1.7s] sm:left-20 sm:block sm:text-xl">
            💫
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto mt-4 max-w-5xl sm:mt-6">
            {/* Header */}
            <div className="relative mb-8 text-center sm:mb-12">
              {/* Progress Indicator */}
              <div className="mt-6 mb-6 flex justify-center sm:mt-8">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"></div>
                  <div className="h-2 w-8 rounded-full bg-white/20"></div>
                  <div className="h-2 w-8 rounded-full bg-white/20"></div>
                  <span className="ml-2 text-sm text-white/70">
                    {t('progress')}
                  </span>
                </div>
              </div>

              <h1 className="mb-4 text-2xl font-bold leading-tight text-white sm:mb-6 xl:text-4xl">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-2xl text-base text-white/90 sm:text-lg">
                {t('subtitle')}
              </p>
            </div>

            <div className="rounded-2xl bg-white/20 p-6 shadow-2xl backdrop-blur-md sm:rounded-3xl sm:p-8">
              <div className="grid gap-8 md:grid-cols-2">
                {/* Photo Upload Section */}
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 flex gap-1 text-lg font-bold text-white sm:text-xl">
                      <Image
                        src="/emojis/Camera.png"
                        alt="Camera"
                        width={24}
                        height={24}
                        className="-mt-2 mr-2 object-contain"
                      />
                      {t('photo.title')}
                    </h2>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={isUploading}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className={`flex h-60 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all sm:h-80 ${
                          isUploading
                            ? 'cursor-not-allowed border-white/30 bg-white/5 opacity-75'
                            : 'cursor-pointer border-white/30 bg-white/5 hover:border-pink-400 hover:bg-white/10'
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-400"></div>
                            <p className="font-medium text-pink-300">
                              {t('photo.uploading')}
                            </p>
                          </div>
                        ) : step1FormData.photoPreview ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={step1FormData.photoPreview}
                              alt="Child's photo"
                              fill
                              className="rounded-2xl object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                              <span className="font-semibold text-white">
                                {t('photo.change')}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 sm:h-16 sm:w-16">
                              <Image
                                src="/emojis/Camera-With-Flash.png"
                                alt="Camera"
                                width={32}
                                height={32}
                                className="sm:h-10 sm:w-10"
                              />
                            </div>
                            <p className="text-center text-white/90">
                              <span className="font-semibold text-pink-300">
                                {t('photo.cta')}
                              </span>
                              <br />
                              <span className="text-sm text-white/70">
                                {t('photo.ctaSubtitle')}
                              </span>
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    <p className="mt-2 flex items-start text-sm text-white/70">
                      <Image
                        src="/emojis/Locked.png"
                        alt="Lock"
                        width={20}
                        height={20}
                        className="mr-1 object-contain"
                      />
                      {t('photo.secure')}
                    </p>
                  </div>

                  {/* Preview Section */}
                  {step1FormData.photoPreview && (
                    <div className="rounded-2xl border-2 border-pink-300/30 bg-white/10 p-4 backdrop-blur-sm">
                      <p className="flex items-start gap-1 text-sm text-pink-100">
                        <Image
                          src="/emojis/Robot.png"
                          alt="Star"
                          width={24}
                          height={24}
                          className="mr-1 object-contain"
                        />
                        {t('preview.title')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Form Section */}
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 flex gap-1 text-lg font-bold text-white sm:text-xl">
                      <Image
                        src="/emojis/Star.png"
                        alt="Star"
                        width={24}
                        height={24}
                        className="mr-1 object-contain"
                      />
                      {t('form.title')}
                    </h2>

                    {/* Name */}
                    <div className="mb-6">
                      <label className="mb-2 block text-base font-semibold text-white">
                        {t('form.name')}
                      </label>
                      <input
                        type="text"
                        value={step1FormData.name}
                        onChange={e =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder={t('form.namePlaceholder')}
                        className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-white backdrop-blur-sm transition-colors placeholder:text-white/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-100/20 focus:outline-none"
                      />
                    </div>

                    {/* Age Slider */}
                    <div className="mb-6">
                      <RangeSlider
                        min={1}
                        max={7}
                        value={step1FormData.age}
                        onChange={age => setStep1FormData({ age })}
                        label={t('form.age')}
                        unit={t('form.ageUnit')}
                      />
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                      <label className="mb-2 block text-base font-semibold text-white">
                        {t('form.gender')}
                      </label>
                      <div className="flex gap-3 sm:flex-row sm:gap-4">
                        <label className="flex cursor-pointer items-center space-x-3 rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:border-pink-300 hover:bg-white/20">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={step1FormData.gender === 'male'}
                            onChange={e =>
                              handleInputChange('gender', e.target.value)
                            }
                            className="h-5 w-5 text-pink-400"
                          />
                          <span className="flex items-center text-base text-white sm:text-lg">
                            <Image
                              src="/emojis/Boy.png"
                              alt="Boy"
                              width={24}
                              height={24}
                              className="mr-1 object-contain"
                            />
                            {t('form.boy')}
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-center space-x-3 rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:border-pink-300 hover:bg-white/20">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={step1FormData.gender === 'female'}
                            onChange={e =>
                              handleInputChange('gender', e.target.value)
                            }
                            className="h-5 w-5 text-pink-400"
                          />
                          <span className="flex items-center text-base text-white sm:text-lg">
                            <Image
                              src="/emojis/Girl.png"
                              alt="Girl"
                              width={24}
                              height={24}
                              className="mr-1 object-contain"
                            />
                            {t('form.girl')}
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="mb-6 rounded-2xl border border-cyan-300/30 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-4 backdrop-blur-sm">
                      <div className="flex items-start space-x-2">
                        <Image
                          src="/emojis/Locked-With-Key.png"
                          alt="Lock"
                          width={24}
                          height={24}
                          className="mr-1 object-contain"
                        />
                        <div>
                          <h4 className="font-semibold text-cyan-200">
                            {t('privacy.title')}
                          </h4>
                          <p className="text-sm text-cyan-100/90">
                            {t('privacy.description')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Continue Button */}
                    <button
                      onClick={handleContinue}
                      disabled={!isStep1Valid()}
                      className={`gap flex w-full items-center justify-center gap-1 rounded-2xl px-6 py-4 text-lg font-semibold transition-all sm:rounded-full sm:px-8 ${
                        isStep1Valid()
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                          : 'cursor-not-allowed bg-white/20 text-white/50'
                      }`}
                    >
                      <Image
                        src="/emojis/Sparkles.png"
                        alt="Arrow Right"
                        width={24}
                        height={24}
                        className=""
                      />
                      {t('cta')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
