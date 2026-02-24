# Contract: localStorage Schema

**Version**: 1.0 | **Status**: Specification | **Date**: 2026-02-24

## Overview

This document specifies the exact structure, operations, and error handling for all data persisted to browser localStorage.

## Root Structure

```json
{
  "painTrackerData": {
    "painEntries": {},
    "metadata": {}
  }
}
```

### Key: `painTrackerData`

Root namespace prevents conflicts with other localStorage keys.

---

## painEntries Object

Contains all pain recordings, keyed by date string (YYYY-MM-DD).

```json
{
  "painTrackerData": {
    "painEntries": {
      "2026-02-24": {...},
      "2026-02-23": {...},
      "2026-02-22": {...}
    }
  }
}
```

### Date Key Format

- Format: `YYYY-MM-DD` (ISO 8601 date only, no time)
- Example: `"2026-02-24"`
- Rules:
  - Must match `/^(\d{4})-(\d{2})-(\d{2})$/`
  - Cannot be future date
  - Immutable once created

### Pain Entry Structure

```typescript
{
  "2026-02-24": {
    "date": "2026-02-24",
    "bodyPartEntries": {
      "left_deltoid": {
        "bodyPartId": "left_deltoid",
        "intensityLevel": 7,
        "recordedAt": "2026-02-24T14:30:00Z"
      },
      "lower_back": {
        "bodyPartId": "lower_back",
        "intensityLevel": 5,
        "recordedAt": "2026-02-24T14:32:00Z"
      }
    },
    "createdAt": "2026-02-24T14:30:00Z",
    "updatedAt": "2026-02-24T14:32:00Z",
    "metadata": {
      "version": "1.0",
      "source": "web"
    }
  }
}
```

#### Fields

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `date` | string | ✅ | YYYY-MM-DD format, immutable, matches parent key |
| `bodyPartEntries` | object | ✅ | Map of body part ID → BodyPartEntry |
| `createdAt` | string (ISO 8601) | ✅ | Timestamp of first entry creation, immutable |
| `updatedAt` | string (ISO 8601) | ✅ | Timestamp of last modification |
| `metadata` | object | ❌ | Optional metadata object |

---

## Body Part Entry Structure

Each body part recorded for a date.

```typescript
{
  "bodyPartId": "left_deltoid",        // Unique ID from catalog
  "intensityLevel": 7,                  // Integer, 1-10
  "recordedAt": "2026-02-24T14:30:00Z" // ISO 8601 timestamp
}
```

### Invariants

- `bodyPartId` must exist in BodyPartCatalog
- `intensityLevel` must be integer between 1 and 10 (inclusive)
- One entry per body part per date (latest overwrites previous)
- Cannot have same `bodyPartId` appearing twice in one day

### Validation

```typescript
function validateBodyPartEntry(entry: any): string[] {
  const errors: string[] = [];
  
  if (!entry.bodyPartId) {
    errors.push("bodyPartId is required");
  } else if (!isValidBodyPartId(entry.bodyPartId)) {
    errors.push(`bodyPartId '${entry.bodyPartId}' not in catalog`);
  }
  
  if (entry.intensityLevel === undefined || entry.intensityLevel === null) {
    errors.push("intensityLevel is required");
  } else if (!Number.isInteger(entry.intensityLevel) || entry.intensityLevel < 1 || entry.intensityLevel > 10) {
    errors.push("intensityLevel must be integer between 1 and 10");
  }
  
  if (!isValidISO8601(entry.recordedAt)) {
    errors.push("recordedAt must be valid ISO 8601 timestamp");
  }
  
  return errors;
}
```

---

## metadata Object

Application-level metadata.

```typescript
{
  "version": "1.0",           // Schema version for migrations
  "lastUpdated": "2026-02-24T14:32:00Z",  // Latest write timestamp
  "appVersion": "1.0.0"       // App version that wrote this data
}
```

---

## CRUD Operations

### CREATE: Add Pain Entry

**Operation**: User records pain for a body part on today's date.

```typescript
function addPainEntry(
  bodyPartId: string,
  intensityLevel: number
): { success: boolean; error?: string } {
  
  // 1. Validate inputs
  const errors = validateBodyPartEntry({
    bodyPartId,
    intensityLevel,
    recordedAt: new Date().toISOString(),
  });
  if (errors.length > 0) {
    return { success: false, error: errors[0] };
  }
  
  try {
    // 2. Load current data
    const data = loadPainTrackerData();
    const today = getTodayString(); // YYYY-MM-DD
    
    // 3. Create or get today's entry
    if (!data.painEntries[today]) {
      data.painEntries[today] = {
        date: today,
        bodyPartEntries: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    
    // 4. Add or overwrite body part entry
    data.painEntries[today].bodyPartEntries[bodyPartId] = {
      bodyPartId,
      intensityLevel,
      recordedAt: new Date().toISOString(),
    };
    
    // 5. Update timestamp
    data.painEntries[today].updatedAt = new Date().toISOString();
    
    // 6. Save to localStorage
    savePainTrackerData(data);
    return { success: true };
    
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      return { success: false, error: "localStorage quota exceeded. Attempting auto-cleanup..." };
    }
    return { success: false, error: String(err) };
  }
}
```

### READ: Get Pain Entries

**Operation**: Retrieve all entries or entries for specific date.

```typescript
function getPainEntries(date?: string): Record<string, PainEntry> {
  const data = loadPainTrackerData();
  
  if (date) {
    // Get specific date
    return data.painEntries[date] ? { [date]: data.painEntries[date] } : {};
  }
  
  // Get all entries
  return data.painEntries;
}

function getTodayEntries(): PainEntry | null {
  const today = getTodayString();
  const data = loadPainTrackerData();
  return data.painEntries[today] || null;
}
```

