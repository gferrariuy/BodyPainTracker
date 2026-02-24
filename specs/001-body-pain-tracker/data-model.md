# Data Model: Daily Body Pain Tracker

**Version**: 1.0 | **Date**: 2026-02-24

## Entity Definitions

### 1. Pain Entry

Represents all pain recordings for a single calendar day.

**Storage Location**: localStorage key = `painEntries[YYYY-MM-DD]`

**Structure**:
```typescript
interface PainEntry {
  date: string;                    // YYYY-MM-DD format (immutable, key)
  bodyPartEntries: Record<string, BodyPartEntry>;  // keyed by body part ID
  createdAt: string;               // ISO 8601 timestamp of first entry
  updatedAt: string;               // ISO 8601 timestamp of last update
  metadata?: {
    source?: string;               // "web" | "mobile" | etc
    notes?: string;                // Optional user notes (future)
  };
}
```

**Invariants**:
- Date must be today's date (or earlier if backfill allowed in future)
- Each body part can have maximum 1 entry per date
- Cannot record future dates
- Entries are immutable once created; updates modify pain level only

**Operations**:
- Create: New entry for today
- Read: Retrieve by date
- Update: Modify pain intensity for body part
- Delete: Remove entire day's entry

---

### 2. Body Part Entry

Represents pain intensity recorded for one anatomical region on one date.

**Storage Location**: Nested within PainEntry.bodyPartEntries

**Structure**:
```typescript
interface BodyPartEntry {
  bodyPartId: string;              // e.g., "left_deltoid" (const, from catalog)
  intensityLevel: number;          // 1-10, from slider
  recordedAt?: string;             // ISO 8601 timestamp (optional, for sequencing)
  notes?: string;                  // Optional user notes (future feature)
}
```

**Invariants**:
- intensityLevel: 1 ≤ intensity ≤ 10 (validated before storage)
- bodyPartId: must exist in BodyPartCatalog
- One entry per body part per date

**Validation**:
```typescript
function isValidBodyPartEntry(entry: BodyPartEntry): boolean {
  return (
    entry.intensityLevel >= 1 &&
    entry.intensityLevel <= 10 &&
    isValidBodyPartId(entry.bodyPartId)
  );
}
```

---

### 3. Body Part Catalog

Static master list of all anatomically selectable body regions.

**Storage Location**: Imported as static constant; not persisted to localStorage

**Structure**:
```typescript
interface BodyPart {
  id: string;                      // Unique identifier (e.g., "left_deltoid")
  anatomicalName: string;          // Display name (e.g., "Left Deltoid (Shoulder)")
  abbreviation?: string;           // Short form (e.g., "L. Delt")
  location: "front" | "back";      // Which diagram
  side?: "left" | "right" | "center";  // Laterality
  category: BodyPartCategory;      // Region grouping
  svgPath?: string;                // Optional SVG path ID for click detection
  coordinates?: {                  // SVG clickable region
    cx: number;                    // Center X
    cy: number;                    // Center Y
    r?: number;                    // Radius (if circle)
    path?: string;                 // Path data (if path element)
  };
}

type BodyPartCategory = 
  | "head" | "neck" | "shoulders" | "arms" | "forearms" | "hands"
  | "chest" | "abdomen" | "back" | "lower_back" | "pelvis"
  | "thighs" | "knees" | "shins" | "feet";

interface BodyPartCatalog {
  parts: Record<string, BodyPart>;  // Keyed by ID
  frontDiagram: string[];           // Array of IDs visible on front
  backDiagram: string[];            // Array of IDs visible on back
  categories: BodyPartCategory[];   // Available categories
  version: string;                  // Catalog version for migrations
}
```

**Example Catalog** (30+ regions):

