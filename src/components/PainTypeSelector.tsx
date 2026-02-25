'use client';

import React from 'react';
import { PainTypeLabels, ALL_PAIN_TYPES, type PainTypeCode } from '../lib/types/painType';

interface PainTypeSelectorProps {
  selectedType: PainTypeCode | undefined;
  onChange: (type: PainTypeCode) => void;
  language?: 'es' | 'en';
}

export function PainTypeSelector({
  selectedType,
  onChange,
  language = 'es',
}: PainTypeSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {language === 'es' ? 'Tipo de Dolor' : 'Pain Type'} *
      </label>
      <div className="grid grid-cols-2 gap-2">
        {ALL_PAIN_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange(type)}
            className={`p-3 rounded-lg border-2 font-medium transition text-sm text-left ${
              selectedType === type
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
            }`}
            aria-pressed={selectedType === type}
            role="radio"
          >
            {PainTypeLabels[type]}
          </button>
        ))}
      </div>
      {!selectedType && (
        <p className="text-xs text-red-600 mt-2">
          {language === 'es'
            ? '* Selecciona un tipo de dolor para continuar'
            : '* Select a pain type to continue'}
        </p>
      )}
    </div>
  );
}
