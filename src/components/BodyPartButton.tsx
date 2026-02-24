'use client';

import React from 'react';

interface BodyPartButtonProps {
  id: string;
  name: string;
  intensityLevel?: number;
  isSelected: boolean;
  onClick: () => void;
}

export function BodyPartButton({
  name,
  intensityLevel,
  isSelected,
  onClick,
}: BodyPartButtonProps) {
  const getColorClass = () => {
    if (!intensityLevel) return '';
    if (intensityLevel <= 3) return 'bg-pain-low text-gray-900 border-yellow-400';
    if (intensityLevel <= 6) return 'bg-pain-medium text-white border-orange-400';
    return 'bg-pain-high text-white border-red-400';
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
        border-2 cursor-pointer whitespace-nowrap
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${intensityLevel
          ? getColorClass()
          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
        }
      `}
      aria-pressed={isSelected}
      title={
        intensityLevel
          ? `${name}: Pain level ${intensityLevel}/10`
          : `Select ${name}`
      }
    >
      <div className="flex items-center gap-2">
        <span>{name}</span>
        {intensityLevel && (
          <span className="font-bold">{intensityLevel}/10</span>
        )}
      </div>
    </button>
  );
}
