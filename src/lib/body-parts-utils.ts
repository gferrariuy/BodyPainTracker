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

/**
 * Map a 60-region ID to the legacy diagram ID for visualization
 * Example: "shoulder_left_superior" → "left_shoulder"
 *          "shoulder_left_inferior" → "left_deltoid"
 *          "head" (legacy) → "head"
 */
export function mapToLegacyDiagramId(regionId: string): string {
  // Check if it's already a legacy ID
  if (!regionId.includes('_') || regionId.split('_').length < 3) {
    return regionId; // Already legacy or special case (head, neck)
  }

  // Map 60-region IDs to legacy diagram zones
  const mappings: Record<string, string> = {
    // Shoulder variants → legacy diagram zones
    shoulder_left_superior: 'left_shoulder',
    shoulder_left_inferior: 'left_deltoid',
    shoulder_right_superior: 'right_shoulder',
    shoulder_right_inferior: 'right_deltoid',

    // Arm variants (proximal/distal)
    arm_left_proximal: 'left_bicep',
    arm_left_distal: 'left_bicep',
    arm_right_proximal: 'right_bicep',
    arm_right_distal: 'right_bicep',

    // Forearm variants (anterolateral/posterolateral)
    forearm_left_anterolateral: 'left_forearm',
    forearm_left_posterolateral: 'left_forearm',
    forearm_right_anterolateral: 'right_forearm',
    forearm_right_posterolateral: 'right_forearm',

    // Hand variants (palma/dorso)
    hand_left_palma: 'left_hand',
    hand_left_dorso: 'left_hand',
    hand_right_palma: 'right_hand',
    hand_right_dorso: 'right_hand',

    // Thigh variants (anterior/posterior)
    thigh_left_anterior: 'left_thigh',
    thigh_left_posterior: 'left_thigh',
    thigh_right_anterior: 'right_thigh',
    thigh_right_posterior: 'right_thigh',

    // Knee variants (lateral/medial)
    knee_left_lateral: 'left_knee',
    knee_left_medial: 'left_knee',
    knee_right_lateral: 'right_knee',
    knee_right_medial: 'right_knee',

    // Shin variants (anterior/posterior)
    shin_left_anterior: 'left_shin',
    shin_left_posterior: 'left_shin',
    shin_right_anterior: 'right_shin',
    shin_right_posterior: 'right_shin',

    // Foot variants (dorso/planta)
    foot_left_dorso: 'left_foot',
    foot_left_planta: 'left_foot',
    foot_right_dorso: 'right_foot',
    foot_right_planta: 'right_foot',

    // Ankle variants (anterolateral/posterolateral) - map to foot
    ankle_left_anterolateral: 'left_foot',
    ankle_left_posterolateral: 'left_foot',
    ankle_right_anterolateral: 'right_foot',
    ankle_right_posterolateral: 'right_foot',

    // Back-only regions
    dorsal_left_superior: 'upper_back',
    dorsal_left_inferior: 'mid_back',
    dorsal_right_superior: 'upper_back',
    dorsal_right_inferior: 'mid_back',

    lumbar_left_superior: 'lower_back',
    lumbar_left_inferior: 'lower_back',
    lumbar_right_superior: 'lower_back',
    lumbar_right_inferior: 'lower_back',

    gluteal_left_superior: 'left_glute',
    gluteal_left_inferior: 'left_glute',
    gluteal_right_superior: 'right_glute',
    gluteal_right_inferior: 'right_glute',

    // Neck variants (all map to 'neck')
    neck_left_anterior: 'neck',
    neck_left_posterior: 'neck',
    neck_right_anterior: 'neck',
    neck_right_posterior: 'neck',

    // Hip/Sacroiliac variants
    sacroiliac_left_superior: 'left_hip',
    sacroiliac_left_inferior: 'left_hip',
    sacroiliac_right_superior: 'right_hip',
    sacroiliac_right_inferior: 'right_hip',

    // Groin (front only) - map to hip
    groin_left_medial: 'left_hip',
    groin_left_lateral: 'left_hip',
    groin_right_medial: 'right_hip',
    groin_right_lateral: 'right_hip',

    // Chest variants
    chest_left_superior: 'chest',
    chest_left_inferior: 'chest',
    chest_right_superior: 'chest',
    chest_right_inferior: 'chest',

    // Abdomen variants
    abdomen_left_superior: 'abdomen',
    abdomen_left_inferior: 'abdomen',
    abdomen_right_superior: 'abdomen',
    abdomen_right_inferior: 'abdomen',
  };

  return mappings[regionId] || regionId;
}
