import { bodyPartCatalogRefined, regionSubdivisions } from './body-parts-refined';
import { BodyPartHierarchy } from './data-models';

/**
 * Utility functions for working with the 60-region anatomical system
 */

/**
 * Parse a 60-region ID into its hierarchy components
 * Example: "shoulder_left_superior" → { primaryRegion: "shoulder", side: "left", subdivision: "superior" }
 */
export function parseRegionId(regionId: string): BodyPartHierarchy | null {
  const parts = regionId.split('_');
  
  if (parts.length < 3) {
    return null;
  }
  
  const side = parts[parts.length - 2];
  const subdivision = parts[parts.length - 1];
  const primaryRegion = parts.slice(0, -2).join('_');
  
  if (side !== 'left' && side !== 'right') {
    return null;
  }
  
  return {
    primaryRegion,
    side: side as 'left' | 'right',
    subdivision,
  };
}

/**
 * Generate a 60-region ID from hierarchy components
 * Example: { primaryRegion: "shoulder", side: "left", subdivision: "superior" } → "shoulder_left_superior"
 */
export function generateRegionId(hierarchy: BodyPartHierarchy): string {
  return `${hierarchy.primaryRegion}_${hierarchy.side}_${hierarchy.subdivision}`;
}

/**
 * Get all subdivisions for a primary region
 * Example: "shoulder" → ["superior", "inferior"]
 */
export function getSubdivisionsForRegion(primaryRegion: string): string[] {
  return regionSubdivisions[primaryRegion] || [];
}

/**
 * Get the primary region name from a full region ID
 * Example: "shoulder_left_superior" → "shoulder"
 */
export function getPrimaryRegionFromId(regionId: string): string | null {
  const hierarchy = parseRegionId(regionId);
  return hierarchy?.primaryRegion || null;
}

/**
 * Get all region IDs for a primary region and side
 * Example: ("shoulder", "left") → ["shoulder_left_superior", "shoulder_left_inferior"]
 */
export function getRegionVariantsForSide(
  primaryRegion: string,
  side: 'left' | 'right'
): string[] {
  const subdivisions = getSubdivisionsForRegion(primaryRegion);
  return subdivisions.map((subdivision) =>
    generateRegionId({
      primaryRegion,
      side,
      subdivision,
    })
  );
}

/**
 * Filter regions by view (front or back)
 * Example: (bodyPartCatalogRefined.frontDiagram) → array of front-view region IDs
 */
export function getRegionsByLocation(
  location: 'front' | 'back'
): string[] {
  if (location === 'front') {
    return bodyPartCatalogRefined.frontDiagram;
  }
  return bodyPartCatalogRefined.backDiagram;
}

/**
 * Get all regions for a primary region across both sides
 * Example: "shoulder" → ["shoulder_left_superior", "shoulder_left_inferior", "shoulder_right_superior", "shoulder_right_inferior"]
 */
export function getAllRegionVariants(primaryRegion: string): string[] {
  const left = getRegionVariantsForSide(primaryRegion, 'left');
  const right = getRegionVariantsForSide(primaryRegion, 'right');
  return [...left, ...right];
}

/**
 * Get the anatomical name (Spanish display name) for a region ID
 * Example: "shoulder_left_superior" → "Hombro Izquierdo - Superior"
 */
export function getRegionDisplayName(regionId: string): string {
  const part = bodyPartCatalogRefined.parts[regionId];
  return part?.anatomicalName || regionId;
}

/**
 * Get the abbreviation for a region ID
 * Example: "shoulder_left_superior" → "Ho.Izq.S"
 */
export function getRegionAbbreviation(regionId: string): string {
  const part = bodyPartCatalogRefined.parts[regionId];
  return part?.abbreviation || regionId;
}

/**
 * Get all primary regions (excluding subdivisions)
 * Returns: ["neck", "shoulder", "arm", "forearm", "hand", "dorsal", "lumbar", "sacroiliac", "gluteal", "groin", "thigh", "knee", "shin", "ankle", "foot"]
 */
export function getAllPrimaryRegions(): string[] {
  return Object.keys(regionSubdivisions);
}

/**
 * Check if a region ID is valid in the 60-region system
 */
export function isValidRegionId(regionId: string): boolean {
  return regionId in bodyPartCatalogRefined.parts;
}

/**
 * Check if a primary region is back-view only
 * Back-view only regions: gluteal
 * Front-view only regions: groin
 */
export function isBackViewOnly(primaryRegion: string): boolean {
  return primaryRegion === 'gluteal';
}

/**
 * Check if a primary region is front-view only
 */
export function isFrontViewOnly(primaryRegion: string): boolean {
  return primaryRegion === 'groin';
}

/**
 * Get the category for a region
 * Example: "shoulder_left_superior" → "shoulders"
 */
export function getRegionCategory(regionId: string): string | undefined {
  const part = bodyPartCatalogRefined.parts[regionId];
  return part?.category;
}

/**
 * Get all regions visible in a specific view
 */
export function getVisibleRegionsForView(view: 'front' | 'back'): string[] {
  return getRegionsByLocation(view);
}

/**
 * Get primary regions visible in a specific view
 * Example: "back" → all primary regions with at least one back-view region
 */
export function getPrimaryRegionsForView(view: 'front' | 'back'): string[] {
  const visibleRegionIds = getVisibleRegionsForView(view);
  const primaryRegions = new Set<string>();
  
  visibleRegionIds.forEach((regionId) => {
    const primaryRegion = getPrimaryRegionFromId(regionId);
    if (primaryRegion) {
      primaryRegions.add(primaryRegion);
    }
  });
  
  return Array.from(primaryRegions).sort();
}
