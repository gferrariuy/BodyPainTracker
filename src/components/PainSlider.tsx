'use client';

import React, { useState } from 'react';

interface PainSliderProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
  bodyPartName: string;
}

export function PainSlider({
  value,
  onChange,
  onConfirm,
  onCancel,
  bodyPartName,
}: PainSliderProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getIntensityText = () => {
    if (localValue <= 3) return 'Mild';
    if (localValue <= 6) return 'Moderate';
    if (localValue <= 8) return 'Severe';
    return 'Very Severe';
  };

  const getColorClass = () => {
    if (localValue <= 3) return 'text-yellow-600';
    if (localValue <= 6) return 'text-orange-600';
    if (localValue <= 8) return 'text-red-600';
    return 'text-red-800';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="slider-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="slider-title" className="text-lg font-bold mb-2">
          {bodyPartName}
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Rate your pain intensity from 1 to 10
        </p>

        <div className="mb-6">
          <input
            type="range"
            min="1"
            max="10"
            value={localValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full mb-4"
            aria-label="Pain intensity slider"
            autoFocus
          />

          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getColorClass()}`}>
                {localValue}
              </div>
              <div className="text-gray-600 text-sm">{getIntensityText()}</div>
            </div>

            <div className="flex-1 ml-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{
                backgroundColor:
                  localValue <= 3
                    ? '#fef3c7'
                    : localValue <= 6
                      ? '#fb923c'
                      : '#ef4444',
                color: localValue <= 3 ? '#92400e' : 'white',
              }}>
                {localValue}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium"
            aria-label="Confirm pain level"
          >
            Confirm
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          Press ESC to cancel
        </p>
      </div>
    </div>
  );
}
