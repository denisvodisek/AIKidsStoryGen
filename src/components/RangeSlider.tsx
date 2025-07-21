'use client';

import { useState } from 'react';
import { RangeSliderProps } from '@/types';

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
        <label className="block text-base font-semibold text-white">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Track */}
        <div className="h-2 w-full rounded-full bg-white/50">
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
          className="slider absolute inset-0 h-8 w-full cursor-pointer touch-pan-x appearance-none bg-transparent outline-none"
          style={{ zIndex: 10 }}
        />

        {/* Thumb */}
        <div
          className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg transition-all duration-200"
          style={{ left: `${percentage}%`, zIndex: 5 }}
        />
      </div>

      {/* Value display and age label */}
      {showValue && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">
            {min} {unit}
          </span>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-300">
              {value} {unit}
            </div>
          </div>
          <span className="text-sm text-white">
            {max} {unit}
          </span>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          border: none;
        }
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: transparent;
          cursor: pointer;
          border: none;
          -moz-appearance: none;
        }
        .slider::-webkit-slider-track {
          background: transparent;
        }
        .slider::-moz-range-track {
          background: transparent;
          border: none;
        }
        .slider {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}
