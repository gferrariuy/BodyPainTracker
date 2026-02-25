import { BodyPartCatalog, BodyPart } from './data-models';

/**
 * Complete 60-region anatomical body parts catalog
 * Structure: {primaryRegion}_{side}_{subdivision}
 * 
 * Total: 15 primary regions × 2 sides × 2 subdivisions = 60 regions
 * 
 * Front view: 30 visible regions (excludes back-only areas like Gluteal and Groin)
 * Back view: 30 visible regions (excludes front-only areas like Groin, includes Gluteal)
 */

// Define all 60 individual body parts
const bodyParts: Record<string, BodyPart> = {
  // ============= NECK (4 regions) =============
  neck_left_anterior: {
    id: 'neck_left_anterior',
    anatomicalName: 'Cuello Izquierdo - Anterior',
    abbreviation: 'Cu.Izq.A',
    location: 'front',
    side: 'left',
    category: 'neck',
  },
  neck_left_posterior: {
    id: 'neck_left_posterior',
    anatomicalName: 'Cuello Izquierdo - Posterior',
    abbreviation: 'Cu.Izq.P',
    location: 'back',
    side: 'left',
    category: 'neck',
  },
  neck_right_anterior: {
    id: 'neck_right_anterior',
    anatomicalName: 'Cuello Derecho - Anterior',
    abbreviation: 'Cu.Der.A',
    location: 'front',
    side: 'right',
    category: 'neck',
  },
  neck_right_posterior: {
    id: 'neck_right_posterior',
    anatomicalName: 'Cuello Derecho - Posterior',
    abbreviation: 'Cu.Der.P',
    location: 'back',
    side: 'right',
    category: 'neck',
  },

  // ============= SHOULDER (4 regions) =============
  shoulder_left_superior: {
    id: 'shoulder_left_superior',
    anatomicalName: 'Hombro Izquierdo - Superior',
    abbreviation: 'Ho.Izq.S',
    location: 'front',
    side: 'left',
    category: 'shoulders',
  },
  shoulder_left_inferior: {
    id: 'shoulder_left_inferior',
    anatomicalName: 'Hombro Izquierdo - Inferior',
    abbreviation: 'Ho.Izq.I',
    location: 'front',
    side: 'left',
    category: 'shoulders',
  },
  shoulder_right_superior: {
    id: 'shoulder_right_superior',
    anatomicalName: 'Hombro Derecho - Superior',
    abbreviation: 'Ho.Der.S',
    location: 'front',
    side: 'right',
    category: 'shoulders',
  },
  shoulder_right_inferior: {
    id: 'shoulder_right_inferior',
    anatomicalName: 'Hombro Derecho - Inferior',
    abbreviation: 'Ho.Der.I',
    location: 'front',
    side: 'right',
    category: 'shoulders',
  },

  // ============= ARM (4 regions) =============
  arm_left_proximal: {
    id: 'arm_left_proximal',
    anatomicalName: 'Brazo Izquierdo - Proximal',
    abbreviation: 'Br.Izq.P',
    location: 'front',
    side: 'left',
    category: 'arms',
  },
  arm_left_distal: {
    id: 'arm_left_distal',
    anatomicalName: 'Brazo Izquierdo - Distal',
    abbreviation: 'Br.Izq.D',
    location: 'front',
    side: 'left',
    category: 'arms',
  },
  arm_right_proximal: {
    id: 'arm_right_proximal',
    anatomicalName: 'Brazo Derecho - Proximal',
    abbreviation: 'Br.Der.P',
    location: 'front',
    side: 'right',
    category: 'arms',
  },
  arm_right_distal: {
    id: 'arm_right_distal',
    anatomicalName: 'Brazo Derecho - Distal',
    abbreviation: 'Br.Der.D',
    location: 'front',
    side: 'right',
    category: 'arms',
  },

  // ============= FOREARM (4 regions) =============
  forearm_left_anterolateral: {
    id: 'forearm_left_anterolateral',
    anatomicalName: 'Antebrazo Izquierdo - Anterolateral',
    abbreviation: 'An.Izq.AL',
    location: 'front',
    side: 'left',
    category: 'forearms',
  },
  forearm_left_posterolateral: {
    id: 'forearm_left_posterolateral',
    anatomicalName: 'Antebrazo Izquierdo - Posterolateral',
    abbreviation: 'An.Izq.PL',
    location: 'back',
    side: 'left',
    category: 'forearms',
  },
  forearm_right_anterolateral: {
    id: 'forearm_right_anterolateral',
    anatomicalName: 'Antebrazo Derecho - Anterolateral',
    abbreviation: 'An.Der.AL',
    location: 'front',
    side: 'right',
    category: 'forearms',
  },
  forearm_right_posterolateral: {
    id: 'forearm_right_posterolateral',
    anatomicalName: 'Antebrazo Derecho - Posterolateral',
    abbreviation: 'An.Der.PL',
    location: 'back',
    side: 'right',
    category: 'forearms',
  },

  // ============= HAND (4 regions) =============
  hand_left_palma: {
    id: 'hand_left_palma',
    anatomicalName: 'Mano Izquierda - Palma',
    abbreviation: 'Ma.Izq.Pl',
    location: 'front',
    side: 'left',
    category: 'hands',
  },
  hand_left_dorso: {
    id: 'hand_left_dorso',
    anatomicalName: 'Mano Izquierda - Dorso',
    abbreviation: 'Ma.Izq.D',
    location: 'front',
    side: 'left',
    category: 'hands',
  },
  hand_right_palma: {
    id: 'hand_right_palma',
    anatomicalName: 'Mano Derecha - Palma',
    abbreviation: 'Ma.Der.Pl',
    location: 'front',
    side: 'right',
    category: 'hands',
  },
  hand_right_dorso: {
    id: 'hand_right_dorso',
    anatomicalName: 'Mano Derecha - Dorso',
    abbreviation: 'Ma.Der.D',
    location: 'front',
    side: 'right',
    category: 'hands',
  },

  // ============= DORSAL/UPPER BACK (4 regions) =============
  dorsal_left_superior: {
    id: 'dorsal_left_superior',
    anatomicalName: 'Dorsales Izquierdo - Superior',
    abbreviation: 'Do.Izq.S',
    location: 'back',
    side: 'left',
    category: 'back',
  },
  dorsal_left_inferior: {
    id: 'dorsal_left_inferior',
    anatomicalName: 'Dorsales Izquierdo - Inferior',
    abbreviation: 'Do.Izq.I',
    location: 'back',
    side: 'left',
    category: 'back',
  },
  dorsal_right_superior: {
    id: 'dorsal_right_superior',
    anatomicalName: 'Dorsales Derecho - Superior',
    abbreviation: 'Do.Der.S',
    location: 'back',
    side: 'right',
    category: 'back',
  },
  dorsal_right_inferior: {
    id: 'dorsal_right_inferior',
    anatomicalName: 'Dorsales Derecho - Inferior',
    abbreviation: 'Do.Der.I',
    location: 'back',
    side: 'right',
    category: 'back',
  },

  // ============= LUMBAR/LOWER BACK (4 regions) =============
  lumbar_left_superior: {
    id: 'lumbar_left_superior',
    anatomicalName: 'Lumbares Izquierdo - Superior',
    abbreviation: 'Lu.Izq.S',
    location: 'back',
    side: 'left',
    category: 'lower_back',
  },
  lumbar_left_inferior: {
    id: 'lumbar_left_inferior',
    anatomicalName: 'Lumbares Izquierdo - Inferior',
    abbreviation: 'Lu.Izq.I',
    location: 'back',
    side: 'left',
    category: 'lower_back',
  },
  lumbar_right_superior: {
    id: 'lumbar_right_superior',
    anatomicalName: 'Lumbares Derecho - Superior',
    abbreviation: 'Lu.Der.S',
    location: 'back',
    side: 'right',
    category: 'lower_back',
  },
  lumbar_right_inferior: {
    id: 'lumbar_right_inferior',
    anatomicalName: 'Lumbares Derecho - Inferior',
    abbreviation: 'Lu.Der.I',
    location: 'back',
    side: 'right',
    category: 'lower_back',
  },

  // ============= SACROILIAC (4 regions) =============
  sacroiliac_left_superior: {
    id: 'sacroiliac_left_superior',
    anatomicalName: 'Zona Sacroilíaca Izquierda - Superior',
    abbreviation: 'ZS.Izq.S',
    location: 'back',
    side: 'left',
    category: 'pelvis',
  },
  sacroiliac_left_inferior: {
    id: 'sacroiliac_left_inferior',
    anatomicalName: 'Zona Sacroilíaca Izquierda - Inferior',
    abbreviation: 'ZS.Izq.I',
    location: 'back',
    side: 'left',
    category: 'pelvis',
  },
  sacroiliac_right_superior: {
    id: 'sacroiliac_right_superior',
    anatomicalName: 'Zona Sacroilíaca Derecha - Superior',
    abbreviation: 'ZS.Der.S',
    location: 'back',
    side: 'right',
    category: 'pelvis',
  },
  sacroiliac_right_inferior: {
    id: 'sacroiliac_right_inferior',
    anatomicalName: 'Zona Sacroilíaca Derecha - Inferior',
    abbreviation: 'ZS.Der.I',
    location: 'back',
    side: 'right',
    category: 'pelvis',
  },

  // ============= GLUTEAL (4 regions) - BACK VIEW ONLY =============
  gluteal_left_superior: {
    id: 'gluteal_left_superior',
    anatomicalName: 'Glúteo Izquierdo - Superior',
    abbreviation: 'Gl.Izq.S',
    location: 'back',
    side: 'left',
    category: 'pelvis',
  },
  gluteal_left_inferior: {
    id: 'gluteal_left_inferior',
    anatomicalName: 'Glúteo Izquierdo - Inferior',
    abbreviation: 'Gl.Izq.I',
    location: 'back',
    side: 'left',
    category: 'pelvis',
  },
  gluteal_right_superior: {
    id: 'gluteal_right_superior',
    anatomicalName: 'Glúteo Derecho - Superior',
    abbreviation: 'Gl.Der.S',
    location: 'back',
    side: 'right',
    category: 'pelvis',
  },
  gluteal_right_inferior: {
    id: 'gluteal_right_inferior',
    anatomicalName: 'Glúteo Derecho - Inferior',
    abbreviation: 'Gl.Der.I',
    location: 'back',
    side: 'right',
    category: 'pelvis',
  },

  // ============= GROIN (4 regions) - FRONT VIEW ONLY =============
  groin_left_medial: {
    id: 'groin_left_medial',
    anatomicalName: 'Ingle Izquierda - Medial',
    abbreviation: 'In.Izq.M',
    location: 'front',
    side: 'left',
    category: 'pelvis',
  },
  groin_left_lateral: {
    id: 'groin_left_lateral',
    anatomicalName: 'Ingle Izquierda - Lateral',
    abbreviation: 'In.Izq.L',
    location: 'front',
    side: 'left',
    category: 'pelvis',
  },
  groin_right_medial: {
    id: 'groin_right_medial',
    anatomicalName: 'Ingle Derecha - Medial',
    abbreviation: 'In.Der.M',
    location: 'front',
    side: 'right',
    category: 'pelvis',
  },
  groin_right_lateral: {
    id: 'groin_right_lateral',
    anatomicalName: 'Ingle Derecha - Lateral',
    abbreviation: 'In.Der.L',
    location: 'front',
    side: 'right',
    category: 'pelvis',
  },

  // ============= THIGH (4 regions) =============
  thigh_left_anterior: {
    id: 'thigh_left_anterior',
    anatomicalName: 'Muslo Izquierdo - Anterior',
    abbreviation: 'Mu.Izq.A',
    location: 'front',
    side: 'left',
    category: 'thighs',
  },
  thigh_left_posterior: {
    id: 'thigh_left_posterior',
    anatomicalName: 'Muslo Izquierdo - Posterior',
    abbreviation: 'Mu.Izq.P',
    location: 'back',
    side: 'left',
    category: 'thighs',
  },
  thigh_right_anterior: {
    id: 'thigh_right_anterior',
    anatomicalName: 'Muslo Derecho - Anterior',
    abbreviation: 'Mu.Der.A',
    location: 'front',
    side: 'right',
    category: 'thighs',
  },
  thigh_right_posterior: {
    id: 'thigh_right_posterior',
    anatomicalName: 'Muslo Derecho - Posterior',
    abbreviation: 'Mu.Der.P',
    location: 'back',
    side: 'right',
    category: 'thighs',
  },

  // ============= KNEE (4 regions) =============
  knee_left_lateral: {
    id: 'knee_left_lateral',
    anatomicalName: 'Rodilla Izquierda - Lateral',
    abbreviation: 'Ro.Izq.L',
    location: 'front',
    side: 'left',
    category: 'knees',
  },
  knee_left_medial: {
    id: 'knee_left_medial',
    anatomicalName: 'Rodilla Izquierda - Medial',
    abbreviation: 'Ro.Izq.M',
    location: 'front',
    side: 'left',
    category: 'knees',
  },
  knee_right_lateral: {
    id: 'knee_right_lateral',
    anatomicalName: 'Rodilla Derecha - Lateral',
    abbreviation: 'Ro.Der.L',
    location: 'front',
    side: 'right',
    category: 'knees',
  },
  knee_right_medial: {
    id: 'knee_right_medial',
    anatomicalName: 'Rodilla Derecha - Medial',
    abbreviation: 'Ro.Der.M',
    location: 'front',
    side: 'right',
    category: 'knees',
  },

  // ============= SHIN/CALF (4 regions) =============
  shin_left_anterior: {
    id: 'shin_left_anterior',
    anatomicalName: 'Canilla Izquierda - Anterior',
    abbreviation: 'Ca.Izq.A',
    location: 'front',
    side: 'left',
    category: 'shins',
  },
  shin_left_posterior: {
    id: 'shin_left_posterior',
    anatomicalName: 'Pantorrilla Izquierda - Posterior',
    abbreviation: 'Pa.Izq.P',
    location: 'back',
    side: 'left',
    category: 'shins',
  },
  shin_right_anterior: {
    id: 'shin_right_anterior',
    anatomicalName: 'Canilla Derecha - Anterior',
    abbreviation: 'Ca.Der.A',
    location: 'front',
    side: 'right',
    category: 'shins',
  },
  shin_right_posterior: {
    id: 'shin_right_posterior',
    anatomicalName: 'Pantorrilla Derecha - Posterior',
    abbreviation: 'Pa.Der.P',
    location: 'back',
    side: 'right',
    category: 'shins',
  },

  // ============= ANKLE (4 regions) =============
  ankle_left_anterolateral: {
    id: 'ankle_left_anterolateral',
    anatomicalName: 'Tobillo Izquierdo - Anterolateral',
    abbreviation: 'To.Izq.AL',
    location: 'front',
    side: 'left',
    category: 'feet',
  },
  ankle_left_posterolateral: {
    id: 'ankle_left_posterolateral',
    anatomicalName: 'Tobillo Izquierdo - Posterolateral',
    abbreviation: 'To.Izq.PL',
    location: 'back',
    side: 'left',
    category: 'feet',
  },
  ankle_right_anterolateral: {
    id: 'ankle_right_anterolateral',
    anatomicalName: 'Tobillo Derecho - Anterolateral',
    abbreviation: 'To.Der.AL',
    location: 'front',
    side: 'right',
    category: 'feet',
  },
  ankle_right_posterolateral: {
    id: 'ankle_right_posterolateral',
    anatomicalName: 'Tobillo Derecho - Posterolateral',
    abbreviation: 'To.Der.PL',
    location: 'back',
    side: 'right',
    category: 'feet',
  },

  // ============= FOOT (4 regions) =============
  foot_left_dorso: {
    id: 'foot_left_dorso',
    anatomicalName: 'Pie Izquierdo - Dorso',
    abbreviation: 'Pi.Izq.D',
    location: 'front',
    side: 'left',
    category: 'feet',
  },
  foot_left_planta: {
    id: 'foot_left_planta',
    anatomicalName: 'Pie Izquierdo - Planta',
    abbreviation: 'Pi.Izq.Pl',
    location: 'front',
    side: 'left',
    category: 'feet',
  },
  foot_right_dorso: {
    id: 'foot_right_dorso',
    anatomicalName: 'Pie Derecho - Dorso',
    abbreviation: 'Pi.Der.D',
    location: 'front',
    side: 'right',
    category: 'feet',
  },
  foot_right_planta: {
    id: 'foot_right_planta',
    anatomicalName: 'Pie Derecho - Planta',
    abbreviation: 'Pi.Der.Pl',
    location: 'front',
    side: 'right',
    category: 'feet',
  },
};

