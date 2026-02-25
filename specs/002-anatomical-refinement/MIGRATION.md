# Migration Plan - 30 Region → 60 Region System

**Feature**: Anatomical Refinement - Body Parts Granularity  
**Created**: 2026-02-25  
**Status**: Planning Phase  

## Overview

This document outlines the strategy for migrating from the legacy 30-region body parts system to the new 60-region hierarchical system (15 regions × 2 sides × 2 subdivisions).

## Current System (Legacy - 30 Regions)

The existing application uses a flat 30-region catalog with structure:
- Region ID: `{location}_{side}_{bodypart}` (e.g., `left_bicep`, `right_knee`)
- Each ID maps to one `BodyPart` object
- Data stored in localStorage as `Record<string, PainEntry>`
- Single level of granularity per region

**Examples of legacy IDs:**
```
left_bicep, right_bicep
left_deltoid, right_deltoid
left_forearm, right_forearm
left_knee, right_knee
... (30 total)
```

## New System (60 Regions - 3-Level Hierarchy)

The new system uses a hierarchical 3-level structure:
- **Level 1**: Primary region (15 total: Neck, Shoulder, Arm, Forearm, Hand, Dorsal, Lumbar, Sacroiliac, Gluteal, Groin, Thigh, Knee, Shin/Calf, Ankle, Foot)
- **Level 2**: Side (Left, Right)
- **Level 3**: Subdivision (2 options per side, anatomically specific)

**New ID format**: `{primaryRegion}_{side}_{subdivision}`
```
neck_left_anterior, neck_left_posterior, neck_right_anterior, neck_right_posterior
shoulder_left_superior, shoulder_left_inferior, shoulder_right_superior, shoulder_right_inferior
... (60 total)
```

## Migration Strategy

### Phase 1: Automatic Migration on First Load

When a user with legacy data opens the app after the update:

1. **Detection**: App checks localStorage for legacy format
   - If `bodyPartCatalog` version < 2.0, mark as legacy
   - If `painEntries` contain legacy IDs, mark for migration

2. **Auto-Mapping**: Legacy IDs map to new 60-region IDs
   - Legacy `left_bicep` (arm in old system) → `arm_left_proximal`
   - Legacy `left_deltoid` → `shoulder_left_superior`
   - Legacy `right_tricep` → Used to map to back-view arm, now inconsistent structure

3. **Data Preservation**:
   - All dates preserved
   - All intensity values preserved
   - Migration timestamp recorded
   - Old data flagged with `_migrated: true` metadata

### Phase 2: Migration Mapping (Detailed)

**Mapping from 30-region to 60-region:**

| Legacy ID | Legacy Name | New Primary Region | New Subdivision | New IDs |
|-----------|-------------|-------|-----------|---------|
| head | Head | N/A | N/A | (removed - not subdivided) |
| neck | Neck | Neck | Anterior, Posterior | `neck_left_anterior`, `neck_left_posterior`, `neck_right_anterior`, `neck_right_posterior` |
| left_shoulder | Left Shoulder | Shoulder | Superior, Inferior | `shoulder_left_superior`, `shoulder_left_inferior` |
| right_shoulder | Right Shoulder | Shoulder | Superior, Inferior | `shoulder_right_superior`, `shoulder_right_inferior` |
| left_deltoid | Left Deltoid | Shoulder | Superior, Inferior | `shoulder_left_superior`, `shoulder_left_inferior` |
| right_deltoid | Right Deltoid | Shoulder | Superior, Inferior | `shoulder_right_superior`, `shoulder_right_inferior` |
| left_bicep | Left Bicep | Arm | Proximal, Distal | `arm_left_proximal`, `arm_left_distal` |
| right_bicep | Right Bicep | Arm | Proximal, Distal | `arm_right_proximal`, `arm_right_distal` |
| left_tricep | Left Tricep | Arm | Proximal, Distal | `arm_left_proximal`, `arm_left_distal` |
| right_tricep | Right Tricep | Arm | Proximal, Distal | `arm_right_proximal`, `arm_right_distal` |
| left_forearm | Left Forearm | Forearm | Anterolateral, Posterolateral | `forearm_left_anterolateral`, `forearm_left_posterolateral` |
| right_forearm | Right Forearm | Forearm | Anterolateral, Posterolateral | `forearm_right_anterolateral`, `forearm_right_posterolateral` |
| left_hand | Left Hand | Hand | Palma, Dorso | `hand_left_palma`, `hand_left_dorso` |
| right_hand | Right Hand | Hand | Palma, Dorso | `hand_right_palma`, `hand_right_dorso` |
| chest | Chest | (removed - generic term, no mapping) | N/A | (removed) |
| abdomen | Abdomen | (removed - generic term, no mapping) | N/A | (removed) |
| left_breast | Left Breast | (removed - not applicable) | N/A | (removed) |
| right_breast | Right Breast | (removed - not applicable) | N/A | (removed) |
| upper_back | Upper Back | Dorsal | Superior, Inferior | `dorsal_left_superior`, `dorsal_left_inferior`, `dorsal_right_superior`, `dorsal_right_inferior` |
| mid_back | Mid Back | Dorsal | Superior, Inferior | `dorsal_left_superior`, `dorsal_left_inferior`, `dorsal_right_superior`, `dorsal_right_inferior` |
| lower_back | Lower Back | Lumbar | Superior, Inferior | `lumbar_left_superior`, `lumbar_left_inferior`, `lumbar_right_superior`, `lumbar_right_inferior` |
| left_glute | Left Gluteal | Gluteal | Superior, Inferior | `gluteal_left_superior`, `gluteal_left_inferior` |
| right_glute | Right Gluteal | Gluteal | Superior, Inferior | `gluteal_right_superior`, `gluteal_right_inferior` |
| left_thigh | Left Thigh | Thigh | Anterior, Posterior | `thigh_left_anterior`, `thigh_left_posterior` |
| right_thigh | Right Thigh | Thigh | Anterior, Posterior | `thigh_right_anterior`, `thigh_right_posterior` |
| left_knee | Left Knee | Knee | Lateral, Medial | `knee_left_lateral`, `knee_left_medial` |
| right_knee | Right Knee | Knee | Lateral, Medial | `knee_right_lateral`, `knee_right_medial` |
| left_shin | Left Shin | Shin/Calf | Anterior, Posterior | `shin_left_anterior`, `shin_left_posterior` |
| right_shin | Right Shin | Shin/Calf | Anterior, Posterior | `shin_right_anterior`, `shin_right_posterior` |
| left_foot | Left Foot | Foot | Dorso, Planta | `foot_left_dorso`, `foot_left_planta` |
| right_foot | Right Foot | Foot | Dorso, Planta | `foot_right_dorso`, `foot_right_planta` |

