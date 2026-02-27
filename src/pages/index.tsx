'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePainData } from '../lib/hooks/usePainData';
import { getTodayString, getReadableDate } from '../lib/dates';
import { BodyImageDiagram, BodyPartArea } from '../components/BodyImageDiagram';
import { getRegionDisplayName } from '../lib/body-parts-utils';
import { bodyPartCatalogRefined } from '../lib/body-parts-refined';
import { PainTypeLabels } from '../lib/types/painType';
import type { PainTypeCode } from '../lib/types/painType';
import { MigrationNotification } from '../components/MigrationNotification';

export default function RecorderPage() {
  const { getTodayEntry, recordPain, loading, error, clearError, migrationStatus, performMigration } =
    usePainData();
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [localError, setLocalError] = useState<string | null>(null);

  // areas correspond to clickable regions on the provided body image
  // using valid IDs from bodyPartCatalogRefined
  const bodyAreas: BodyPartArea[] = [
    // Head and Neck (front)
    { id: 'neck_left_anterior', coords: '263,42,259,56,263,65,270,74,284,66,286,56,286,40,274,35,281,36', shape: 'poly' },
    // Head and Neck (back)
    { id: 'neck_right_posterior', coords: '388,39,385,44,383,51,383,57,387,62,397,65,409,52,409,40,400,34', shape:'poly'},
    // Shoulders (front and back - mapped to appropriate subdivision)
    { id: 'shoulder_left_superior', coords:'270,71,263,72,258,73,247,80,239,84,239,95,244,101,252,93,258,85,265,80,272,81', shape:'poly'},
    { id: 'shoulder_right_superior', coords:'285,78,283,85,295,92,303,101,310,95,309,89,302,83,293,77', shape:'poly'},
    // Chest (front)
    { id: 'dorsal_left_superior', coords:"274,90,261,85,251,91,251,100,249,118,253,131,274,125", shape:"poly"},
    { id: 'dorsal_right_superior', coords:"275,90,278,124,293,133,297,96,290,89", shape:"poly"},
    // Arms (front)
    { id: 'arm_left_proximal', coords:"238,101,234,138,251,135,246,104", shape:"poly"},
    { id: 'arm_right_proximal', coords:"301,105,300,137,313,135,311,100", shape:"poly"},
    // Forearms (front)
    { id: 'forearm_left_anterolateral', coords:"246,146,235,143,228,178,238,179", shape:"poly"},
    { id: 'forearm_right_anterolateral', coords:"302,147,317,144,323,174,312,176", shape:"poly"},
    // Abdomen (front)
    { id: 'lumbar_left_superior', coords:"253,140,274,129,276,179,251,170", shape:"poly"},
    { id: 'lumbar_right_superior', coords:"273,131,275,173,298,169,291,140", shape:"poly"},
    // Hips/Groin (front)
    { id: 'groin_left_medial', coords:"250,170,252,184,247,196,244,184", shape:"poly"},
    { id: 'groin_right_medial', coords:"302,168,297,183,304,196,306,182", shape:"poly"},
    { id: 'groin_left_lateral', coords:"264,183,274,195,286,183", shape:"poly"},
    // Thighs (front)
    { id: 'thigh_right_anterior', coords:"289,190,279,204,277,236,295,240,304,205,301,206,300,198", shape:"poly"},
    { id: 'thigh_left_anterior', coords:"274,236,272,194,260,188,247,206,256,243", shape:"poly"},
    // Shins/Lower legs (front)
    { id: 'shin_left_anterior', coords:"260,252,271,253,270,298,260,298,255,265", shape:"poly"},
    { id: 'shin_right_anterior', coords:"281,254,296,255,290,302,281,295", shape:"poly"},
    // Back view - shoulders
    { id: 'shoulder_left_inferior', coords:"391,77,386,90,363,92,371,82", shape:"poly"},
    { id: 'shoulder_right_inferior', coords:"404,73,406,88,429,93,424,83", shape:"poly"},
    // Back view - dorsal (upper back)
    { id: 'dorsal_left_inferior', coords:"397,78,397,133,384,126,375,106,375,91", shape:"poly"},
    { id: 'dorsal_right_inferior', coords:"402,78,398,136,419,123,422,110,425,95", shape:"poly"},
    // Back view - arms/triceps
    { id: 'arm_left_distal', coords:"360,95,372,100,372,137,362,133", shape:"poly"},
    { id: 'arm_right_distal', coords:"427,94,435,96,432,134,420,134", shape:"poly"},
    // Back view - forearms
    { id: 'forearm_left_posterolateral', coords:"358,139,374,141,360,183,351,180", shape:"poly"},
    { id: 'forearm_right_posterolateral', coords:"421,148,439,148,446,178,437,181", shape:"poly"},
    // Back view - lumbar (lower back)
    { id: 'lumbar_left_inferior', coords:"399,140,379,139,379,153,397,173", shape:"poly"},
    { id: 'lumbar_right_inferior', coords:"398,139,400,173,418,157,412,143", shape:"poly"},
    // Back view - gluteal (buttocks)
    { id: 'gluteal_left_superior', coords:"380,166,393,182,392,192,370,189,373,172", shape:"poly"},
    { id: 'gluteal_right_superior', coords:"417,165,409,174,402,182,405,191,417,191,426,181", shape:"poly"},
    // Back view - thighs
    { id: 'thigh_left_posterior', coords:"370,200,395,196,395,243,378,238", shape:"poly"},
    { id: 'thigh_right_posterior', coords:"399,198,399,246,414,241,424,199", shape:"poly"},
    // Back view - shins
    { id: 'shin_left_posterior', coords:"393,256,379,302", shape:"rect"},
    { id: 'shin_right_posterior', coords:"400,254,416,254,412,303,403,302", shape:"poly"},
  ];

  const todayEntry = getTodayEntry();
  const today = getTodayString();
  const todayReadable = getReadableDate(today);

  const handleBodyPartSelected = (bodyPartId: string, intensity: number, painType: PainTypeCode) => {
    try {
      setLocalError(null);
      recordPain(bodyPartId, intensity, painType);
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
      <MigrationNotification
        status={migrationStatus}
        error={error || undefined}
        onDismiss={() => clearError()}
        onMigrate={() => performMigration()}
      />
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
          <BodyImageDiagram
            src="/images/body-photo.jpeg" // make sure this file exists (front+back image)
            areas={bodyAreas}
            onBodyPartSelected={handleBodyPartSelected}
            width={600}
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
                  const refined = bodyPartCatalogRefined.parts[bodyPartId];
                  const legacy = require('../lib/body-parts').bodyPartCatalog.parts[bodyPartId];
                  const label = refined?.abbreviation || refined?.anatomicalName || legacy?.abbreviation || getRegionDisplayName(bodyPartId);

                  return (
                    <div
                      key={bodyPartId}
                      className="p-3 rounded bg-white border border-green-200"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {label}
                      </p>
                      <p className="text-sm text-gray-600">
                        {entry.intensityLevel}/10
                      </p>
                      {entry.painType && entry.painType !== 'unknown' && (
                        <p className="text-xs text-gray-500">
                          {PainTypeLabels[entry.painType]}
                        </p>
                      )}
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
