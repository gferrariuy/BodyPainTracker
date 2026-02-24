import {
  PainEntry,
  BodyPartEntry,
} from './data-models';
import { getTodayString } from './dates';
import { validatePainEntry, validateBodyPartEntry } from './validation';

const STORAGE_KEY = 'painTracker';

/**
 * Storage operations for pain entries
 */

export function loadPainTrackerData(): Record<string, PainEntry> {
  try {
    if (typeof window === 'undefined') {
      return {};
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {};
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load pain tracker data:', error);
    return {};
  }
}

export function savePainTrackerData(entries: Record<string, PainEntry>): void {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    const jsonString = JSON.stringify(entries);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      // QuotaExceededError
      handleQuotaExceeded(entries);
    } else {
      console.error('Failed to save pain tracker data:', error);
    }
  }
}

function handleQuotaExceeded(entries: Record<string, PainEntry>): void {
  // Delete oldest month of data
  const sortedDates = Object.keys(entries).sort();
  let itemsToDelete = 0;
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

  for (const date of sortedDates) {
    if (date < oneMonthAgoStr) {
      delete entries[date];
      itemsToDelete++;
    }
  }

  if (itemsToDelete > 0) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      console.log(
        `Automatically deleted ${itemsToDelete} old entries to free up storage.`
      );
    } catch (error) {
      console.error('Failed to save after cleanup:', error);
    }
  }
}

export function addPainEntry(
  bodyPartId: string,
  intensityLevel: number
): PainEntry {
  const entries = loadPainTrackerData();
  const today = getTodayString();

  if (!entries[today]) {
    entries[today] = {
      date: today,
      bodyPartEntries: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const bodyPartEntry: BodyPartEntry = {
    bodyPartId,
    intensityLevel,
    recordedAt: new Date().toISOString(),
  };

  entries[today].bodyPartEntries[bodyPartId] = bodyPartEntry;
  entries[today].updatedAt = new Date().toISOString();

  if (!validatePainEntry(entries[today])) {
    throw new Error(`Invalid pain entry for ${bodyPartId}`);
  }

  savePainTrackerData(entries);
  return entries[today];
}

export function updatePainLevel(
  date: string,
  bodyPartId: string,
  intensityLevel: number
): PainEntry {
  const entries = loadPainTrackerData();

  if (!entries[date]) {
    throw new Error(`No entry found for date ${date}`);
  }

  const bodyPartEntry: BodyPartEntry = {
    bodyPartId,
    intensityLevel,
    recordedAt: new Date().toISOString(),
  };

  if (!validateBodyPartEntry(bodyPartEntry)) {
    throw new Error(`Invalid body part entry`);
  }

  entries[date].bodyPartEntries[bodyPartId] = bodyPartEntry;
  entries[date].updatedAt = new Date().toISOString();

  savePainTrackerData(entries);
  return entries[date];
}

export function deletePainEntry(date: string): void {
  const entries = loadPainTrackerData();
  delete entries[date];
  savePainTrackerData(entries);
}

export function getPainEntryByDate(date: string): PainEntry | null {
  const entries = loadPainTrackerData();
  return entries[date] || null;
}

export function getAllPainEntries(): PainEntry[] {
  const entries = loadPainTrackerData();
  return Object.values(entries).sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function deletePainLevelFromDate(
  date: string,
  bodyPartId: string
): PainEntry {
  const entries = loadPainTrackerData();

  if (!entries[date]) {
    throw new Error(`No entry found for date ${date}`);
  }

  delete entries[date].bodyPartEntries[bodyPartId];
  entries[date].updatedAt = new Date().toISOString();

  // If no body parts left, delete the entire day's entry
  if (Object.keys(entries[date].bodyPartEntries).length === 0) {
    delete entries[date];
  }

  savePainTrackerData(entries);
  return entries[date] || { date, bodyPartEntries: {}, createdAt: '', updatedAt: '' };
}
