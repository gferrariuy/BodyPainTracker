// Data models for Pain Tracker application

// Support for both legacy (30-region) and new (60-region) systems
export type RegionSystemVersion = 'legacy-30' | 'refined-60' | 'hybrid';

import { PainTypeCode } from './types/painType';

export interface BodyPartEntry {
  bodyPartId: string;
  intensityLevel: number; // 1-10
  recordedAt?: string; // ISO 8601 timestamp
  notes?: string;
  painType?: PainTypeCode; // optional for backward compatibility; UI will enforce
}

export interface BodyPartHierarchy {
  primaryRegion: string;      // "shoulder", "arm", "knee", etc.
  side: 'left' | 'right';
  subdivision: string;        // "superior", "anterior", "proximal", etc.
}

export interface PainEntry {
  date: string;                              // YYYY-MM-DD format
  bodyPartEntries: Record<string, BodyPartEntry>;
  createdAt: string;                         // ISO 8601 timestamp
  updatedAt: string;                         // ISO 8601 timestamp
  metadata?: {
    source?: string;
    notes?: string;
    systemVersion?: RegionSystemVersion;     // Track which system created entry
    migratedAt?: string;                     // Timestamp of migration (if migrated)
  };
}

export interface BodyPart {
  id: string;
  anatomicalName: string;
  abbreviation?: string;
  location: "front" | "back";
  side?: "left" | "right" | "center";
  category: BodyPartCategory;
  svgPath?: string;
  coordinates?: {
    cx: number;
    cy: number;
    r?: number;
    path?: string;
  };
}

export interface BodyPartCatalog {
  parts: Record<string, BodyPart>;
  frontDiagram: string[];
  backDiagram: string[];
  categories: BodyPartCategory[];
  version: string;
}

export interface StatisticsRecord {
  bodyPartId: string;
  bodyPartName: string;
  totalIntensity: number;
  frequency: number;
  averageIntensity: number;
  ranking: number;
}

export type BodyPartCategory =
  | "head"
  | "neck"
  | "shoulders"
  | "arms"
  | "forearms"
  | "hands"
  | "chest"
  | "abdomen"
  | "back"
  | "lower_back"
  | "pelvis"
  | "thighs"
  | "knees"
  | "shins"
  | "feet";

export type TimePeriod = "week" | "month";

export interface PainTrackerState {
  entries: Record<string, PainEntry>;
  lastUpdated: string;
}
