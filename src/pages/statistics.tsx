'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePainData } from '../lib/hooks/usePainData';
import { calculateStatistics } from '../lib/aggregation';
import { TimePeriod } from '../lib/data-models';

export default function StatisticsPage() {
  const { entries, loading } = usePainData();
  const [period, setPeriod] = useState<TimePeriod>('week');

  const stats = useMemo(() => {
    return calculateStatistics(entries, period);
  }, [entries, period]);

  const getColorClass = (ranking: number) => {
    if (ranking === 1) return 'bg-yellow-100 border-yellow-300';
    if (ranking <= 3) return 'bg-orange-100 border-orange-300';
    return 'bg-red-100 border-red-300';
  };

  const getMedalEmoji = (ranking: number) => {
    if (ranking === 1) return '🥇';
    if (ranking === 2) return '🥈';
    if (ranking === 3) return '🥉';
    return '';
  };

  const periodLabel = period === 'week' ? 'Esta Semana' : 'Este Mes';
  const periodDays = period === 'week' ? '(Últimos 7 días)' : '(Últimos 30 días)';

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
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
            Estadísticas de Dolor
          </h1>
          <p className="text-gray-600">
            Top 10 de las áreas corporales más dolorosas por frecuencia y severidad
          </p>
        </div>

        {/* Period Filter */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setPeriod('week')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              period === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={period === 'week'}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
            aria-pressed={period === 'month'}
          >
            Este Mes
          </button>
        </div>

        {/* Stats Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {periodLabel} {periodDays}
          </h2>
        </div>

        {/* Stats List */}
        {stats.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-900 text-lg">
              Aún no hay datos de dolor registrados para {period === 'week' ? 'esta semana' : 'este mes'}.
            </p>
            <p className="text-blue-700 mt-2">
              Comienza a registrar tu dolor para ver estadísticas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat) => (
              <div
                key={stat.bodyPartId}
                className={`border-2 rounded-lg p-6 animate-fade-in ${getColorClass(
                  stat.ranking
                )}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getMedalEmoji(stat.ranking)}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        {stat.ranking}. {stat.bodyPartName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Registrado {stat.frequency} vez
                        {stat.frequency !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded p-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Intensidad Total
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.totalIntensity}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Promedio
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.averageIntensity}
                    </p>
                  </div>

                  <div className="bg-white rounded p-3">
                    <p className="text-xs font-semibold text-gray-600 uppercase">
                      Frecuencia
                    </p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {stat.frequency}x
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-600 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (stat.totalIntensity / 100) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
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
