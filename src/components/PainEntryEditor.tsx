'use client';

import React, { useState } from 'react';
import { PainTypeSelector } from './PainTypeSelector';
import type { PainTypeCode } from '../lib/types/painType';
import { bodyPartCatalog } from '../lib/body-parts';
import { bodyPartCatalogRefined } from '../lib/body-parts-refined';

interface PainEntryEditorProps {

  bodyPartId: string;
  initialIntensity: number;
  initialPainType: PainTypeCode | undefined;
  onSave: (intensity: number, painType: PainTypeCode) => void;
  onCancel: () => void;
}

export function PainEntryEditor({
  bodyPartId,
  initialIntensity,
  initialPainType,
  onSave,
  onCancel,
}: PainEntryEditorProps) {
  const [intensity, setIntensity] = useState(initialIntensity);
  const [painType, setPainType] = useState<PainTypeCode | undefined>(initialPainType);

  const refined = bodyPartCatalogRefined.parts[bodyPartId];
  const legacy = bodyPartCatalog.parts[bodyPartId];
  const displayName = refined?.anatomicalName || legacy?.anatomicalName || bodyPartId;

  const handleSave = () => {
    if (!painType) {
      alert('Por favor, selecciona un tipo de dolor');
      return;
    }
    onSave(intensity, painType);
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
      aria-labelledby="editor-title"
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="editor-title" className="text-lg font-bold mb-2">
          Editar Registro
        </h2>
        <p className="text-gray-600 text-sm mb-4">{displayName}</p>

        {/* Intensity Slider */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Intensidad: {intensity}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full"
            aria-label="Pain intensity slider"
          />
          <div className="mt-3 text-center">
            <div
              className="inline-block w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl"
              style={{
                backgroundColor:
                  intensity <= 3
                    ? '#fef3c7'
                    : intensity <= 6
                      ? '#fb923c'
                      : '#ef4444',
                color: intensity <= 3 ? '#92400e' : 'white',
              }}
            >
              {intensity}
            </div>
          </div>
        </div>

        {/* Pain Type Selector */}
        <PainTypeSelector
          selectedType={painType}
          onChange={setPainType}
          language="es"
        />

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium"
            aria-label="Cancelar"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!painType}
            className={`flex-1 px-4 py-2 rounded-lg transition font-medium ${
              painType
                ? 'text-white bg-blue-600 hover:bg-blue-700'
                : 'text-gray-400 bg-gray-300 cursor-not-allowed'
            }`}
            aria-label="Guardar cambios"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
