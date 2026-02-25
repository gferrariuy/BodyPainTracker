import { PainEntry, BodyPartEntry } from './data-models';

/**
 * Data migration utilities for converting from 30-region legacy system
 * to the new 60-region hierarchical system
 * 
 * Strategy: Automatic migration on first app load
 * All legacy region IDs automatically map to new 60-region IDs
 * Intensity levels are copied to all subdivisions for mapped regions
 */

/**
 * Complete mapping table: Legacy 30-region IDs → New 60-region IDs
 * 
 * Format: One legacy ID can map to 1-4 new IDs
 * Each legacy region's intensity is copied to all mapped subdivisions
 */
const LEGACY_TO_NEW_60_MAPPING: Record<string, string[]> = {
  // Neck (4 new IDs from 1 legacy)
  left_neck: ['neck_left_anterior', 'neck_left_posterior'],
  right_neck: ['neck_right_anterior', 'neck_right_posterior'],

  // Shoulder (8 new IDs from 4 legacy: shoulder + deltoid variants)
  left_shoulder: ['shoulder_left_superior', 'shoulder_left_inferior'],
  right_shoulder: ['shoulder_right_superior', 'shoulder_right_inferior'],
  left_deltoid: ['shoulder_left_superior'],
  right_deltoid: ['shoulder_right_superior'],

  // Arm (4 new IDs from 4 legacy: bicep and tricep variants)
  left_bicep: ['arm_left_proximal'],
  right_bicep: ['arm_right_proximal'],
  left_tricep: ['arm_left_proximal'],
  right_tricep: ['arm_right_proximal'],

  // Forearm (4 new IDs from 1 legacy)
  left_forearm: ['forearm_left_anterolateral', 'forearm_left_posterolateral'],
  right_forearm: ['forearm_right_anterolateral', 'forearm_right_posterolateral'],

  // Hand (4 new IDs from 1 legacy)
  left_hand: ['hand_left_palma', 'hand_left_dorso'],
  right_hand: ['hand_right_palma', 'hand_right_dorso'],

  // Upper Back / Dorsales (4 new IDs from 1 legacy)
  left_upper_back: ['dorsal_left_superior', 'dorsal_left_inferior'],
  right_upper_back: ['dorsal_right_superior', 'dorsal_right_inferior'],

  // Lower Back / Lumbares (4 new IDs from 1 legacy)
  left_lower_back: ['lumbar_left_superior', 'lumbar_left_inferior'],
  right_lower_back: ['lumbar_right_superior', 'lumbar_right_inferior'],

  // Sacroiliac (4 new IDs from 1 legacy)
  left_sacroiliac: ['sacroiliac_left_superior', 'sacroiliac_left_inferior'],
  right_sacroiliac: ['sacroiliac_right_superior', 'sacroiliac_right_inferior'],

  // Gluteal (4 new IDs from 1 legacy)
  left_gluteal: ['gluteal_left_superior', 'gluteal_left_inferior'],
  right_gluteal: ['gluteal_right_superior', 'gluteal_right_inferior'],

  // Groin (4 new IDs from 1 legacy)
  left_groin: ['groin_left_medial', 'groin_left_lateral'],
  right_groin: ['groin_right_medial', 'groin_right_lateral'],

  // Thigh (4 new IDs from 1 legacy)
  left_thigh: ['thigh_left_anterior', 'thigh_left_posterior'],
  right_thigh: ['thigh_right_anterior', 'thigh_right_posterior'],

  // Knee (4 new IDs from 1 legacy)
  left_knee: ['knee_left_lateral', 'knee_left_medial'],
  right_knee: ['knee_right_lateral', 'knee_right_medial'],

  // Shin / Calf (4 new IDs from 1 legacy)
  left_shin: ['shin_left_anterior', 'shin_left_posterior'],
  right_shin: ['shin_right_anterior', 'shin_right_posterior'],

  // Ankle (4 new IDs from 1 legacy)
  left_ankle: ['ankle_left_anterolateral', 'ankle_left_posterolateral'],
  right_ankle: ['ankle_right_anterolateral', 'ankle_right_posterolateral'],

  // Foot (4 new IDs from 1 legacy)
  left_foot: ['foot_left_dorso', 'foot_left_planta'],
  right_foot: ['foot_right_dorso', 'foot_right_planta'],
};

/**
 * Check if this is a legacy (30-region) pain entry
 * Detection logic: Entry uses old region ID format (legacy_{region})
 */
export function isLegacyEntry(entry: PainEntry): boolean {
  const regionIds = Object.keys(entry.bodyPartEntries);
  
  // If metadata indicates it's already migrated, it's not legacy
  if (entry.metadata?.systemVersion === 'refined-60') {
    return false;
  }
  
  // Check if any region ID is in the legacy mapping table
  return regionIds.some((id) => id in LEGACY_TO_NEW_60_MAPPING);
}

