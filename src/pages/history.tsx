'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePainData } from '../lib/hooks/usePainData';
import { getReadableDate } from '../lib/dates';
import { bodyPartCatalog } from '../lib/body-parts';
import { PainTypeLabels } from '../lib/types/painType';
import { PainEntryEditor } from '../components/PainEntryEditor';
import type { PainTypeCode } from '../lib/types/painType';

export default function HistoryPage() {
  const { getAllEntries, removePain, updatePain, loading } = usePainData();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<{
    date: string;
    bodyPartId: string;
  } | null>(null);

  const entries = getAllEntries();

  const toggleExpanded = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date);
  };

  const handleDelete = (date: string, bodyPartId: string) => {
    if (confirm(`Delete pain record for ${bodyPartCatalog.parts[bodyPartId]?.anatomicalName} on ${getReadableDate(date)}?`)) {
      removePain(date, bodyPartId);
    }
  };

  const handleEdit = (date: string, bodyPartId: string) => {
    setEditingEntry({ date, bodyPartId });
  };

  const handleSaveEdit = (intensity: number, painType: PainTypeCode) => {
    if (editingEntry) {
      try {
        updatePain(editingEntry.date, editingEntry.bodyPartId, intensity, painType);
        setEditingEntry(null);
      } catch (err) {
        alert(`Error updating record: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };

  const handleDeleteDay = (date: string) => {
    if (confirm(`Delete all pain records for ${getReadableDate(date)}?`)) {
      const entry = entries.find((e) => e.date === date);
      if (entry) {
        Object.keys(entry.bodyPartEntries).forEach((bodyPartId) => {
          removePain(date, bodyPartId);
        });
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando historial...</p>
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
            Historial de Dolor
          </h1>
          <p className="text-gray-600">
            Ver y gestionar tus registros de dolor grabados
          </p>
        </div>

        {/* History List */}
        {entries.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-900 text-lg">
              Aún no hay registros de dolor.
            </p>
            <p className="text-blue-700 mt-2">
              Comienza a registrar para ver tu historial aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.date}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition animate-fade-in"
              >
                {/* Header / Toggle */}
                <button
                  onClick={() => toggleExpanded(entry.date)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                  aria-expanded={expandedDate === entry.date}
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {getReadableDate(entry.date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {Object.keys(entry.bodyPartEntries).length} parte del cuerpo
                        {Object.keys(entry.bodyPartEntries).length !== 1
                          ? 's'
                          : ''}{' '}
                        registrada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Intensity Badges */}
                    <div className="flex gap-1">
                      {Object.values(entry.bodyPartEntries)
                        .slice(0, 3)
                        .map((bp, idx) => (
                          <span
                            key={idx}
                            className={`inline-block w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                              bp.intensityLevel <= 3
                                ? 'bg-pain-low text-gray-900'
                                : bp.intensityLevel <= 6
                                  ? 'bg-pain-medium'
                                  : 'bg-pain-high'
                            }`}
                          >
                            {bp.intensityLevel}
                          </span>
                        ))}
                      {Object.keys(entry.bodyPartEntries).length > 3 && (
                        <span className="text-gray-500 text-xs font-bold ml-1">
                          +{Object.keys(entry.bodyPartEntries).length - 3}
                        </span>
                      )}
                    </div>

                    <svg
                      className={`w-6 h-6 text-gray-400 transition transform ${
                        expandedDate === entry.date ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                {expandedDate === entry.date && (
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="space-y-3 mb-4">
                      {Object.entries(entry.bodyPartEntries).map(
                        ([bodyPartId, bp]) => {
                          const bodyPart =
                            bodyPartCatalog.parts[bodyPartId];
                          const getColor = () => {
                            if (bp.intensityLevel <= 3)
                              return 'bg-pain-low text-gray-900';
                            if (bp.intensityLevel <= 6)
                              return 'bg-pain-medium text-white';
                            return 'bg-pain-high text-white';
                          };

                          return (
                            <div
                              key={bodyPartId}
                              className={`flex items-center justify-between p-3 rounded border ${getColor()}`}
                            >
                              <div className="flex-1">
                                <p className="font-semibold">
                                  {bodyPart?.anatomicalName}
                                </p>
                                <p className="text-sm opacity-75">
                                  Intensidad: {bp.intensityLevel}/10
                                </p>
                                {bp.painType && bp.painType !== 'unknown' && (
                                  <p className="text-sm opacity-75">
                                    Tipo: {PainTypeLabels[bp.painType]}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-1 ml-2">
                                <button
                                  onClick={() =>
                                    handleEdit(entry.date, bodyPartId)
                                  }
                                  className="text-sm opacity-75 hover:opacity-100 font-semibold px-2 py-1"
                                  aria-label={`Edit ${bodyPart?.anatomicalName}`}
                                  title="Editar"
                                >
                                  ✎
                                </button>
                                <button
                                  onClick={() =>
                                    handleDelete(entry.date, bodyPartId)
                                  }
                                  className="text-sm opacity-75 hover:opacity-100 font-semibold"
                                  aria-label={`Delete ${bodyPart?.anatomicalName}`}
                                  title="Eliminar"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteDay(entry.date)}
                        className="flex-1 px-4 py-2 text-red-700 bg-red-50 rounded hover:bg-red-100 transition font-semibold text-sm"
                      >
                        Eliminar Todo para Este Día
                      </button>
                    </div>

                    {editingEntry && editingEntry.date === entry.date && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <PainEntryEditor
                          bodyPartId={editingEntry.bodyPartId}
                          initialIntensity={
                            entry.bodyPartEntries[editingEntry.bodyPartId]
                              ?.intensityLevel || 5
                          }
                          initialPainType={
                            (entry.bodyPartEntries[editingEntry.bodyPartId]
                              ?.painType as PainTypeCode) || 'unknown'
                          }
                          onSave={handleSaveEdit}
                          onCancel={() => setEditingEntry(null)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation Links */}
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Registrar Dolor
          </Link>
          <Link
            href="/statistics"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            Ver Estadísticas
          </Link>
        </div>
      </div>
    </main>
  );
}