```typescript
const bodyPartCatalog: BodyPartCatalog = {
  parts: {
    "head": { id: "head", anatomicalName: "Head", location: "front", category: "head" },
    "neck": { id: "neck", anatomicalName: "Neck", location: "front", category: "neck" },
    "left_shoulder": { id: "left_shoulder", anatomicalName: "Left Shoulder", location: "front", side: "left", category: "shoulders" },
    "right_shoulder": { id: "right_shoulder", anatomicalName: "Right Shoulder", location: "front", side: "right", category: "shoulders" },
    "left_deltoid": { id: "left_deltoid", anatomicalName: "Left Deltoid", location: "front", side: "left", category: "shoulders" },
    "right_deltoid": { id: "right_deltoid", anatomicalName: "Right Deltoid", location: "front", side: "right", category: "shoulders" },
    "left_bicep": { id: "left_bicep", anatomicalName: "Left Bicep", location: "front", side: "left", category: "arms" },
    "right_bicep": { id: "right_bicep", anatomicalName: "Right Bicep", location: "front", side: "right", category: "arms" },
    "left_forearm": { id: "left_forearm", anatomicalName: "Left Forearm", location: "front", side: "left", category: "forearms" },
    "right_forearm": { id: "right_forearm", anatomicalName: "Right Forearm", location: "front", side: "right", category: "forearms" },
    "left_hand": { id: "left_hand", anatomicalName: "Left Hand", location: "front", side: "left", category: "hands" },
    "right_hand": { id: "right_hand", anatomicalName: "Right Hand", location: "front", side: "right", category: "hands" },
    "chest": { id: "chest", anatomicalName: "Chest", location: "front", category: "chest" },
    "abdomen": { id: "abdomen", anatomicalName: "Abdomen", location: "front", category: "abdomen" },
    "left_breast": { id: "left_breast", anatomicalName: "Left Breast", location: "front", side: "left", category: "chest" },
    "right_breast": { id: "right_breast", anatomicalName: "Right Breast", location: "front", side: "right", category: "chest" },
    "left_hip": { id: "left_hip", anatomicalName: "Left Hip", location: "front", side: "left", category: "pelvis" },
    "right_hip": { id: "right_hip", anatomicalName: "Right Hip", location: "front", side: "right", category: "pelvis" },
    "left_thigh": { id: "left_thigh", anatomicalName: "Left Thigh", location: "front", side: "left", category: "thighs" },
    "right_thigh": { id: "right_thigh", anatomicalName: "Right Thigh", location: "front", side: "right", category: "thighs" },
    "left_knee": { id: "left_knee", anatomicalName: "Left Knee", location: "front", side: "left", category: "knees" },
    "right_knee": { id: "right_knee", anatomicalName: "Right Knee", location: "front", side: "right", category: "knees" },
    "left_shin": { id: "left_shin", anatomicalName: "Left Shin", location: "front", side: "left", category: "shins" },
    "right_shin": { id: "right_shin", anatomicalName: "Right Shin", location: "front", side: "right", category: "shins" },
    "left_foot": { id: "left_foot", anatomicalName: "Left Foot", location: "front", side: "left", category: "feet" },
    "right_foot": { id: "right_foot", anatomicalName: "Right Foot", location: "front", side: "right", category: "feet" },
    "upper_back": { id: "upper_back", anatomicalName: "Upper Back", location: "back", category: "back" },
    "mid_back": { id: "mid_back", anatomicalName: "Mid Back", location: "back", category: "back" },
    "lower_back": { id: "lower_back", anatomicalName: "Lower Back", location: "back", category: "lower_back" },
    "left_glute": { id: "left_glute", anatomicalName: "Left Gluteal", location: "back", side: "left", category: "pelvis" },
    "right_glute": { id: "right_glute", anatomicalName: "Right Gluteal", location: "back", side: "right", category: "pelvis" },
  },
  frontDiagram: ["head", "neck", "left_shoulder", "right_shoulder", "left_deltoid", "right_deltoid", "left_bicep", "right_bicep", "left_forearm", "right_forearm", "left_hand", "right_hand", "chest", "abdomen", "left_breast", "right_breast", "left_hip", "right_hip", "left_thigh", "right_thigh", "left_knee", "right_knee", "left_shin", "right_shin", "left_foot", "right_foot"],
  backDiagram: ["neck", "upper_back", "mid_back", "lower_back", "left_shoulder", "right_shoulder", "left_deltoid", "right_deltoid", "left_glute", "right_glute", "left_thigh", "right_thigh", "left_knee", "right_knee", "left_shin", "right_shin", "left_foot", "right_foot"],
  categories: ["head", "neck", "shoulders", "arms", "forearms", "hands", "chest", "abdomen", "back", "lower_back", "pelvis", "thighs", "knees", "shins", "feet"],
  version: "1.0",
};
```

---

### 4. Statistics Record

Aggregated pain data for analytics display.

**Storage Location**: Calculated on-the-fly from PainEntry records; not persisted

**Structure**:
```typescript
interface AggregatedBodyPartStats {
  bodyPartId: string;
  anatomicalName: string;
  totalIntensity: number;           // Sum of all intensity values in period
  frequency: number;                // Count of days with entries
  averageIntensity: number;         // totalIntensity / frequency
  rank: number;                     // 1-10 (or more), descending by totalIntensity
  lastRecordedDate: string;         // Most recent date in period
  trendDirection?: "increasing" | "stable" | "decreasing";  // Optional: future feature
}

interface PeriodStatistics {
  period: "week" | "month";
  startDate: string;               // YYYY-MM-DD (inclusive)
  endDate: string;                 // YYYY-MM-DD (inclusive)
  calculatedAt: string;            // ISO 8601 timestamp
  bodyPartsRanked: AggregatedBodyPartStats[];  // Top 10+, sorted by totalIntensity descending
  totalDaysWithData: number;
  commonestBodyPart: string;        // ID of highest ranked
  metadata: {
    totalEntriesProcessed: number;
    daysInPeriod: number;
  };
}
```

