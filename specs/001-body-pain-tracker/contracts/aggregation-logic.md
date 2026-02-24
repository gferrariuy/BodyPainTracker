# Contract: Statistics Aggregation Logic

**Version**: 1.0 | **Status**: Specification | **Date**: 2026-02-24

## Overview

This document specifies the algorithm for calculating, aggregating, and ranking body part pain data across time periods.

## Period Definitions

### Rolling Periods (NOT Calendar-Based)

Periods are calculated as "last N days from today" (rolling window):

```typescript
function calculatePeriodBounds(period: 'week' | 'month'): { startDate: string; endDate: string } {
  const today = new Date();
  const endDate = formatToYYYYMMDD(today);
  
  let daysBack: number;
  if (period === 'week') {
    daysBack = 7;  // Last 7 calendar days (including today)
  } else {
    daysBack = 30;  // Last 30 calendar days (including today)
  }
  
  const startDate = formatToYYYYMMDD(new Date(today.getTime() - (daysBack - 1) * 24 * 60 * 60 * 1000));
  
  return { startDate, endDate };
}
```

### Examples

- **Today**: 2026-02-24
- **This Week**: 2026-02-18 to 2026-02-24 (7 days)
- **This Month**: 2026-01-26 to 2026-02-24 (30 days)

---

## Aggregation Algorithm

### Step 1: Time Period Filtering

Filter all pain entries that fall within the selected period:

```typescript
function filterEntriesByPeriod(
  painEntries: Record<string, PainEntry>,
  period: 'week' | 'month'
): Record<string, PainEntry> {
  const { startDate, endDate } = calculatePeriodBounds(period);
  
  const filtered: Record<string, PainEntry> = {};
  for (const [date, entry] of Object.entries(painEntries)) {
    if (date >= startDate && date <= endDate) {
      filtered[date] = entry;
    }
  }
  
  return filtered;
}
```

### Step 2: Body Part Aggregation

Sum all pain intensity levels for each body part:

```typescript
interface BodyPartAggregation {
  bodyPartId: string;
  anatomicalName: string;
  totalIntensity: number;
  frequency: number;
  episodes: Array<{
    date: string;
    intensityLevel: number;
  }>;
}

function aggregateByBodyPart(
  painEntries: Record<string, PainEntry>,
  catalog: BodyPartCatalog
): BodyPartAggregation[] {
  const aggregations = new Map<string, BodyPartAggregation>();
  
  // Iterate through all entries in period
  for (const [date, entry] of Object.entries(painEntries)) {
    for (const [bodyPartId, bodyPartEntry] of Object.entries(entry.bodyPartEntries)) {
      // Get or create aggregation
      if (!aggregations.has(bodyPartId)) {
        aggregations.set(bodyPartId, {
          bodyPartId,
          anatomicalName: catalog.parts[bodyPartId]?.anatomicalName || bodyPartId,
          totalIntensity: 0,
          frequency: 0,
          episodes: [],
        });
      }
      
      const agg = aggregations.get(bodyPartId)!;
      agg.totalIntensity += bodyPartEntry.intensityLevel;
      agg.frequency += 1;
      agg.episodes.push({
        date,
        intensityLevel: bodyPartEntry.intensityLevel,
      });
    }
  }
  
  return Array.from(aggregations.values());
}
```

### Step 3: Ranking and Sorting

Rank body parts by total intensity (descending):

```typescript
interface RankedBodyPart extends BodyPartAggregation {
  rank: number;
  averageIntensity: number;
}

function rankByTotalIntensity(aggregations: BodyPartAggregation[]): RankedBodyPart[] {
  // Sort by total intensity (descending)
  const sorted = [...aggregations].sort((a, b) => {
    if (b.totalIntensity !== a.totalIntensity) {
      return b.totalIntensity - a.totalIntensity;
    }
    // Tiebreaker: by frequency (descending)
    return b.frequency - a.frequency;
  });
  
  // Assign ranks (1-indexed)
  return sorted.map((item, idx) => ({
    ...item,
    rank: idx + 1,
    averageIntensity: Math.round((item.totalIntensity / item.frequency) * 10) / 10,
  }));
}
```

### Step 4: Top 10 Selection

Return only top 10 ranked results:

```typescript
function getTop10(ranked: RankedBodyPart[]): RankedBodyPart[] {
  return ranked.slice(0, 10);
}
```

---

## Complete Statistics Workflow

```typescript
interface StatisticsResult {
  period: 'week' | 'month';
  startDate: string;
  endDate: string;
  calculatedAt: string;
  top10: RankedBodyPart[];
  totalDaysWithData: number;
  totalEntriesProcessed: number;
  mostPainfulBodyPart: RankedBodyPart | null;
  isEmpty: boolean;
}

function calculateStatistics(
  painEntries: Record<string, PainEntry>,
  period: 'week' | 'month',
  catalog: BodyPartCatalog
): StatisticsResult {
  
  // 1. Filter by period
  const periodEntries = filterEntriesByPeriod(painEntries, period);
  
  if (Object.keys(periodEntries).length === 0) {
    // No data for this period
    return {
      period,
      startDate: calculatePeriodBounds(period).startDate,
      endDate: calculatePeriodBounds(period).endDate,
      calculatedAt: new Date().toISOString(),
      top10: [],
      totalDaysWithData: 0,
      totalEntriesProcessed: 0,
      mostPainfulBodyPart: null,
      isEmpty: true,
    };
  }
  
  // 2. Aggregate by body part
  const aggregations = aggregateByBodyPart(periodEntries, catalog);
  
  // 3. Rank and calculate averages
  const ranked = rankByTotalIntensity(aggregations);
  
  // 4. Get top 10
  const top10 = getTop10(ranked);
  
  // 5. Count stats
  const totalEntries = aggregations.reduce((sum, item) => sum + item.frequency, 0);
  
  return {
    period,
    startDate: calculatePeriodBounds(period).startDate,
    endDate: calculatePeriodBounds(period).endDate,
    calculatedAt: new Date().toISOString(),
    top10,
    totalDaysWithData: Object.keys(periodEntries).length,
    totalEntriesProcessed: totalEntries,
    mostPainfulBodyPart: ranked[0] || null,
    isEmpty: false,
  };
}
```

