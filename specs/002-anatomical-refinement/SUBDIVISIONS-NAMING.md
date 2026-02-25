# Subdivision Naming Conventions & Anatomical Standards

**Feature**: Anatomical Refinement - Body Parts Granularity  
**Created**: 2026-02-25  
**Type**: Technical Reference Document  
**Purpose**: Standardize subdivision terminology across the 60-region system

---

## Overview

The 60-region system divides each of the 15 primary body regions into 2 subdivisions per side (Left/Right). This document defines:

1. **Anatomical naming conventions** for each subdivision pair
2. **Display names** (Spanish and English) for UI rendering
3. **Mapping logic** for consistent naming across regions
4. **Abbreviated forms** for compact UI display
5. **Anatomical justification** for each subdivision choice

---

## Region Subdivision Glossary

### 1. Cuello (Neck)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **anterior** | Anterior | Anterior | Front/Cervical region | Throat side, flexion region | Anterior |
| **posterior** | Posterior | Posterior | Back/Nuchal region | Back of neck, extension region | Posterior |

**Rationale**: Cervical spine pain patterns differ dramatically between flexion (anterior) and extension (posterior) mechanisms.

**Example Display**: "Cuello Izquierdo - Anterior" / "Neck Left - Anterior"

---

### 2. Hombro (Shoulder)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **superior** | Superior | Superior | Upper shoulder, acromion process | Deltoid/rotator cuff region | Superior |
| **inferior** | Inferior | Inferior | Lower shoulder, axilla region | Armpit/subscapular region | Inferior |

**Rationale**: Superior shoulder pain (impingement, rotator cuff tears) vs. Inferior shoulder pain (axillary nerve, long head biceps) are clinically distinct.

**Example Display**: "Hombro Derecho - Superior" / "Shoulder Right - Superior"

---

### 3. Brazo (Arm - Shoulder to Elbow)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **proximal** | Proximal | Proximal | Upper arm (shoulder-elbow midpoint) | Biceps, triceps, deltoid insertion | Proximal |
| **distal** | Distal | Distal | Lower arm (elbow-adjacent) | Brachialis, distal triceps | Distal |

**Rationale**: Upper arm muscle injuries (biceps tendinopathy, triceps strain) concentrate proximally; elbow-adjacent pain is distinct.

**Example Display**: "Brazo Izquierdo - Proximal" / "Arm Left - Proximal"

---

### 4. Antebrazo (Forearm)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **anterolateral** | Anterolateral | Anterolateral | Front/lateral forearm | Flexor carpi group, brachioradialis, epicondylitis | Anterolateral |
| **posterolateral** | Posterolateral | Posterolateral | Back/lateral forearm | Extensor carpi group, posterior compartment | Posterolateral |

