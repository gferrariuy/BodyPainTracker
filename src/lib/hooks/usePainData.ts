'use client';

import { useState, useEffect, useCallback } from 'react';
import { PainEntry } from '../data-models';
import {
  loadPainTrackerData,
  addPainEntry,
  updatePainLevel,
  deletePainLevelFromDate,
  savePainTrackerData,
} from '../storage';
import { getTodayString } from '../dates';
import {
  isMigrationNeeded,
  migrateAllLegacyEntries,
  createMigrationBackup,
  getMigrationSummary,
} from '../migrate-pain-data';

export function usePainData() {
  const [entries, setEntries] = useState<Record<string, PainEntry>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [migrationStatus, setMigrationStatus] = useState<'pending' | 'needs-migration' | 'migrated' | 'no-migration' | 'error'>('pending');
  const [migrationSummary, setMigrationSummary] = useState<any | null>(null);

  // Load data on mount and detect if migration is needed (do NOT auto-migrate)
  useEffect(() => {
    try {
      const data = loadPainTrackerData();

      // Compute migration summary and set status if legacy data present
      if (isMigrationNeeded(data)) {
        try {
          const summary = getMigrationSummary(data);
          setMigrationSummary(summary);
        } catch (e) {
          console.warn('Failed to compute migration summary', e);
        }

        // Do NOT perform migration automatically; mark as needs-migration
        setMigrationStatus('needs-migration');
      } else {
        setMigrationStatus('no-migration');
      }

      setEntries(data);
    } catch (err) {
      setError('Failed to load pain data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Manual migration trigger: call this when user chooses to migrate
  const performMigration = useCallback(() => {
    try {
      const current = loadPainTrackerData();

      // Create backup before migration
      const backupJson = createMigrationBackup(current);
      sessionStorage.setItem('painDataBackup', backupJson);

      const { migratedEntries, migrationType, stats } = migrateAllLegacyEntries(current);
      console.log(`✅ Migration complete: ${migrationType}`, stats);

      // Save migrated data back to localStorage and update state
      savePainTrackerData(migratedEntries);
      setEntries(migratedEntries);
      setMigrationStatus(migrationType === 'no-migration' ? 'no-migration' : 'migrated');
    } catch (migrationError) {
      console.error('❌ Migration error:', migrationError);
      setMigrationStatus('error');
      setError(`Migration failed: ${migrationError instanceof Error ? migrationError.message : 'Unknown error'}`);
    }
  }, []);

  const recordPain = useCallback(
    (bodyPartId: string, intensityLevel: number, painType?: string) => {
      try {
        const entry = addPainEntry(bodyPartId, intensityLevel, painType);
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
    (date: string, bodyPartId: string, intensityLevel: number, painType?: string) => {
      try {
        const entry = updatePainLevel(date, bodyPartId, intensityLevel, painType);
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
    migrationStatus,
    migrationSummary,
    performMigration,
    recordPain,
    updatePain,
    removePain,
    getTodayEntry,
    getEntryByDate,
    getAllEntries,
    clearError: () => setError(null),
    acknowledgeMigration: () => setMigrationStatus('no-migration'),
  };
}
