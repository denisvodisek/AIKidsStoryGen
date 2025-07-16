'use client';

import { useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
}

export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
  showValue = true,
  className = '',
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-base font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Track */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          {/* Progress */}
          <div
            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent outline-none"
        />

        {/* Thumb */}
        <div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg transition-all duration-200 hover:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Value display and age label */}
      {showValue && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {min} {unit}
          </span>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {value} {unit}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {max} {unit}
          </span>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 0;
          height: 0;
        }
        .slider::-moz-range-thumb {
          width: 0;
          height: 0;
          border: none;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