// Generate front and back view lists
const frontViewIds = Object.values(bodyParts)
  .filter((part) => part.location === 'front')
  .map((part) => part.id);

const backViewIds = Object.values(bodyParts)
  .filter((part) => part.location === 'back')
  .map((part) => part.id);

// Get unique categories
const categories = Array.from(
  new Set(Object.values(bodyParts).map((part) => part.category))
) as any[];

/**
 * Complete 60-region body part catalog
 * Includes all 60 individual regions organized by primary region and subdivision
 */
export const bodyPartCatalogRefined: BodyPartCatalog = {
  parts: bodyParts,
  frontDiagram: frontViewIds,
  backDiagram: backViewIds,
  categories,
  version: '2.0',
};

// Utility: Map primary regions to their subdivisions
export const regionSubdivisions: Record<string, string[]> = {
  neck: ['anterior', 'posterior'],
  shoulder: ['superior', 'inferior'],
  arm: ['proximal', 'distal'],
  forearm: ['anterolateral', 'posterolateral'],
  hand: ['palma', 'dorso'],
  dorsal: ['superior', 'inferior'],
  lumbar: ['superior', 'inferior'],
  sacroiliac: ['superior', 'inferior'],
  gluteal: ['superior', 'inferior'],
  groin: ['medial', 'lateral'],
  thigh: ['anterior', 'posterior'],
  knee: ['lateral', 'medial'],
  shin: ['anterior', 'posterior'],
  ankle: ['anterolateral', 'posterolateral'],
  foot: ['dorso', 'planta'],
};
