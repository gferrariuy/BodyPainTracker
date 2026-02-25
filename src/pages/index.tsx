'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePainData } from '../lib/hooks/usePainData';
import { getTodayString, getReadableDate } from '../lib/dates';
import { BodyDiagram } from '../components/BodyDiagram';

export default function RecorderPage() {
  const { getTodayEntry, recordPain, loading, error, clearError } =
    usePainData();
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [localError, setLocalError] = useState<string | null>(null);

  const todayEntry = getTodayEntry();
  const today = getTodayString();
  const todayReadable = getReadableDate(today);

  const handleBodyPartSelected = (bodyPartId: string, intensity: number) => {
    try {
      setLocalError(null);
      recordPain(bodyPartId, intensity);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to record pain';
      setLocalError(message);
    }
  };

  const dismissError = () => {
    setLocalError(null);
    clearError();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando rastreador de dolor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Rastreador de Dolor Corporal
          </h1>
          <p className="text-gray-600">
            Registrando dolor para <span className="font-semibold">{todayReadable}</span>
          </p>
        </div>

        {/* Error Alert */}
        {(error || localError) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <div className="flex-1">
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-red-700 text-sm">{error || localError}</p>
            </div>
            <button
              onClick={dismissError}
              className="text-red-600 hover:text-red-800 font-bold ml-2"
              aria-label="Descartar error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-900">
            Haz clic en las partes del cuerpo para registrar tus niveles de dolor. Usa el deslizador para
            calificar la intensidad de 1 (leve) a 10 (severo).
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('front')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'front'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-selected={activeTab === 'front'}
            role="tab"
          >
            Vista Frontal
          </button>
          <button
            onClick={() => setActiveTab('back')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'back'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            aria-selected={activeTab === 'back'}
            role="tab"
          >
            Vista Trasera
          </button>
        </div>

        {/* Body Diagram */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <BodyDiagram
            location={activeTab}
            painEntry={todayEntry || undefined}
            onBodyPartSelected={handleBodyPartSelected}
          />
        </div>

        {/* Summary */}
        {todayEntry && Object.keys(todayEntry.bodyPartEntries).length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-green-900 mb-4">
              Registros de Hoy: {Object.keys(todayEntry.bodyPartEntries).length}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Object.entries(todayEntry.bodyPartEntries).map(
                ([bodyPartId, entry]) => {
                  const bodyPart =
                    require('../lib/body-parts').bodyPartCatalog.parts[
                      bodyPartId
                    ];
                  return (
                    <div
                      key={bodyPartId}
                      className="p-3 rounded bg-white border border-green-200"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {bodyPart?.abbreviation || bodyPart?.anatomicalName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {entry.intensityLevel}/10
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/statistics"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Ver Estadísticas
          </Link>
          <Link
            href="/history"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            Ver Historial
          </Link>
        </div>
      </div>
    </main>
  );
}