---

## Validation Rules

### Input Validation

```typescript
function validateStatisticsInput(
  painEntries: Record<string, PainEntry>,
  period: 'week' | 'month'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // 1. Check painEntries is object
  if (!painEntries || typeof painEntries !== 'object') {
    errors.push("painEntries must be an object");
  }
  
  // 2. Check period is valid
  if (!['week', 'month'].includes(period)) {
    errors.push("period must be 'week' or 'month'");
  }
  
  // 3. Validate each entry
  for (const [date, entry] of Object.entries(painEntries)) {
    if (!isValidYYYYMMDDDate(date)) {
      errors.push(`Invalid date key: ${date}`);
    }
    
    for (const [bodyPartId, bpe] of Object.entries(entry.bodyPartEntries)) {
      if (!isValidBodyPartId(bodyPartId)) {
        errors.push(`Invalid bodyPartId: ${bodyPartId}`);
      }
      if (!isValidIntensityLevel(bpe.intensityLevel)) {
        errors.push(`Invalid intensity level for ${bodyPartId}: ${bpe.intensityLevel}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## Performance Considerations

### Complexity Analysis

- **Time**: O(n × m) where n = number of days, m = average body parts per day
  - Typical: 30 days × 5 body parts/day = 150 iterations (negligible)
- **Space**: O(k) where k = unique body parts in period (max 30+)

### Optimization: Memoization

Cache results when inputs haven't changed:

```typescript
let cachedResult: StatisticsResult | null = null;
let cachedInputHash: string | null = null;

function calculateStatisticsWithCache(
  painEntries: Record<string, PainEntry>,
  period: 'week' | 'month',
  catalog: BodyPartCatalog
): StatisticsResult {
  const inputHash = hashInput(painEntries, period);
  
  if (cachedInputHash === inputHash && cachedResult) {
    return cachedResult;  // Return cached result
  }
  
  // Calculate fresh
  const result = calculateStatistics(painEntries, period, catalog);
  
  // Update cache
  cachedInputHash = inputHash;
  cachedResult = result;
  
  return result;
}

function hashInput(painEntries: Record<string, PainEntry>, period: string): string {
  const keys = Object.keys(painEntries).sort().join(',');
  return `${period}:${keys}`;
}
```

---

## Data Display Format

### Statistics Table Display

```typescript
interface StatisticsTableRow {
  rank: number;
  bodyPartId: string;
  anatomicalName: string;
  totalIntensity: number;
  frequency: number;
  averageIntensity: number;
  lastRecordedDate: string;
  trendIcon: '📈' | '📉' | '➡️';  // Future: trend direction
}

function formatForDisplay(ranked: RankedBodyPart[]): StatisticsTableRow[] {
  return ranked.map(item => ({
    rank: item.rank,
    bodyPartId: item.bodyPartId,
    anatomicalName: item.anatomicalName,
    totalIntensity: item.totalIntensity,
    frequency: item.frequency,
    averageIntensity: item.averageIntensity,
    lastRecordedDate: item.episodes[item.episodes.length - 1].date,
    trendIcon: '➡️',  // Future calculation
  }));
}
```

---

## Edge Cases

### Empty Data

When no entries exist in period:

```typescript
{
  period: 'week',
  startDate: '2026-02-18',
  endDate: '2026-02-24',
  calculatedAt: '2026-02-24T10:00:00Z',
  top10: [],
  totalDaysWithData: 0,
  totalEntriesProcessed: 0,
  mostPainfulBodyPart: null,
  isEmpty: true,
}
```

### Single Entry

When only one body part recorded:

```typescript
{
  // ... other fields ...
  top10: [
    {
      rank: 1,
      bodyPartId: 'left_deltoid',
      anatomicalName: 'Left Deltoid',
      totalIntensity: 7,
      frequency: 1,
      averageIntensity: 7,
      episodes: [
        { date: '2026-02-24', intensityLevel: 7 }
      ]
    }
  ],
  mostPainfulBodyPart: { /* same as above */ },
}
```

### Ties in Ranking

When multiple body parts have identical totalIntensity:

```typescript
// Tiebreaker: by frequency (descending)
// Example: Both have totalIntensity=10
//   Part A: frequency=2 (avg=5) → rank 1
//   Part B: frequency=1 (avg=10) → rank 2
```

---

## Testing Checklist

- [ ] Week period calculates last 7 days correctly
- [ ] Month period calculates last 30 days correctly
- [ ] Today's date included in period
- [ ] Future dates excluded
- [ ] Multiple entries per day aggregated correctly
- [ ] Single entry per day handled correctly
- [ ] Ranking by totalIntensity (descending) correct
- [ ] Tiebreaker by frequency applied
- [ ] Top 10 returned (or fewer if < 10 body parts)
- [ ] Empty map returns empty statistics
- [ ] Invalid inputs rejected with errors
- [ ] Memoization cache working
- [ ] Performance <100ms for 30 days of data
- [ ] No rounding errors in averages

---

## Future Enhancements (Out of Scope)

- Trend detection (increasing/decreasing)
- Seasonal analysis (compare months)
- Predictive insights
- Correlation between body parts
- Custom date range selection
