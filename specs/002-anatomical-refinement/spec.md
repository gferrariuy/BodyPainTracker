# Feature Specification: Anatomical Refinement - Body Parts Granularity

**Feature Branch**: `002-anatomical-refinement`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User request: Refactor body parts catalog to use more granular anatomical divisions with triple-level hierarchy: 15 regions → left/right → 2 subdivisions each

## Overview

Enhance the body parts tracking system by reorganizing the anatomy into a **hierarchical 3-level structure**:
- **Level 1 (Primary Regions)**: 15 anatomical areas (Neck, Shoulders, Arms, etc.)
- **Level 2 (Laterality)**: Each region splits into **Left and Right** 
- **Level 3 (Sub-regions)**: Each left/right part further splits into **2 subdivisions**

This creates **60 total trackable pain locations** (15 × 2 × 2), providing highly precise pain localization.

## Body Part Hierarchy

### Level 1 → Level 2 → Level 3 Structure:

1. **Cuello (Neck)**
   - Izquierdo: Anterior, Posterior
   - Derecho: Anterior, Posterior

2. **Hombro (Shoulder)**
   - Izquierdo: Superior, Inferior
   - Derecho: Superior, Inferior

3. **Brazo (Arm - Shoulder to Elbow)**
   - Izquierdo: Proximal, Distal
   - Derecho: Proximal, Distal

4. **Antebrazo (Forearm)**
   - Izquierdo: Anterolateral, Posterolateral
   - Derecho: Anterolateral, Posterolateral

5. **Mano (Hand)**
   - Izquierda: Palma, Dorso
   - Derecha: Palma, Dorso

6. **Dorsales (Upper Back)**
   - Izquierdo: Superior, Inferior
   - Derecho: Superior, Inferior

7. **Lumbares (Lower Back)**
   - Izquierdo: Superior, Inferior
   - Derecho: Superior, Inferior

8. **Zona Sacroilíaca (Sacroiliac Zone)**
   - Izquierdo: Superior, Inferior
   - Derecho: Superior, Inferior

9. **Glúteo (Gluteal) - Back View Only**
   - Izquierdo: Superior, Inferior
   - Derecho: Superior, Inferior

10. **Ingle (Inguinal/Groin) - Front View Only**
    - Izquierda: Medial, Lateral
    - Derecha: Medial, Lateral

11. **Muslo (Thigh)**
    - Izquierdo: Anterior, Posterior
    - Derecho: Anterior, Posterior

12. **Rodilla (Knee)**
    - Izquierda: Lateral, Medial
    - Derecha: Lateral, Medial

13. **Canilla/Pantorrilla (Shin/Calf)**
    - Izquierda: Anterior, Posterior
    - Derecha: Anterior, Posterior

14. **Tobillo (Ankle)**
    - Izquierdo: Anterolateral, Posterolateral
    - Derecho: Anterolateral, Posterolateral

15. **Pie (Foot)**
    - Izquierdo: Dorso, Planta
    - Derecho: Dorso, Planta

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Pain with Highly Granular Anatomical Regions (Priority: P1)

User wants to specify pain with maximum anatomical precision. They open the pain tracker and can pinpoint pain to very specific sub-regions (60 possible locations). For example, differentiating between "Left Shoulder - Superior" vs "Left Shoulder - Inferior", or "Left Calf - Anterior" vs "Left Calf - Posterior".

**Why this priority**: Affects core pain recording functionality and determines diagnostic accuracy of health data.

**Independent Test**: Open pain tracker, navigate through the 3-level hierarchy (region → side → subdivision), select specific pain locations, verify all 60 areas are accessible and save correctly.

**Acceptance Scenarios**:

1. **Given** user clicks on "Hombro Izquierdo (Left Shoulder)" on front view, **When** the region expands or shows subdivisions, **Then** they see two options: "Superior" and "Inferior"
2. **Given** user selects "Hombro Izquierdo - Superior", **When** they set pain intensity and confirm, **Then** data is saved as "Left Shoulder - Superior: Level 6"
3. **Given** user has recorded pain in "Left Shoulder - Inferior" previously, **When** they return to that area today, **Then** the existing pain level is displayed for adjustment
4. **Given** user views the back diagram, **When** they click on "Glúteo" region, **Then** "Left Gluteal" and "Right Gluteal" subdivisions appear (not on front view)
5. **Given** user views the front diagram and scrolls to lower abdomen, **When** they look for "Ingle" region, **Then** only "Left Groin" and "Right Groin" appear (not on back view)
6. **Given** user accesses the pain tracker, **When** they interact with different body regions, **Then** each of the 60 anatomical areas is independently clickable and can store a unique pain value

---

### User Story 2 - Statistics Dashboard Shows Precise Body Region Rankings (Priority: P2)

User views statistics and sees pain rankings based on the new 60-area structure. Top 10 most painful areas can now distinguish between left vs right and between subdivisions (superior/inferior, anterior/posterior, etc.).

**Acceptance Scenarios**:

1. **Given** user navigates to statistics page, **When** they view top 10 painful areas, **Then** results show specific sub-region labels like "Left Shoulder - Superior", "Right Calf - Anterior", "Lumbar Left - Inferior" with accurate pain frequency/intensity
2. **Given** user has pain recorded in both "Left Arm - Proximal" and "Left Arm - Distal", **When** statistics calculate, **Then** these are ranked separately (e.g., "Left Arm - Proximal" ranks 3rd, "Left Arm - Distal" ranks 8th)
3. **Given** user filters by time period (This Week / This Month), **When** top 10 regenerates, **Then** rankings reflect only data from the selected period for the specific 60 sub-regions

