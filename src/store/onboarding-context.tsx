'use client';

import React, { createContext, useContext, useState } from 'react';

interface OnboardingData {
  step1: {
    photo: File | null;
    photoPreview: string;
    name: string;
    age: number;
    gender: string;
  };
  step2: {
    destination: string;
    themes: string[];
    customPrompt: string;
  };
}

interface OnboardingContextType {
  data: OnboardingData;
  updateStep1: (step1Data: Partial<OnboardingData['step1']>) => void;
  updateStep2: (step2Data: Partial<OnboardingData['step2']>) => void;
  clearData: () => void;
}

const defaultData: OnboardingData = {
  step1: {
    photo: null,
    photoPreview: '',
    name: '',
    age: 2,
    gender: '',
  },
  step2: {
    destination: '',
    themes: [],
    customPrompt: '',
  },
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateStep1 = (step1Data: Partial<OnboardingData['step1']>) => {
    setData(prev => ({
      ...prev,
      step1: { ...prev.step1, ...step1Data },
    }));
  };

  const updateStep2 = (step2Data: Partial<OnboardingData['step2']>) => {
    setData(prev => ({
      ...prev,
      step2: { ...prev.step2, ...step2Data },
    }));
  };

  const clearData = () => {
    setData(defaultData);
  };

  return (
    <OnboardingContext.Provider
      value={{ data, updateStep1, updateStep2, clearData }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
