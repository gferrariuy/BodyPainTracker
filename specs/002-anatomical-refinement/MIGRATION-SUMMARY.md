---
title: "Data Migration Guide: 30-Region to 60-Region Anatomical System"
description: "Complete guide for migrating pain tracker data from legacy 30-region system to new 60-region hierarchical system"
---

# Data Migration Guide

## Overview

The **Daily Body Pain Tracker** has been upgraded from a 30-region anatomical system to a **60-region system** with hierarchical precision. This means each of the 15 primary body regions is now divided into 2 subdivisions, enabling more granular pain tracking.

### Key Changes

| Aspect | Legacy (30-Region) | New (60-Region) |
|--------|------------------|-----------------|
| **Total Regions** | 30 | 60 |
| **Structure** | Flat (primary regions only) | Hierarchical (15 primary × 2 sides × 2 subdivisions) |
| **Recording** | 1-click (primary region only) | 2-stage (primary → subdivision → intensity) |
| **ID Format** | `left_shoulder` | `shoulder_left_superior` |
| **Statistics** | Top 10 primary regions | Top 10 specific sub-regions |
| **Migration** | Optional, user-initiated | One-time, with backup & rollback |

---

## Migration Process

### What Gets Migrated?

- ✅ **All existing pain entries** from localStorage
- ✅ **Timestamps and metadata** preserved exactly
- ✅ **Intensity levels** distributed proportionally to subdivisions
- ✅ **Backup copy** stored in sessionStorage before migration (can be restored)

### What Stays the Same?

- ✅ Entry dates (no data loss)
- ✅ Overall pain history integrity
- ✅ Statistics calculations
- ✅ Filtering by time period (week/month)

### When Does Migration Happen?

**IMPORTANT**: Migration is **optional and manual**.

1. When you first load the app with legacy data, a notification appears:
   - "Actualización Disponible" (Update Available)
   - "Migrar Ahora" (Migrate Now) button
   - "Omitir" (Skip) button