---

## Functional Requirements

1. **Body Parts Catalog Hierarchical Refactoring**
   - Create new body parts map with 3-level hierarchy: 15 primary regions × 2 sides × 2 subdivisions = 60 trackable areas
   - Map IDs: `neck_left_anterior`, `neck_left_posterior`, `neck_right_anterior`, `neck_right_posterior`, `shoulder_left_superior`, `shoulder_left_inferior`, ... (60 total)
   - Include human-readable names in Spanish for all 60 areas
   - Define `location` (front|back) for each area to control visibility per view
   - Special handling: Glúteo regions only on back, Ingle regions only on front

2. **SVG Diagram Updates**
   - Redesign front body diagram with 30 clickable regions (15 primary areas × 2 sides), excluding gluteal and groin subdivisions
   - Redesign back body diagram with 30 clickable regions (15 primary areas × 2 sides), excluding groin subdivisions, including gluteal
   - When user clicks a region, show popup/modal with 2 subdivision options
   - Ensure anatomically correct positioning for hierarchy levels
   - Support 2-stage interaction: primary region click → subdivision selection → pain slider

3. **Data Model Updates**
   - Update `BodyPartEntry` to store reference to specific sub-region ID (e.g., `shoulder_left_superior`)
   - Maintain backward compatibility with old format or provide clear migration path
   - Ensure `PainEntry` correctly links to new 60-area catalog

4. **UI/UX Updates**
   - Pain slider label shows complete path: "Hombro Izquierdo - Superior" instead of just "Hombro"
   - Tab navigation (Vista Frontal / Vista Trasera) correctly hides gluteal on front and groin on back
   - Legend colors work with 60 possible regions
   - Consider keyboard navigation for sub-region selection

5. **Statistics Calculation**
   - Aggregation logic counts pain by exact 60-area sub-regions
   - Top 10 ranking works correctly with 60 possible areas
   - Period filtering (week/month) applies to sub-region rankings

## Success Criteria

1. User can record pain with 60 granular anatomical sub-regions (15 regions × 2 side × 2 subdivisions)
2. Front view displays 30 regions (excludes gluteal, excludes groin subdivisions); back view displays 30 regions (includes gluteal, excludes groin)
3. All 60 sub-regions are independently accessible, clickable, and save unique pain data
4. Statistics dashboard accurately ranks all 60 regions separately
5. Sub-region names are anatomically correct and displayed in Spanish
6. No regression: existing functionality (slider dialog, tabs, persistence, history CRUD) works as before
7. Production build size increases by <10% (currently ~92 KB)
8. All pages compile with zero TypeScript errors

## Key Entities

**BodyPartCatalog** (new hierarchical structure):
- `id`: `neck_left_anterior` | `neck_left_posterior` | `shoulder_left_superior` | ... (60 unique IDs)
- `anatomicalName`: 3-level label in Spanish (e.g., "Cuello Izquierdo - Anterior")
- `abbreviation`: Short form (e.g., "Cuello Izq. Ant.")
- `location`: `front` | `back`
- `region`: Primary region ID (e.g., `neck` for grouping within statistics/history)
- `side`: `left` | `right`
- `subdivision`: Sub-area identifier (e.g., `anterior`, `posterior`, `superior`, `inferior`, `proximal`, `distal`, etc.)

## Assumptions

1. Spanish language translations for all 60 anatomical sub-regions are available or derived systematically
2. Users can intuitively navigate 2-stage selection (region → subdivision) without confusion
3. Existing pain entries (if any) are acceptable to migrate or clear
4. UI complexity for 2-stage selection is acceptable vs. flat list of 60 buttons
5. No API/backend implications (client-side only app)

## Out of Scope

- Bilateral data correlation analysis
- Machine learning pain pattern detection
- Export of exact coordinates for medical use
- Print-friendly anatomical maps

## Dependencies

- Depends on: `001-body-pain-tracker` (core pain recording system)
- Affects: Statistics calculation, data visualization, history display

## Testing Strategy

- **Unit Tests**: Hierarchical catalog structure, ID generation, 60-region lookups
- **Integration Tests**: Pain recording with all 60 sub-regions, data persistence
- **E2E Tests**: Full workflow: primary region click → subdivision selection → intensity slider → save → verify in statistics
- **Migration Tests**: Old 30-region format → new 60-region format (if applicable)
- **Accessibility Tests**: Keyboard navigation through 3-level hierarchy, ARIA labels for all regions
- `side`: `left` | `right` | `center` (for symmetric regions if needed)
- `category`: grouping for UI organization

## Assumptions

1. Spanish language translations for all new anatomical terms are available or can be generated
2. Existing pain tracking data is acceptable to keep or migrate automatically
3. User interface complexity is acceptable for adding more clickable regions
4. No API/backend implications (client-side only app)
5. Performance impact of 30 regions vs. 40+ current regions is negligible

## Out of Scope

- Mobile app design (web-only initially)
- Custom region upload
- Bilateral pain correlation analysis
- Custom measurement standards (e.g., percentage scales)

## Dependencies

- Depends on: `001-body-pain-tracker` (existing pain recording system)
- Affects: Statistics calculation, data visualization, migration tooling

## Testing Strategy

- **Unit Tests**: Body parts catalog mappings, data aggregation with new regions
- **Integration Tests**: Pain recording with new regions persists correctly
- **E2E Tests**: Full user flow: record → statistics → history with new regions
- **Migration Tests**: Old data format → new format (if applicable)