**Rationale**: Lateral epicondylitis (tennis elbow) vs. medial epicondylitis (golfer's elbow) vs. posterior compartment syndrome are anatomically distinct pain patterns.

**Example Display**: "Antebrazo Derecho - Anterolateral" / "Forearm Right - Anterolateral"

---

### 5. Mano (Hand)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **palma** | Palma | Palm | Palmar surface (anterior/grasping) | Flexor tendons, intrinsic muscles, carpal tunnel | Palma |
| **dorso** | Dorso | Dorsum | Dorsal surface (posterior/extensors) | Extensor tendons, dorsal compartments | Dorso |

**Rationale**: Carpal tunnel (palmar pain) vs. extensor tenosynovitis (dorsal pain) are completely different pathologies.

**Example Display**: "Mano Izquierda - Palma" / "Hand Left - Palm"

---

### 6. Dorsales (Upper Back - Thoracic)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **superior** | Superior | Superior | Upper thoracic (T1-T6 level) | Upper scapular, mid-thoracic | Superior |
| **inferior** | Inferior | Inferior | Lower thoracic (T7-T12 level) | Lower scapular, thoracolumbar junction | Inferior |

**Rationale**: Thoracic outlet syndrome (superior) vs. lower back referred pain (inferior) have different clinical presentations.

**Example Display**: "Dorsales Izquierdo - Superior" / "Upper Back Left - Superior"

---

### 7. Lumbares (Lower Back - Lumbar Spine)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **superior** | Superior | Superior | Upper lumbar (L1-L3 level) | Quadratus lumborum, upper erector spinae | Superior |
| **inferior** | Inferior | Inferior | Lower lumbar (L4-S1 level) | Disc herniation zone, facet joints, sciatic nerve | Inferior |

**Rationale**: Upper lumbar pain (muscle strain) vs. lower lumbar pain (disc herniation, sciatica) require different treatment approaches.

**Example Display**: "Lumbares Izquierdo - Superior" / "Lower Back Left - Superior"

---

### 8. Zona Sacroilíaca (Sacroiliac Joint Region)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **superior** | Superior | Superior | Upper sacroiliac joint | SIJD upper pole, iliac crest | Superior |
| **inferior** | Inferior | Inferior | Lower sacroiliac joint | SIJD lower pole, sacral base | Inferior |

**Rationale**: Sacroiliac joint dysfunction presents differently in upper vs. lower pole pain patterns.

**Example Display**: "Zona Sacroilíaca Izquierda - Superior" / "Sacroiliac Zone Left - Superior"

---

### 9. Glúteo (Buttock - Gluteal Region) [BACK VIEW ONLY]

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **superior** | Superior | Superior | Upper buttock (gluteus medius/maximus) | Hip abductor, lateral hip pain, trochanteric bursitis | Superior |
| **inferior** | Inferior | Inferior | Lower buttock (gluteus maximus, ischial tuberosity) | Sitting pain, sciatic nerve exit, piriformis | Inferior |

**Rationale**: Upper gluteal pain (trochanteric bursitis) vs. lower gluteal pain (ischial tuberosity bursitis, piriformis syndrome) are clinically distinct.

**Example Display**: "Glúteo Izquierdo - Superior" / "Gluteal Left - Superior"

---

### 10. Ingle (Inguinal/Groin Region) [FRONT VIEW ONLY]

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **medial** | Medial | Medial | Medial groin (adductor region) | Adductor longus, gracilis, medial thigh pain | Medial |
| **lateral** | Lateral | Lateral | Lateral groin (inguinal/hip flexor region) | Inguinal ligament, iliopsoas, FAIS | Lateral |

**Rationale**: Adductor strain (medial) vs. inguinal hernia/FAIS (lateral) present entirely differently.

**Example Display**: "Ingle Izquierda - Medial" / "Groin Left - Medial"

---

### 11. Muslo (Thigh)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **anterior** | Anterior | Anterior | Front thigh (quadriceps region) | Quadriceps muscles, femoral nerve, patellar tendon | Anterior |
| **posterior** | Posterior | Posterior | Back thigh (hamstring region) | Hamstrings, sciatic nerve, ischial tuberosity | Posterior |

**Rationale**: Quadriceps strain/tendonitis (anterior) vs. hamstring strain/sciatic nerve compression (posterior) are completely different pathologies.

**Example Display**: "Muslo Izquierdo - Anterior" / "Thigh Left - Anterior"

---

### 12. Rodilla (Knee)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **lateral** | Lateral | Lateral | Lateral knee (fibular side) | Lateral meniscus, collateral ligament, ITB, peroneal nerve | Lateral |
| **medial** | Medial | Medial | Medial knee (tibial side) | Medial meniscus, collateral ligament, pes anserinus | Medial |

**Rationale**: Lateral knee pain (ITB syndrome, lateral meniscus tear) vs. Medial knee pain (MCL injury, medial meniscus tear, pes anserinus bursitis) are clinically distinct.

**Example Display**: "Rodilla Izquierda - Lateral" / "Knee Left - Lateral"

---

### 13. Canilla/Pantorrilla (Shin/Calf)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **anterior** | Anterior | Anterior | Front shin (tibialis anterior) | Shin splints, anterior compartment syndrome, tibialis anterior muscle | Anterior |
| **posterior** | Posterior (+ Pantorrilla) | Posterior | Back calf (gastrocnemius, soleus, Achilles) | Calf strain, Achilles tendonitis, plantaris strain | Posterior |

**Rationale**: Shin splints (anterior) vs. calf strain/Achilles injury (posterior) are anatomically and clinically distinct.

**Example Display**: "Canilla Izquierda - Anterior" / "Shin Left - Anterior"  
or  
"Pantorrilla Izquierda - Posterior" / "Calf Left - Posterior"

---

### 14. Tobillo (Ankle)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **anterolateral** | Anterolateral | Anterolateral | Front/lateral ankle | Anterior talofibular ligament, syndesmosis, anterior compartment | Anterolateral |
| **posterolateral** | Posterolateral | Posterolateral | Back/lateral ankle | Posterior talofibular ligament, peroneal tendons, Achilles insertion | Posterolateral |

**Rationale**: Ankle inversion sprain (anterolateral ATFL) vs. high ankle sprain/peroneal tendonitis (posterolateral) are distinct injury patterns.

**Example Display**: "Tobillo Derecho - Anterolateral" / "Ankle Right - Anterolateral"

---

### 15. Pie (Foot)

| Subdivision | Spanish | English | Anatomical Definition | Context | UI Display |
|---|---|---|---|---|---|
| **dorso** | Dorso | Dorsum | Top of foot (dorsal surface) | Extensor tendons, dorsal compartment, forefoot extensors | Dorso |
| **planta** | Planta | Sole | Bottom of foot (plantar surface) | Plantar fascia, flexor tendons, medial/lateral arch | Planta |

**Rationale**: Dorsal foot pain (extensor tendonitis, sinus tarsi) vs. Plantar foot pain (plantar fasciitis, arch strain) are completely different.

**Example Display**: "Pie Izquierdo - Dorso" / "Foot Left - Dorsum"

---

## Anatomical Mapping Reference

### Directional Terminology

These terms are applied consistently across all regions:

| Term | Spanish | Definition | Usage |
|---|---|---|---|
| **Anterior** | Anterior | Front/ventral, toward the face | Neck, torso, thigh, shin, ankle |
| **Posterior** | Posterior | Back/dorsal, toward the back | Neck, back, thigh, calf, ankle |
| **Superior** | Superior | Upper/proximal, toward the head | Shoulder, dorsal, lumbar, SI joint, glute, knee |
| **Inferior** | Inferior | Lower/distal, toward the feet | Shoulder, SI joint, glute |
| **Proximal** | Proximal | Closer to shoulder (arm only) | Arm (biceps/triceps region) |
| **Distal** | Distal | Closer to hand (arm only) | Arm (elbow-adjacent) |
| **Medial** | Medial | Toward center/midline | Groin (adductors), knee (MCL) |
| **Lateral** | Lateral | Away from center/outward | Forearm, ankle, knee (LCL) |
| **Anterolateral** | Anterolateral | Front-outer quadrant | Forearm, ankle |
| **Posterolateral** | Posterolateral | Back-outer quadrant | Forearm, ankle |
| **Palmar** | Palmar | Palm side of hand | Hand (flexors, grasp) |
| **Dorsal** | Dorsal | Back of hand/foot | Hand, foot (extensors) |
| **Planta** | Planta | Sole of foot | Foot (plantar fascia) |

---

## UI Display Implementation

### Short Display Format (Single Line)

```
"{Region} {Side} - {Subdivision}"
```

**Examples**:
- "Hombro Izquierdo - Superior"
- "Muslo Derecho - Anterior"
- "Tobillo Izquierdo - Anterolateral"

### Extended Display Format (With Description)

```
"{Region} {Side} - {Subdivision} ({Anatomical Location})"
```

**Examples**:
- "Hombro Izquierdo - Superior (Deltoid & Rotator Cuff)"
- "Tobillo Derecho - Anterolateral (Ankle Sprain Area)"
- "Mano Izquierda - Palma (Carpal Tunnel Region)"

### Component Implementation

```typescript
// UX Component: DisplayRegionName
interface RegionNameProps {
  regionId: string;  // "shoulder_left_superior"
  format?: 'short' | 'extended';  // default: 'short'
  language?: 'es' | 'en';  // default: 'es'
}

function displayRegionName(id: string, format: 'short' | 'extended' = 'short'): string {
  const [primary, side, subdivision] = id.split('_');
  
  const regionName = getRegionName(primary, language);
  const sideName = side === 'left' ? 'Izquierdo' : 'Derecho';
  const subdivisionName = getSubdivisionName(subdivision, language);
  
  if (format === 'short') {
    return `${regionName} ${sideName} - ${subdivisionName}`;
  }
  
  const anatomicalContext = getAnatomicalContext(id);
  return `${regionName} ${sideName} - ${subdivisionName} (${anatomicalContext})`;
}

// Example usage
displayRegionName('shoulder_left_superior', 'short', 'es');
// Returns: "Hombro Izquierdo - Superior"

displayRegionName('shoulder_left_superior', 'extended', 'es');
// Returns: "Hombro Izquierdo - Superior (Deltoid & Rotator Cuff)"
```

---

## Abbreviation Standards

For compact UI displays (tables, charts, lists), use abbreviated forms:

| Region | Abbr | Subdivision | Abbr | Example |
|---|---|---|---|---|
| Cuello | Cu | Anterior | A | Cu.Izq.A |
| Hombro | Ho | Superior | S | Ho.Der.S |
| Brazo | Br | Proximal | P | Br.Izq.P |
| Antebrazo | An | Anterolateral | AL | An.Der.AL |
| Mano | Ma | Palma | Pl | Ma.Izq.Pl |
| Dorsales | Do | Superior | S | Do.Der.S |
| Lumbares | Lu | Inferior | I | Lu.Izq.I |
| Zona Sacroilíaca | ZS | Superior | S | ZS.Der.S |
| Glúteo | Gl | Superior | S | Gl.Izq.S |
| Ingle | In | Medial | M | In.Der.M |
| Muslo | Mu | Anterior | A | Mu.Izq.A |
| Rodilla | Ro | Lateral | L | Ro.Der.L |
| Canilla | Ca | Anterior | A | Ca.Izq.A |
| Tobillo | To | Anterolateral | AL | To.Der.AL |
| Pie | Pi | Dorso | D | Pi.Izq.D |

**Format**: `{Region}.{Side}.{Subdivision}`

**Side Abbreviations**: `Izq` (Izquierdo/Left), `Der` (Derecho/Right)

---

## TypeScript Data Model

```typescript
// Subdivision configuration for all 15 regions
const SUBDIVISION_CATALOG = {
  neck: {
    primary: { es: 'Cuello', en: 'Neck' },
    subdivisions: [
      { id: 'anterior', es: 'Anterior', en: 'Anterior', anatomical: 'Front/Cervical' },
      { id: 'posterior', es: 'Posterior', en: 'Posterior', anatomical: 'Back/Nuchal' }
    ]
  },
  shoulder: {
    primary: { es: 'Hombro', en: 'Shoulder' },
    subdivisions: [
      { id: 'superior', es: 'Superior', en: 'Superior', anatomical: 'Acromion/Rotator Cuff' },
      { id: 'inferior', es: 'Inferior', en: 'Inferior', anatomical: 'Axilla/Subscapular' }
    ]
  },
  arm: {
    primary: { es: 'Brazo', en: 'Arm' },
    subdivisions: [
      { id: 'proximal', es: 'Proximal', en: 'Proximal', anatomical: 'Biceps/Triceps' },
      { id: 'distal', es: 'Distal', en: 'Distal', anatomical: 'Brachialis/Elbow-Adjacent' }
    ]
  },
  // ... continue for all 15 regions
};

// Helper function to get display name
function getDisplayName(regionId: string, language: 'es' | 'en' = 'es'): string {
  const [primary, side, subdivision] = regionId.split('_');
  const config = SUBDIVISION_CATALOG[primary as keyof typeof SUBDIVISION_CATALOG];
  
  if (!config) return regionId;
  
  const primaryName = config.primary[language];
  const sideName = side === 'left' 
    ? (language === 'es' ? 'Izquierdo' : 'Left') 
    : (language === 'es' ? 'Derecho' : 'Right');
  
  const subdivisionConfig = config.subdivisions.find(s => s.id === subdivision);
  const subdivisionName = subdivisionConfig?.[language] || subdivision;
  
  return `${primaryName} ${sideName} - ${subdivisionName}`;
}
```

---

## Consistency Checklist

When implementing subdivisions:

- [ ] All 15 primary regions have exactly 2 subdivisions each
- [ ] All 60-region IDs follow `{primary}_{side}_{subdivision}` format
- [ ] All subdivision names are consistent across both sides
- [ ] Anatomical terms only use approved directional terminology
- [ ] Spanish names use standard anatomical terminology
- [ ] English names are clinically appropriate
- [ ] Abbreviation keys are uniquely unambiguous
- [ ] UI displays are consistent across all pages
- [ ] Statistics displays handle the new 60-region naming
- [ ] SVG body diagram annotations match naming conventions
- [ ] Search/filter functionality handles partial name matches
- [ ] No region subdivision is used in both front/back views (except 8 universal regions)

---

## References

- [REGION-IDS-SCHEMA.md](REGION-IDS-SCHEMA.md) - All 60 region IDs with anatomical names
- [BACKWARD-COMPATIBILITY.md](BACKWARD-COMPATIBILITY.md) - Legacy → new ID mapping
- [../spec.md](../spec.md) - Complete feature specification
- [../tasks.md](../tasks.md) - Implementation task breakdown

---

## Approval & Sign-Off

**Document**: SUBDIVISIONS-NAMING.md  
**Version**: 1.0  
**Created**: 2026-02-25  
**Status**: Ready for Implementation  

**Key Decisions**:
- ✅ Two subdivisions per region (avoids excessive granularity)
- ✅ Anatomical terms based on clinical pain pattern differences
- ✅ Consistent directional terminology across all regions
- ✅ Spanish names follow standard anatomical terminology
- ✅ Ready for SVG diagram annotation and UI implementation

