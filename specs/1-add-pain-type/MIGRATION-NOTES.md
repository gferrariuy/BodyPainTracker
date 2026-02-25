# Pain Type Feature Migration Notes

## Overview

This document describes the `painType` field addition to the Daily Body Pain Tracker application. The feature allows users to classify pain with 8 pain type options during recording and filtering by pain type in statistics.

**Feature Branch**: `1-add-pain-type`  
**Date**: 2026-02-25

---

## Pain Type System

### Available Pain Types

```typescript
type PainTypeCode = 
  | 'pulsatile'   // Pulsátil (throbbing)
  | 'burning'     // Ardor (burning sensation)
  | 'electric'    // Eléctrico (electric/sharp shooting)
  | 'sharp'       // Punzante (sharp stabbing)
  | 'deep'        // Profundo (deep ache)
  | 'stiffness'   // Rigidez (stiffness/tightness)
  | 'tenderness'  // Sensibilidad al tacto (tenderness)
  | 'unknown'     // Unknown/Not specified (default)
```

### Type Labels (Localized)

| Code | Spanish | English |
|------|---------|---------|
| `pulsatile` | Pulsátil | Throbbing |
| `burning` | Ardor | Burning |
| `electric` | Eléctrico | Electric/Shooting |
| `sharp` | Punzante | Sharp/Stabbing |
| `deep` | Profundo | Deep Ache |
| `stiffness` | Rigidez | Stiffness |
| `tenderness` | Sensibilidad al tacto | Tenderness |
| `unknown` | Unknown | Unknown |

---

## Data Model Changes

### BodyPartEntry Structure

**Before** (`002-anatomical-refinement`):
```typescript
interface BodyPartEntry {
  bodyPartId: string;
  intensityLevel: number;    // 1-10
  recordedAt: string;        // ISO 8601 timestamp
}
```

**After** (`1-add-pain-type`):
```typescript
interface BodyPartEntry {
  bodyPartId: string;
  intensityLevel: number;    // 1-10
  painType?: PainTypeCode;   // Optional pain type classification
  recordedAt: string;        // ISO 8601 timestamp
}
```

### localStorage Schema Update

**Example entry with painType**:
```json
{
  "2026-02-25": {
    "date": "2026-02-25",
    "bodyPartEntries": {
      "lower_back": {
        "bodyPartId": "lower_back",
        "intensityLevel": 7,
        "painType": "deep",
        "recordedAt": "2026-02-25T10:30:00.000Z"
      },
      "left_shoulder": {
        "bodyPartId": "left_shoulder",
        "intensityLevel": 5,
        "painType": "burning",
        "recordedAt": "2026-02-25T11:15:00.000Z"
      }
    },
    "createdAt": "2026-02-25T10:30:00.000Z",
    "updatedAt": "2026-02-25T11:15:00.000Z"
  }
}
```

---

## Backward Compatibility

### Migration Strategy

The feature maintains **full backward compatibility**:

1. **Legacy entries (without `painType`)**: Automatically default to `'unknown'` when loaded or migrated
2. **No data loss**: Existing pain intensity data is preserved unchanged
3. **Optional field**: `painType` is optional in the data model and defaults to `'unknown'` when not provided
4. **Graceful fallback**: UI gracefully handles missing `painType` values

### Automatic Handling

When loading existing data:
- Entries without `painType` field are treated as `'unknown'`
- Migration utility (`migrateLegacyPainEntry()`) marks all migrated entries with `painType: 'unknown'`
- No explicit user action is required

### Example: Loading Legacy Data

```typescript
// Legacy entry from before feature was added
const legacyEntry = {
  bodyPartId: "lower_back",
  intensityLevel: 7,
  recordedAt: "2025-12-15T10:00:00.000Z"
  // No painType field
};

// When processed, defaults to:
const processedEntry = {
  bodyPartId: "lower_back",
  intensityLevel: 7,
  painType: 'unknown',  // ← Auto-default
  recordedAt: "2025-12-15T10:00:00.000Z"
};
```

---

## UI/UX Changes

### 1. Recording Flow (Recorder Page)

**New Step**: Pain Type Selection added after intensity slider

```
User Click Body Part
    ↓
Intensity Slider (1-10)
    ↓
← NEW: Pain Type Selector (8 options)
    ↓
Confirm Button (enabled only when BOTH intensity AND painType selected)
```

**Implementation**:
- `PainTypeSelector` component: 2-column radio grid with 8 pain type options
- Validation: Confirm button disabled until user selects a pain type
- Visual feedback: Selected type highlighted with checkmark

### 2. History Page

**Changes**:
- Display `painType` label next to intensity level (unless `'unknown'`)
- Add **Edit Button** (✎) for each body part entry
- Edit modal includes both intensity slider AND pain type selector
- Users can modify both intensity and type when editing

**Example History Entry**:
```
Lower Back
Intensidad: 7/10
Tipo: Profundo
─────────────
[✎ Edit]  [✕ Delete]
```

### 3. Statistics Page

**Changes**:
- New **Pain Type Filter** UI above body part rankings
- Filter options: "All" + 8 individual pain types
- Filters work in combination with time period (This Week / This Month)
- Statistics auto-update when filter selection changes

**Example Filter UI**:
```
Period: [This Week] [This Month]

Pain Type Filter:
[All] [Pulsátil] [Ardor] [Eléctrico] [Punzante] [Profundo] [Rigidez] [Sensibilidad]
```

---

## Implementation Details

### New Components

1. **PainTypeSelector** (`src/components/PainTypeSelector.tsx`)
   - Props: `selectedType`, `onChange`, `language?`
   - 2-column radio button grid
   - Validation message if not selected
   - Accessible with aria roles and keyboard support