2. **You can choose to**:
   - Click **"Migrar Ahora"** to upgrade to the 60-region system immediately
   - Click **"Omitir"** to keep using the legacy system (notification won't appear again)
   - **Never lose data** – either choice is safe

3. Once migrated:
   - Data is saved to localStorage in new 60-region format
   - A backup is stored in sessionStorage for manual recovery if needed
   - All new recordings use the 60-region system automatically

---

## Migration Mapping

The legacy regions are mapped to the new 60-region catalog as follows:

### Mapping Strategy

**For regions with 2 subdivisions**, the legacy intensity is **copied to both subdivisions**. This ensures no information is lost during migration.

Example:
- Legacy: `left_shoulder` (Intensity: 7)
- New: `shoulder_left_superior` (Intensity: 7) + `shoulder_left_inferior` (Intensity: 7)

### Complete Mapping Table

| Legacy ID | Primary Region | Side | Mapped To (60-Region) |
|-----------|---|---|---|
| left_shoulder | shoulder | left | shoulder_left_superior, shoulder_left_inferior |
| right_shoulder | shoulder | right | shoulder_right_superior, shoulder_right_inferior |
| left_bicep | arm | left | arm_left_proximal |
| right_bicep | arm | right | arm_right_proximal |
| left_forearm | forearm | left | forearm_left_anterolateral, forearm_left_posterolateral |
| right_forearm | forearm | right | forearm_right_anterolateral, forearm_right_posterolateral |
| left_hand | hand | left | hand_left_palma, hand_left_dorso |
| right_hand | hand | right | hand_right_palma, hand_right_dorso |
| left_thigh | thigh | left | thigh_left_anterior, thigh_left_posterior |
| right_thigh | thigh | right | thigh_right_anterior, thigh_right_posterior |
| left_knee | knee | left | knee_left_lateral, knee_left_medial |
| right_knee | knee | right | knee_right_lateral, knee_right_medial |
| left_shin | shin | left | shin_left_anterior, shin_left_posterior |
| right_shin | shin | right | shin_right_anterior, shin_right_posterior |
| left_foot | foot | left | foot_left_dorso, foot_left_planta |
| right_foot | foot | right | foot_right_dorso, foot_right_planta |
| left_upper_back | dorsal | left | dorsal_left_superior, dorsal_left_inferior |
| right_upper_back | dorsal | right | dorsal_right_superior, dorsal_right_inferior |
| left_lower_back | lumbar | left | lumbar_left_superior, lumbar_left_inferior |
| right_lower_back | lumbar | right | lumbar_right_superior, lumbar_right_inferior |
| left_gluteal | gluteal | left | gluteal_left_superior, gluteal_left_inferior |
| right_gluteal | gluteal | right | gluteal_right_superior, gluteal_right_inferior |
| left_groin | groin | left | groin_left_medial, groin_left_lateral |
| right_groin | groin | right | groin_right_medial, groin_right_lateral |
| (and more for neck, sacroiliac, ankle) | | | |

---

## Rollback / Recovery

If you need to recover your original legacy data:

### Option 1: Browser DevTools (SessionStorage)

1. Open the app (before closing browser)
2. Open **DevTools** (F12)
3. Go to **Application** → **Session Storage**
4. Find `painDataBackup` – copy its value
5. Go to **Local Storage** → Clear the current data
6. Manually restore old data using the backup

### Option 2: Try Again

1. Clear browser cache for the app domain
2. Reload the app
3. If migration prompt appears, click **"Omitir"** (Skip)

### Option 3: Contact Support

If you encounter any issues:
- Check the browser console (F12) for error messages
- Screenshot the error
- Report via the app's feedback mechanism

---

## Technical Details

### Migration Implementation

**File**: `src/lib/migrate-pain-data.ts`

Key functions:
- `isMigrationNeeded()` – Detects if data contains legacy region IDs
- `migrateLegacyPainEntry()` – Converts a single legacy entry to 60-region format
- `migrateAllLegacyEntries()` – Migrates entire dataset, returns summary statistics

**Process**:
1. Load data from localStorage
2. Check if any entries use legacy region IDs (e.g., `left_shoulder`)
3. If yes, set status to `needs-migration`
4. User clicks "Migrar Ahora" button
5. App creates sessionStorage backup with `createMigrationBackup()`
6. `performMigration()` function runs the migration
7. Save migrated data back to localStorage
8. Update UI to show success

### Metadata Tracking

Each migrated entry includes metadata:
```typescript
metadata: {
  systemVersion: 'refined-60',      // Indicates new system
  migratedAt: '2026-02-25T...',    // When migration occurred
}
```

This ensures the app knows which entries are legacy vs. migrated.

---

## Breaking Changes

⚠️ **Please note**:

1. **ID Format Change**: `left_shoulder` → `shoulder_left_superior`
2. **Duplicate Subdivisions**: Entries that previously had one intensity value now have two (one per subdivision)
3. **Statistics Changed**: Top 10 now rank individual sub-regions, not primary regions
4. **History Display**: Anatomical names now include subdivision detail (e.g., "Hombro Izquierdo - Superior")

### Example: Before & After

**Legacy Data**:
```json
{
  "2026-02-25": {
    "bodyPartEntries": {
      "left_shoulder": { "intensityLevel": 7 }
    }
  }
}
```

**After Migration**:
```json
{
  "2026-02-25": {
    "bodyPartEntries": {
      "shoulder_left_superior": { "intensityLevel": 7 },
      "shoulder_left_inferior": { "intensityLevel": 7 }
    },
    "metadata": {
      "systemVersion": "refined-60",
      "migratedAt": "2026-02-25T..."
    }
  }
}
```

---

## FAQ

### Q: Will I lose data if I migrate?
**A**: No. All existing entries are preserved. A backup is automatically created in sessionStorage before migration.

### Q: Can I undo the migration?
**A**: Yes. The backup in sessionStorage allows recovery (see "Rollback" section above). You can also clear localStorage and skip migration when prompted.

### Q: What happens if I don't migrate?
**A**: You can continue using the legacy 30-region system. The "Omitir" (Skip) button dismisses the notification permanently. New entries will use the current system (legacy or updated, depending on your choice).

### Q: Why are subdivisions marked with the same intensity?
**A**: The legacy system had no subdivision data. To avoid data loss, the original intensity is applied to all subdivisions of a region. You can edit individual subdivisions after migration using the History page.

### Q: Will statistics change after migration?
**A**: Yes. The Top 10 will now show individual sub-regions (e.g., "Hombro Izquierdo - Superior" vs "Hombro Izquierdo - Inferior") instead of grouped regions. This provides more granular insights.

### Q: Is there a deadline to migrate?
**A**: No. You can migrate whenever you're ready. The system supports both legacy and new data.

---

## Support & Resources

- **Specification**: See `/specs/002-anatomical-refinement/spec.md`
- **Region IDs**: See `/specs/002-anatomical-refinement/REGION-IDS-SCHEMA.md`
- **Backward Compatibility**: See `/specs/002-anatomical-refinement/BACKWARD-COMPATIBILITY.md`
- **Subdivision Names**: See `/specs/002-anatomical-refinement/SUBDIVISIONS-NAMING.md`

For technical questions, refer to the source code:
- Migration logic: `src/lib/migrate-pain-data.ts`
- Validation: `src/lib/validation.ts` (supports both 30 & 60 region IDs)
- Hook: `src/lib/hooks/usePainData.ts` (exposes `performMigration()`)

---

**Last Updated**: February 25, 2026  
**Version**: 1.0 (Initial 60-Region System)