**Calculation Algorithm**:

```typescript
function calculateStatistics(
  painEntries: Record<string, PainEntry>,
  period: "week" | "month"
): PeriodStatistics {
  // 1. Calculate date range
  const endDate = getTodayString();
  const daysBack = period === "week" ? 7 : 30;
  const startDate = getDateNDaysAgo(daysBack);

  // 2. Filter entries in period
  const entriesInPeriod = Object.entries(painEntries).filter(
    ([date]) => date >= startDate && date <= endDate
  );

  // 3. Aggregate by body part
  const stats = new Map<string, AggregatedBodyPartStats>();
  for (const [date, entry] of entriesInPeriod) {
    for (const [bodyPartId, bodyPartEntry] of Object.entries(entry.bodyPartEntries)) {
      if (!stats.has(bodyPartId)) {
        stats.set(bodyPartId, {
          bodyPartId,
          anatomicalName: getCatalog().parts[bodyPartId].anatomicalName,
          totalIntensity: 0,
          frequency: 0,
          averageIntensity: 0,
          rank: 0,
          lastRecordedDate: date,
        });
      }
      const stat = stats.get(bodyPartId)!;
      stat.totalIntensity += bodyPartEntry.intensityLevel;
      stat.frequency += 1;
      stat.lastRecordedDate = date;
    }
  }

  // 4. Rank by total intensity (descending)
  const ranked = Array.from(stats.values())
    .sort((a, b) => b.totalIntensity - a.totalIntensity)
    .map((stat, idx) => ({ ...stat, rank: idx + 1 }));

  return {
    period,
    startDate,
    endDate,
    calculatedAt: new Date().toISOString(),
    bodyPartsRanked: ranked.slice(0, 10),  // Top 10
    totalDaysWithData: entriesInPeriod.length,
    commonestBodyPart: ranked[0]?.bodyPartId || "",
    metadata: {
      totalEntriesProcessed: entriesInPeriod.reduce((sum, [, e]) => sum + Object.keys(e.bodyPartEntries).length, 0),
      daysInPeriod: daysBack,
    },
  };
}
```

---

## localStorage Schema

### Overall Structure

```json
{
  "painTrackerData": {
    "painEntries": {
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
        "updatedAt": "2026-02-24T14:32:00Z"
      }
    },
    "metadata": {
      "version": "1.0",
      "lastUpdated": "2026-02-24T14:32:00Z",
      "appVersion": "1.0.0"
    }
  }
}
```

### Key Points

- Root key: `"painTrackerData"`
- Entries organized by date (YYYY-MM-DD format)
- Each date is a PainEntry with nested body parts
- All timestamps in ISO 8601 format
- Can be easily serialized/deserialized to/from JSON

---

## Data Lifecycle

### Create Path
1. User clicks body part on diagram
2. Slider component appears for that body part
3. User adjusts slider to desired intensity (1-10)
4. User confirms → saves to localStorage
5. Today's PainEntry created/updated with new BodyPartEntry

### Read Path
1. App loads, reads entire `painEntries` from localStorage
2. When viewing statistics, filters and aggregates based on period
3. When viewing history, sorts entries by date (descending)

### Update Path
1. User clicks same body part again on same day
2. Slider shows existing value
3. User modifies intensity
4. Confirms → BodyPartEntry for that part replaced (latest wins)
5. Updated timestamp changed, but createdAt remains

### Delete Path
1. User clicks delete on history entry for a date
2. Entire PainEntry for that date removed
3. All body parts for that date deleted

### Cleanup Path (Auto-triggered on quota exceeded)
1. System detects localStorage quota exceeded on new write
2. Identifies oldest month's data
3. Deletes all PainEntry records from that month
4. Retries write
5. Displays notification to user explaining cleanup

---

## Validation Rules

| Field | Validation |
|-------|-----------|
| Date | Must be YYYY-MM-DD format, ≤ today |
| bodyPartId | Must exist in BodyPartCatalog |
| intensityLevel | 1 ≤ intensity ≤ 10, integer |
| timestamp | Valid ISO 8601 format |

---

## Estimated Storage Usage

- Single entry (1 body part, 1 date): ~150 bytes JSON
- Average daily record (5 body parts): ~750 bytes
- 30 days of data: ~22.5 KB
- 1 year of data: ~275 KB
- 10 years of data: ~2.75 MB (well within 5-10 MB localStorage limit)

---

## Future Extensions (Out of MVP Scope)

- User notes per body part entry
- Trend analysis (increasing/stable/decreasing pain trajectories)
- Pain severity categories (mild/moderate/severe)
- Photo annotations
- Multi-user support (account system)
- Data export (CSV, JSON)
- Cloud sync across devices
