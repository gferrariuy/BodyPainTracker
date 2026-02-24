import { PainEntry, StatisticsRecord, TimePeriod } from './data-models';
import { calculatePeriodBounds, getDatesBetween } from './dates';
import { bodyPartCatalog } from './body-parts';

/**
 * Aggregation and statistics calculation utilities
 */

export function filterEntriesByPeriod(
  entries: Record<string, PainEntry>,
  period: TimePeriod
): PainEntry[] {
  const { startDate, endDate } = calculatePeriodBounds(period);
  const dateRange = getDatesBetween(startDate, endDate);
  const dateSet = new Set(dateRange);

  return Object.values(entries).filter((entry) => dateSet.has(entry.date));
}

export function aggregateByBodyPart(
  entries: PainEntry[]
): Record<string, { totalIntensity: number; frequency: number }> {
  const aggregated: Record<
    string,
    { totalIntensity: number; frequency: number }
  > = {};

  for (const entry of entries) {
    for (const [bodyPartId, bodyPartEntry] of Object.entries(
      entry.bodyPartEntries
    )) {
      if (!aggregated[bodyPartId]) {
        aggregated[bodyPartId] = { totalIntensity: 0, frequency: 0 };
      }
      aggregated[bodyPartId].totalIntensity += bodyPartEntry.intensityLevel;
      aggregated[bodyPartId].frequency += 1;
    }
  }

  return aggregated;
}

export function rankByTotalIntensity(
  aggregated: Record<string, { totalIntensity: number; frequency: number }>
): StatisticsRecord[] {
  const records: StatisticsRecord[] = Object.entries(aggregated).map(
    ([bodyPartId, data]) => {
      const bodyPart = bodyPartCatalog.parts[bodyPartId];
      return {
        bodyPartId,
        bodyPartName: bodyPart.anatomicalName,
        totalIntensity: data.totalIntensity,
        frequency: data.frequency,
        averageIntensity: Number(
          (data.totalIntensity / data.frequency).toFixed(2)
        ),
        ranking: 0, // Will be set after sorting
      };
    }
  );

  // Sort by total intensity descending
  records.sort((a, b) => b.totalIntensity - a.totalIntensity);

  // Assign rankings
  records.forEach((record, index) => {
    record.ranking = index + 1;
  });

  return records;
}

export function calculateStatistics(
  entries: Record<string, PainEntry>,
  period: TimePeriod
): StatisticsRecord[] {
  const filteredEntries = filterEntriesByPeriod(entries, period);

  if (filteredEntries.length === 0) {
    return [];
  }

  const aggregated = aggregateByBodyPart(filteredEntries);
  const ranked = rankByTotalIntensity(aggregated);

  // Return top 10
  return ranked.slice(0, 10);
}