/**
 * Migrate a single legacy pain entry to 60-region format
 * 
 * Process:
 * 1. Map each legacy region ID to new 60-region IDs
 * 2. Copy intensity level to all mapped subdivisions
 * 3. Preserve timestamps and metadata
 * 4. Mark as migrated
 */
export function migrateLegacyPainEntry(entry: PainEntry): PainEntry {
  const newBodyPartEntries: Record<string, BodyPartEntry> = {};

  // Process each legacy region in the entry
  Object.entries(entry.bodyPartEntries).forEach(([legacyId, data]) => {
    const newIds = LEGACY_TO_NEW_60_MAPPING[legacyId];

    if (!newIds) {
      // Unknown legacy ID - keep original for fallback
      console.warn(`Unknown legacy region ID during migration: ${legacyId}`);
      // Store with original ID to preserve data
      newBodyPartEntries[legacyId] = data;
      return;
    }

    // Distribute intensity across all new region IDs
    newIds.forEach((newId) => {
      newBodyPartEntries[newId] = {
        bodyPartId: newId,
        intensityLevel: data.intensityLevel,
        recordedAt: data.recordedAt,
        notes: data.notes,
      };
    });
  });

  return {
    date: entry.date,
    bodyPartEntries: newBodyPartEntries,
    createdAt: entry.createdAt,
    updatedAt: new Date().toISOString(),
    metadata: {
      ...entry.metadata,
      systemVersion: 'refined-60',
      migratedAt: new Date().toISOString(),
    },
  };
}

/**
 * Migrate all legacy entries in a dataset
 * 
 * Returns: Object with migration stats
 */
export function migrateAllLegacyEntries(entries: Record<string, PainEntry>): {
  migratedEntries: Record<string, PainEntry>;
  migrationType: 'no-migration' | 'partial' | 'complete';
  stats: {
    totalEntries: number;
    migratedCount: number;
    skippedCount: number;
    errors: string[];
  };
} {
  const migratedEntries: Record<string, PainEntry> = {};
  const errors: string[] = [];
  let migratedCount = 0;
  let skippedCount = 0;

  Object.entries(entries).forEach(([dateKey, entry]) => {
    try {
      if (isLegacyEntry(entry)) {
        migratedEntries[dateKey] = migrateLegacyPainEntry(entry);
        migratedCount++;
      } else {
        migratedEntries[dateKey] = entry;
        skippedCount++;
      }
    } catch (error) {
      errors.push(
        `Error migrating entry for ${dateKey}: ${error instanceof Error ? error.message : String(error)}`
      );
      // Keep original entry on error for fallback
      migratedEntries[dateKey] = entry;
      skippedCount++;
    }
  });

  const totalEntries = Object.keys(entries).length;
  let migrationType: 'no-migration' | 'partial' | 'complete' = 'no-migration';

  if (migratedCount === 0) {
    migrationType = 'no-migration';
  } else if (migratedCount === totalEntries) {
    migrationType = 'complete';
  } else {
    migrationType = 'partial';
  }

  return {
    migratedEntries,
    migrationType,
    stats: {
      totalEntries,
      migratedCount,
      skippedCount,
      errors,
    },
  };
}

/**
 * Create a backup of entries before migration
 * For use in fallback scenarios
 */
export function createMigrationBackup(entries: Record<string, PainEntry>): string {
  return JSON.stringify(entries, null, 2);
}

/**
 * Restore entries from a backup
 */
export function restoreMigrationBackup(backupJson: string): Record<string, PainEntry> {
  try {
    return JSON.parse(backupJson);
  } catch (error) {
    console.error('Failed to restore backup:', error);
    throw new Error('Invalid backup format');
  }
}

/**
 * Check if migration is needed
 * Returns true if there are any legacy entries
 */
export function isMigrationNeeded(entries: Record<string, PainEntry>): boolean {
  return Object.values(entries).some((entry) => isLegacyEntry(entry));
}

/**
 * Get migration summary for a dataset
 */
export function getMigrationSummary(entries: Record<string, PainEntry>): {
  needsMigration: boolean;
  legacyEntryCount: number;
  modernEntryCount: number;
  totalRegions: number;
  estimatedNewRegions: number;
} {
  let legacyEntryCount = 0;
  let modernEntryCount = 0;
  let totalRegionReferences = 0;
  let estimatedNewRegions = 0;

  Object.values(entries).forEach((entry) => {
    if (isLegacyEntry(entry)) {
      legacyEntryCount++;
    } else {
      modernEntryCount++;
    }

    Object.keys(entry.bodyPartEntries).forEach((regionId) => {
      totalRegionReferences++;
      const newIds = LEGACY_TO_NEW_60_MAPPING[regionId];
      if (newIds) {
        estimatedNewRegions += newIds.length;
      } else {
        estimatedNewRegions += 1;
      }
    });
  });

  return {
    needsMigration: legacyEntryCount > 0,
    legacyEntryCount,
    modernEntryCount,
    totalRegions: totalRegionReferences,
    estimatedNewRegions,
  };
}
