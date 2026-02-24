import { BodyPartEntry, PainEntry } from './data-models';
import { bodyPartCatalog } from './body-parts';

/**
 * Validation utilities for pain tracker
 */

export function isValidBodyPartId(id: string): boolean {
  return id in bodyPartCatalog.parts;
}

export function isValidIntensityLevel(level: number): boolean {
  return Number.isInteger(level) && level >= 1 && level <= 10;
}

export function isValidISO8601(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    return false;
  }

  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

export function validateBodyPartEntry(entry: BodyPartEntry): boolean {
  return (
    isValidBodyPartId(entry.bodyPartId) &&
    isValidIntensityLevel(entry.intensityLevel)
  );
}

export function validatePainEntry(entry: PainEntry): boolean {
  if (!isValidISO8601(entry.date)) {
    return false;
  }

  return Object.values(entry.bodyPartEntries).every(validateBodyPartEntry);
}