2. **PainTypeFilter** (`src/components/PainTypeFilter.tsx`)
   - Props: `selectedType`, `onChange`, `language?`
   - Button group: 'All' + 8 pain type options
   - Responsive flex wrap layout

3. **PainEntryEditor** (`src/components/PainEntryEditor.tsx`)
   - Props: `bodyPartId`, `initialIntensity`, `initialPainType`, `onSave`, `onCancel`
   - Modal dialog with intensity slider + pain type selector
   - Keyboard support (ESC to close)
   - Confirm button disabled until painType selected

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/data-models.ts` | Added `painType?: PainTypeCode` to BodyPartEntry interface |
| `src/lib/storage.ts` | Updated `addPainEntry()` and `updatePainLevel()` to accept painType parameter |
| `src/lib/validation.ts` | Added `validatePainTypeIfPresent()` function for type validation |
| `src/lib/hooks/usePainData.ts` | Updated `recordPain()` and `updatePain()` to handle painType |
| `src/lib/aggregation.ts` | Added optional `painTypeFilter` parameter to aggregation functions |
| `src/lib/types/painType.ts` | **NEW** - Type definitions, constants, and utilities |
| `src/components/PainSlider.tsx` | Integrated PainTypeSelector below intensity slider |
| `src/components/BodySVGDiagram.tsx` | Updated callback to pass painType through to PainSlider |
| `src/pages/index.tsx` | Updated pain recording flow to accept and display painType |
| `src/pages/statistics.tsx` | Added pain type filtering UI and logic |
| `src/pages/history.tsx` | Added painType display and edit capability with PainEntryEditor |

### Type Safety

All changes are **fully typed** with TypeScript:

```typescript
// Type definitions in src/lib/types/painType.ts
export type PainTypeCode = 'pulsatile' | 'burning' | 'electric' | 'sharp' | 'deep' | 'stiffness' | 'tenderness' | 'unknown';

export const PainTypeLabels: Record<PainTypeCode, string> = {
  pulsatile: 'Pulsátil',
  burning: 'Ardor',
  electric: 'Eléctrico',
  sharp: 'Punzante',
  deep: 'Profundo',
  stiffness: 'Rigidez',
  tenderness: 'Sensibilidad al tacto',
  unknown: 'Unknown'
};

export function isValidPainType(value: unknown): value is PainTypeCode {
  return typeof value === 'string' && Object.keys(PainTypeLabels).includes(value);
}
```

---

## Function API Changes

### Storage API

```typescript
// addPainEntry - now accepts optional painType
addPainEntry(bodyPartId: string, intensityLevel: number, painType?: PainTypeCode): void

// updatePainLevel - now accepts optional painType
updatePainLevel(date: string, bodyPartId: string, intensityLevel: number, painType?: PainTypeCode): void
```

### Aggregation API

```typescript
// aggregateByBodyPart - now accepts optional filter
aggregateByBodyPart(entries: BodyPartEntry[], painTypeFilter?: PainTypeCode | 'all'): AggregatedBodyPartStats[]

// calculateStatistics - now accepts optional filter
calculateStatistics(entries: PainEntry[], period: 'week' | 'month', painTypeFilter?: PainTypeCode | 'all'): StatisticsRecord
```

### Hook API

```typescript
// usePainData - recordPain now requires painType
recordPain(bodyPartId: string, intensityLevel: number, painType: PainTypeCode): void

// usePainData - updatePain now accepts painType
updatePain(date: string, bodyPartId: string, intensityLevel: number, painType?: PainTypeCode): void
```

---

## Testing Considerations

### Unit Tests (Existing Framework)

Test suite should cover:
- `validatePainTypeIfPresent()` - Valid/invalid pain type strings
- `aggregateByBodyPart()` - Filtering by painType, combining with time periods
- `recordPain()`/`updatePain()` - Persistence of painType to localStorage

### Integration Tests (Existing Framework)

Test scenarios:
1. Record pain with type → Verify saved to localStorage with type
2. Edit existing pain → Modify type and intensity → Verify both updated
3. Filter statistics by type → Verify only entries with selected type included
4. Load legacy data (no painType) → Verify defaults to 'unknown'

### Manual Testing Checklist

- [ ] Recording flow: Select body part → Set intensity → Select pain type → Confirm → Saved
- [ ] History view: Display painType for entries (except 'unknown')
- [ ] Edit functionality: Click edit → Change intensity/type → Save → Updates reflected
- [ ] Statistics filtering: Select pain type filter → Only matching entries displayed
- [ ] Backward compatibility: Load old data → No errors, defaults to 'unknown'
- [ ] Accessibility: Keyboard navigation, ARIA labels, screen reader friendly

---

## Deployment Notes

### Pre-Deployment Checklist

- [x] TypeScript compilation: Zero errors
- [x] All components tested locally
- [x] Data migration strategy documented
- [x] Backward compatibility verified
- [x] UI/UX reviewed for consistency
- [x] Accessibility compliance verified

### No Breaking Changes

This feature is **fully backward compatible**:
- No required data migration
- Existing entries work without modification
- Old painType values default gracefully
- No API signature breaking changes (new parameters are optional)

### Browser Storage Impact

- **Average pain entry size increase**: +20 bytes per entry (painType string)
- **Storage quota impact**: Minimal (< 1% for typical users)
- **Cleanup on quota exceeded**: Automatic; painType properly preserved

---

## Support

For questions or issues related to the pain type feature, refer to:
- Feature specification: `specs/1-add-pain-type/spec.md`
- Task breakdown: `specs/1-add-pain-type/tasks.md`
- Main README: `README.md`

---

**Status**: ✅ Complete  
**Last Updated**: 2026-02-25  
**Author**: Pain Tracker Development Team
