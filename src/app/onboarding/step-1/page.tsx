'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RangeSlider from '@/components/RangeSlider';
import { uploadChildPhoto, deleteChildPhoto } from '@/lib/supabase';

export default function OnboardingStep1() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    photo: null as File | null,
    photoPreview: '',
    photoUrl: '',
    photoPath: '',
    name: '',
    age: 2,
    gender: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create preview for immediate display
      const reader = new FileReader();
      reader.onload = e => {
        setFormData(prev => ({
          ...prev,
          photoPreview: e.target?.result as string,
        }));
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
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoUrl: data.publicUrl,
          photoPath: data.path,
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      formData.photoUrl && formData.name && formData.age && formData.gender
    );
  };

  const handleContinue = () => {
    if (isFormValid()) {
      // Store form data in localStorage with photo URL
      const dataToStore = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        photoUrl: formData.photoUrl,
        photoPath: formData.photoPath, // For cleanup if needed
      };
      localStorage.setItem('onboarding-step1', JSON.stringify(dataToStore));
      router.push('/onboarding/step-2');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto mt-6 max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
              Let's Create Your Child's Story! ✨
            </h1>
            <p className="text-lg text-gray-600">
              First, tell us about your little hero
            </p>
          </div>

          <div className="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Photo Upload Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-800">
                    📸 Upload Your Child's Photo
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
                      className={`flex h-80 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all ${
                        isUploading
                          ? 'cursor-not-allowed opacity-75'
                          : 'cursor-pointer hover:border-purple-400 hover:bg-purple-50'
                      }`}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
                          <p className="font-medium text-purple-600">
                            Uploading photo...
                          </p>
                        </div>
                      ) : formData.photoPreview ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={formData.photoPreview}
                            alt="Child's photo"
                            fill
                            className="rounded-2xl object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                            <span className="font-semibold text-white">
                              Change Photo
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                            <span className="text-3xl">📸</span>
                          </div>
                          <p className="text-center text-gray-600">
                            <span className="font-semibold text-purple-600">
                              Click to upload
                            </span>
                            <br />
                            or drag and drop your photo here
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    🔒 Your photo is secure, won't be stored, and will only be
                    used to create your story.
                  </p>
                </div>

                {/* Preview Section */}
                {formData.photoPreview && (
                  <div className="rounded-2xl border-2 border-purple-200 bg-purple-50 p-4">
                    <p className="text-sm text-purple-600">
                      ✨ Our AI will transform this photo into a magical cartoon
                      character for their stories!
                    </p>
                  </div>
                )}
              </div>

              {/* Form Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="mb-4 text-xl font-bold text-gray-800">
                    👶 Tell Us About Your Child
                  </h2>

                  {/* Name */}
                  <div className="mb-6">
                    <label className="mb-2 block text-base font-semibold text-gray-700">
                      What's your child's name?
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder="Cody Marshall"
                      className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none"
                    />
                  </div>

                  {/* Age Slider */}
                  <div className="mb-6">
                    <RangeSlider
                      min={1}
                      max={7}
                      value={formData.age}
                      onChange={age => setFormData(prev => ({ ...prev, age }))}
                      label="How old is your child?"
                      unit="years old"
                    />
                  </div>

                  {/* Gender */}
                  <div className="mb-6">
                    <label className="mb-2 block text-base font-semibold text-gray-700">
                      Gender
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex cursor-pointer items-center space-x-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all hover:border-purple-300 hover:bg-purple-50">
                        <input
                          type="radio"
                          name="gender"
                          value="boy"
                          checked={formData.gender === 'boy'}
                          onChange={e =>
                            handleInputChange('gender', e.target.value)
                          }
                          className="h-5 w-5 text-purple-600"
                        />
                        <span className="text-lg text-gray-700">👦 Boy</span>
                      </label>
                      <label className="flex cursor-pointer items-center space-x-3 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-all hover:border-purple-300 hover:bg-purple-50">
                        <input
                          type="radio"
                          name="gender"
                          value="girl"
                          checked={formData.gender === 'girl'}
                          onChange={e =>
                            handleInputChange('gender', e.target.value)
                          }
                          className="h-5 w-5 text-purple-600"
                        />
                        <span className="text-lg text-gray-700">👧 Girl</span>
                      </label>
                    </div>
                  </div>

                  {/* Privacy Note */}
                  <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-4 shadow-inner">
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-600">🔒</span>
                      <div>
                        <h4 className="font-semibold text-blue-800">
                          How do we use this information?
                        </h4>
                        <p className="text-sm text-blue-600">
                          We use a photo reference of your child, age and gender
                          to create a unique and realistic character resemblance
                          with the help of AI.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    disabled={!isFormValid()}
                    className={`w-full rounded-full px-8 py-4 text-lg font-semibold transition-all ${
                      isFormValid()
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 hover:from-pink-600 hover:to-purple-700'
                        : 'cursor-not-allowed bg-gray-300 text-gray-500'
                    }`}
                  >
                    ✨ Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
