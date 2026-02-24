'use client';

import { useState, useEffect, useCallback } from 'react';
import { PainEntry } from '../data-models';
import {
  loadPainTrackerData,
  addPainEntry,
  updatePainLevel,
  deletePainLevelFromDate,
} from '../storage';
import { getTodayString } from '../dates';

export function usePainData() {
  const [entries, setEntries] = useState<Record<string, PainEntry>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    try {
      const data = loadPainTrackerData();
      setEntries(data);
    } catch (err) {
      setError('Failed to load pain data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordPain = useCallback(
    (bodyPartId: string, intensityLevel: number) => {
      try {
        const entry = addPainEntry(bodyPartId, intensityLevel);
        setEntries((prev) => ({
          ...prev,
          [entry.date]: entry,
        }));
        return entry;
      } catch (err) {
        const message = `Failed to record pain: ${err instanceof Error ? err.message : 'Unknown error'}`;
        setError(message);
        throw err;
      }
    },
    []
  );

  const updatePain = useCallback(
    (date: string, bodyPartId: string, intensityLevel: number) => {
      try {
        const entry = updatePainLevel(date, bodyPartId, intensityLevel);
        setEntries((prev) => ({
          ...prev,
          [date]: entry,
        }));
        return entry;
      } catch (err) {
        const message = `Failed to update pain: ${err instanceof Error ? err.message : 'Unknown error'}`;
        setError(message);
        throw err;
      }
    },
    []
  );

  const removePain = useCallback((date: string, bodyPartId: string) => {
    try {
      deletePainLevelFromDate(date, bodyPartId);
      setEntries((prev) => {
        const newEntries = { ...prev };
        if (newEntries[date]) {
          delete newEntries[date].bodyPartEntries[bodyPartId];
          if (Object.keys(newEntries[date].bodyPartEntries).length === 0) {
            delete newEntries[date];
          } else {
            newEntries[date].updatedAt = new Date().toISOString();
          }
        }
        return newEntries;
      });
    } catch (err) {
      const message = `Failed to remove pain: ${err instanceof Error ? err.message : 'Unknown error'}`;
      setError(message);
      throw err;
    }
  }, []);

  const getTodayEntry = useCallback((): PainEntry | null => {
    return entries[getTodayString()] || null;
  }, [entries]);

  const getEntryByDate = useCallback(
    (date: string): PainEntry | null => {
      return entries[date] || null;
    },
    [entries]
  );

  const getAllEntries = useCallback((): PainEntry[] => {
    return Object.values(entries).sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [entries]);

  return {
    entries,
    loading,
    error,
    recordPain,
    updatePain,
    removePain,
    getTodayEntry,
    getEntryByDate,
    getAllEntries,
    clearError: () => setError(null),
  };
}
