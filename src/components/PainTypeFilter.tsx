'use client';

import React from 'react';
import { PainTypeLabels, ALL_PAIN_TYPES, type PainTypeCode } from '../lib/types/painType';

interface PainTypeFilterProps {
  selectedType: PainTypeCode | 'all' | undefined;
  onChange: (type: PainTypeCode | 'all') => void;
  language?: 'es' | 'en';
}

export function PainTypeFilter({
  selectedType,
  onChange,
  language = 'es',
}: PainTypeFilterProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {language === 'es' ? 'Filtrar por tipo de dolor' : 'Filter by pain type'}
      </label>
      <div className="flex flex-wrap gap-2">
        {/* "All" option */}
        <button
          onClick={() => onChange('all')}
          className={`px-4 py-2 rounded-full font-medium transition text-sm ${
            selectedType === 'all' || !selectedType
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
          }`}
          aria-pressed={selectedType === 'all' || !selectedType}
          role="radio"
        >
          {language === 'es' ? 'Todos' : 'All'}
        </button>

        {/* Individual pain types */}
        {ALL_PAIN_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`px-4 py-2 rounded-full font-medium transition text-sm ${
              selectedType === type
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
            }`}
            aria-pressed={selectedType === type}
            role="radio"
          >
            {PainTypeLabels[type]}
          </button>
        ))}
      </div>
    </div>
  );
}