**Note**: Some legacy regions (chest, abdomen, head, breast) don't map directly to new system - these entries will be preserved with migration notes.

## Backward Compatibility Implementation

### Multi-Format Support

The `usePainData` hook will support both formats during transition:

```typescript
// Legacy format detection
const isLegacyFormat = (painEntry) => {
  return painEntry.bodyPartEntries && 
         Object.keys(painEntry.bodyPartEntries).some(id => 
           id.match(/^(left|right)_/)  // Old format: left_bicep, right_knee
         );
};

// Auto-migration trigger
useEffect(() => {
  if (detectLegacyFormat()) {
    migrateToNewFormat();
    showMigrationNotification();
  }
}, []);
```

### Migration Execution

1. Read all `painEntries` from localStorage
2. For each entry:
   - Check if format is legacy (30-region)
   - If yes: transform bodyPartEntries using mapping table
   - Preserve date, intensity values
   - Add `_migrated: true` and `_migratedDate: timestamp` metadata
3. Write migrated data back to localStorage
4. Log migration stats (entries migrated, regions affected)

## Fallback & Rollback

### Fallback Options

If migration fails:
1. **Skip Migration**: App continues with legacy format (read-only warning)
2. **Clear & Start Fresh**: User can opt to clear old data and start fresh with new 60-region system
3. **Export Old Data**: Option to export legacy data as JSON before clearing

### Rollback Plan

If critical issues found post-migration:
1. Provide backup restore from localStorage history (if available)
2. Keep old `body-parts.ts` as `body-parts-legacy.ts` for reference
3. Document manual rollback process in README

## Data Loss Assessment

**Regions with no direct mapping** (will be preserved as-is or require user input):
- `head` - Not subdivided in new system; data preserved as metadata
- `chest`, `abdomen` - Generic terms; map to dorsal/lumbar with user confirmation
- `left_breast`, `right_breast` - Removed from anatomical catalog; preserved in history with note

**Risk Level**: LOW
- All dates preserved
- All intensity data preserved  
- Users can review migrated data in History view
- No automatic data deletion

## Testing Strategy

### Migration Test Cases

1. **No Legacy Data**
   - User with fresh install (no localStorage)
   - Expected: App starts normally with new 60-region system

2. **Complete Legacy Dataset**
   - User with full month of legacy pain entries (30+ entries across multiple regions)
   - Expected: All data migrated, counts match, no loss

3. **Partial/Corrupted Data**
   - User with some malformed entries or incomplete data
   - Expected: Valid entries migrate, invalid ones flagged with error, app remains stable

4. **Large Dataset**
   - User with 6+ months of legacy data (1000+ entries)
   - Expected: Migration completes in <2 seconds, app remains responsive

5. **Edge Cases**
   - Legacy entries with duplicate region entries on same day
   - Entries with invalid intensity values (0, 11, null)
   - Mixed old/new format data somehow present

### Post-Migration Verification

1. **Data Integrity**
   - Count legacy entries before migration
   - Count new entries after migration
   - Verify exact match
   - Spot-check random entries for value preservation

2. **Functionality**
   - Can record new pain entries with new 60-region system
   - Statistics page shows migrated data in top 10
   - History displays migrated entries correctly
   - Both front/back views work with migrated data

3. **Performance**
   - App startup time: <2 seconds with migrated data
   - Statistics calculation: <500ms even with large datasets
   - No memory leaks or infinite loops

## Documentation for Users

### In-App Notification

```
🔄 Data Update Detected

Your pain tracking data has been automatically upgraded to our new 
high-precision anatomical system (60 regions instead of 30). All your 
previous entries have been preserved and are now available with more 
detailed tracking.

View your migrated data in the History tab.

[Dismiss] [Learn More]
```

### Migration Status Indicator

In History page, migrated entries show:
```
🔄 Migrated from previous system
Hombro Izquierdo (was: Left Shoulder) - Nivel 6
```

## Timeline

- **T001**: Create this migration plan document ✓
- **T002**: Design 60-region ID schema document
- **T003**: Create backward compatibility mapping script
- **T004**: Document subdivision naming conventions
- **T008**: Implement migration utilities in `migrate-pain-data.ts`
- **T009**: Integrate migration into `usePainData` hook
- **T024**: Complete migration testing

## Success Criteria

✅ All legacy data preserved with exact date/intensity values  
✅ Auto-migration on first load without user intervention  
✅ Zero data loss across test scenarios  
✅ Migration completes in <2 seconds even with large datasets  
✅ Post-migration, all app features work with new 60-region system  
✅ Users notified of change with clear in-app message  
✅ Fallback options available if issues detected  

