# Feature Specification: Anatomical Refinement - Body Parts Granularity

**Feature Branch**: `002-anatomical-refinement`  
**Created**: 2026-02-25  
**Status**: Draft  
**Input**: User request: Refactor body parts catalog to use more granular anatomical divisions with left/right subdivisions for each major body region

## Overview

Enhance the body parts tracking system by reorganizing the anatomy into 15 primary anatomical regions, each with left and right subdivisions (30 tracking areas total). This provides more precise pain localization while maintaining intuitive UI navigation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record Pain with Granular Anatomical Regions (Priority: P1)

User wants to specify pain with greater anatomical precision. They open the pain tracker and interact with 15 major body regions:
- **Neck**: Left, Right
- **Shoulders**: Left, Right  
- **Arms** (Shoulder to Elbow): Left, Right
- **Forearms**: Left, Right
- **Hands**: Left, Right
- **Dorsal/Upper Back**: Left, Right
- **Lumbar/Lower Back**: Left, Right
- **Sacroiliac Zone**: Left, Right
- **Gluteal** (Back View Only): Left, Right
- **Inguinal/Groin** (Front View Only): Left, Right
- **Thighs**: Left, Right
- **Knees**: Left, Right
- **Shins** (Front) / **Calves** (Back): Left, Right
- **Ankles**: Left, Right
- **Feet**: Left, Right

**Why this priority**: Affects core pain recording functionality and determines accuracy of health data.

**Independent Test**: Open pain tracker, select granular body parts (e.g., "Left Arm" instead of "Left Bicep"), record intensities, verify both front and back views display appropriate regions.

**Acceptance Scenarios**:

1. **Given** user views pain tracker front view, **When** they look at arms section, **Then** they see left and right arm regions as distinct clickable areas (not bicep/tricep separate)
2. **Given** user views pain tracker back view, **When** they select gluteal region, **Then** only left/right gluteal areas appear (not on front view)
3. **Given** user views pain tracker front view, **When** they look at lower torso, **Then** left/right inguinal regions appear (not on back view)
4. **Given** user clicks on a granular body part (e.g., "Left Forearm"), **When** they set pain intensity and confirm, **Then** data is saved with clear anatomical label "Left Forearm: Level 7"
5. **Given** user has previous pain data in old format (e.g., specific "Left Bicep"), **When** they load the app, **Then** old data maps to new granular regions or displays migration notice

---

### User Story 2 - Statistics Dashboard Shows Refined Body Regions (Priority: P2)

User views statistics and sees pain rankings based on the new granular regions. The top 10 most painful areas now reflect the 15-region structure with L/R variations.

**Acceptance Scenarios**:

1. **Given** user navigates to statistics page, **When** they view top 10 painful areas, **Then** results show specific regions like "Left Arm", "Right Knee", "Lumbar Left" with accurate counts
2. **Given** multiple entries exist for related regions, **When** statistics calculate rankings, **Then** left and right versions are tracked separately (e.g., "Left Arm" ranks 2nd, "Right Arm" ranks 5th)

---

## Functional Requirements

1. **Body Parts Catalog Refactoring**
   - Create new body parts map with 15 primary regions × 2 (L/R) = 30 trackable areas
   - Map: `neck_left`, `neck_right`, `shoulder_left`, `shoulder_right`, `arm_left`, `arm_right`, `forearm_left`, `forearm_right`, `hand_left`, `hand_right`, `dorsal_left`, `dorsal_right`, `lumbar_left`, `lumbar_right`, `sacroiliac_left`, `sacroiliac_right`, `gluteal_left`, `gluteal_right` (back only), `groin_left`, `groin_right` (front only), `thigh_left`, `thigh_right`, `knee_left`, `knee_right`, `shin_left`, `shin_right`, `ankle_left`, `ankle_right`, `foot_left`, `foot_right`

2. **SVG Diagram Updates**
   - Restructure front body diagram to show 15 regions (excluding gluteal, including groin)
   - Restructure back body diagram to show 15 regions (excluding groin, including gluteal)
   - Ensure anatomically correct positioning for each region
   - Update clickable circles/areas to map to new region IDs

3. **Data Model Migration**
   - Determine migration strategy for existing pain entries (map old parts to new granular parts or preserve as legacy)
   - Update `PainEntry` data model if needed to support new region IDs
   - Ensure tests verify data integrity after migration

4. **UI/UX Updates**
   - Update pain slider labels and feedback to show full region name (e.g., "Left Arm" instead of "Left Bicep")
   - Verify tab navigation (Front View / Back View) correctly filters regions
   - Update legend colors to work with new region count

5. **Statistics Calculation**
   - Verify aggregation logic correctly counts pain by new granular regions
   - Ensure top 10 ranking works correctly with 30 possible regions

## Success Criteria

1. User can record pain with 15 granular anatomical regions (left/right subdivisions)
2. Front view displays only front-appropriate regions; back view displays only back-appropriate regions
3. All 30 new regions are clickable and save pain data correctly
4. Statistics dashboard shows accurate rankings for new granular regions
5. No regression: existing functionality (slider dialog, pain persistence, history CRUD) remains intact
6. Production build size increases by <5% (currently ~92 KB)
7. All pages compile with zero TypeScript errors

## Key Entities

**BodyPart** (updated structure):
- `id`: `neck_left` | `neck_right` | `shoulder_left` | `shoulder_right` | ... (15 regions × 2)
- `anatomicalName`: Spanish translation (e.g., "Cuello Izquierdo", "Brazo Derecho")
- `abbreviation`: Short form (e.g., "Cuello Izq.", "Brazo Der.")
- `location`: `front` | `back`
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