### UPDATE: Modify Pain Level

**Operation**: Change intensity level for a body part on a specific date.

```typescript
function updatePainLevel(
  date: string,
  bodyPartId: string,
  newIntensityLevel: number
): { success: boolean; error?: string } {
  
  try {
    // 1. Validate
    if (!isValidIntensity(newIntensityLevel)) {
      return { success: false, error: "intensityLevel must be 1-10" };
    }
    if (!isValidBodyPartId(bodyPartId)) {
      return { success: false, error: `bodyPartId '${bodyPartId}' not valid` };
    }
    
    // 2. Load data
    const data = loadPainTrackerData();
    
    // 3. Check entry exists
    if (!data.painEntries[date]) {
      return { success: false, error: `No entry for date ${date}` };
    }
    if (!data.painEntries[date].bodyPartEntries[bodyPartId]) {
      return { success: false, error: `No entry for ${bodyPartId} on ${date}` };
    }
    
    // 4. Update
    data.painEntries[date].bodyPartEntries[bodyPartId].intensityLevel = newIntensityLevel;
    data.painEntries[date].bodyPartEntries[bodyPartId].recordedAt = new Date().toISOString();
    data.painEntries[date].updatedAt = new Date().toISOString();
    
    // 5. Save
    savePainTrackerData(data);
    return { success: true };
    
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
```

### DELETE: Remove Entry

**Operation**: Delete all pain records for a specific date.

```typescript
function deletePainEntry(date: string): { success: boolean; error?: string } {
  try {
    const data = loadPainTrackerData();
    
    if (!data.painEntries[date]) {
      return { success: false, error: `No entry found for date ${date}` };
    }
    
    delete data.painEntries[date];
    savePainTrackerData(data);
    return { success: true };
    
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
```

---

## Error Handling

### QuotaExceededError

**Condition**: localStorage quota exceeded (~5-10 MB per origin).

**Handling Strategy**:
```typescript
function handleQuotaExceeded(): { success: boolean } {
  try {
    // 1. Identify oldest month
    const data = loadPainTrackerData();
    const dates = Object.keys(data.painEntries).sort();
    if (dates.length === 0) return { success: false };
    
    const oldestDate = dates[0];
    const oldestMonth = oldestDate.substring(0, 7); // YYYY-MM
    
    // 2. Delete all entries from oldest month
    const toDelete = dates.filter(d => d.startsWith(oldestMonth));
    for (const date of toDelete) {
      delete data.painEntries[date];
    }
    
    // 3. Save cleaned data
    savePainTrackerData(data);
    
    // 4. Notify user
    showNotification(`Auto-cleanup: Deleted ${toDelete.length} days from ${oldestMonth}`);
    return { success: true };
    
  } catch {
    return { success: false };
  }
}
```

### StorageDisabledError

**Condition**: User has localStorage disabled or in private browsing mode.

**Handling**: Graceful fallback to in-memory data (session only).

```typescript
function loadPainTrackerData(): PainTrackerData {
  try {
    const stored = localStorage.getItem("painTrackerData");
    return stored ? JSON.parse(stored) : initializeEmptyData();
  } catch (err) {
    console.warn("localStorage unavailable, using in-memory storage");
    return initializeEmptyData();
  }
}
```

### InvalidDataError

**Condition**: Corrupted or malformed localStorage entry.

**Handling**: Validate on load, prompt user to reset if needed.

```typescript
function validateStorageIntegrity(): { valid: boolean; errors: string[] } {
  const stored = localStorage.getItem("painTrackerData");
  if (!stored) return { valid: true, errors: [] };
  
  try {
    const data = JSON.parse(stored);
    const errors = validatePainTrackerData(data);
    return { valid: errors.length === 0, errors };
  } catch {
    return { valid: false, errors: ["Corrupted localStorage data"] };
  }
}
```

---

## Data Integrity Checks

Run on app startup:

```typescript
function initializeStorage() {
  const integrity = validateStorageIntegrity();
  
  if (!integrity.valid) {
    console.error("Storage integrity check failed:", integrity.errors);
    // Optionally: prompt user to reset data
    // Or: attempt to repair (keep dates, discard invalid entries)
  }
  
  // Check quota usage
  const usage = estimateStorageUsage();
  if (usage > 0.8 * QUOTA_LIMIT) {
    // Warn user: approaching quota
    showWarning("Storage usage approaching limit. Consider deleting old entries.");
  }
}
```

---

## Serialization Format

All data serialized as JSON with standard formatting:

```typescript
const json = JSON.stringify(data, null, 2); // Pretty-print for readability
localStorage.setItem("painTrackerData", json);
```

For storage efficiency in production, consider compact format:

```typescript
const json = JSON.stringify(data); // Compact, no whitespace
localStorage.setItem("painTrackerData", json);
```

---

## Migration Path (Future)

If schema changes, handle version bumps:

```typescript
function migrateData(data: any, fromVersion: string, toVersion: string): any {
  if (fromVersion === "1.0" && toVersion === "1.1") {
    // Example: Add new field
    for (const entry of Object.values(data.painEntries)) {
      if (!entry.metadata) {
        entry.metadata = { version: "1.1" };
      }
    }
  }
  return data;
}
```

---

## Testing Checklist

- [ ] Can create new pain entry
- [ ] Can update existing pain level
- [ ] Can delete entry for date
- [ ] Multiple body parts per date supported
- [ ] Only one entry per body part per date
- [ ] Invalid data rejected with clear error
- [ ] Handles localStorage disabled gracefully
- [ ] Auto-cleanup triggered on quota exceed
- [ ] Data persists after page refresh
- [ ] Data persists across browser sessions
