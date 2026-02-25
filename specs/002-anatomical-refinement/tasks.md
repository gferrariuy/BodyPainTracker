---
description: "Task list for Anatomical Refinement - Body Parts Granularity feature"
---

# Tasks: Anatomical Refinement - Body Parts Granularity

**Feature Branch**: `002-anatomical-refinement`  
**Input**: Specification from `/specs/002-anatomical-refinement/spec.md`  
**Status**: Ready for Implementation  
**Total Tasks**: 35  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2)
- File paths shown as relative to project root

---

## Phase 1: Setup & Planning (Shared Infrastructure)

**Purpose**: Project setup and data migration strategy

**✅ COMPLETE** - Phase 1 finished 2026-02-25

- [x] T001 Create backup of existing body-parts.ts and data migration plan in MIGRATION.md
- [x] T002 Design 60-region IDs schema document with complete mapping (15 regions × 2 sides × 2 subdivisions)
- [x] T003 [P] Plan backward compatibility: map legacy 30-region IDs to new 60-region IDs in src/lib/migration-utils.ts structure
- [x] T004 Document subdivision naming conventions (anatomical terms) for all 15 regions in src/lib/body-parts-hierarchy.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure for 60-region catalog system

**🔄 IN PROGRESS** - Started 2026-02-25

**⚠️ CRITICAL**: Must complete before user story implementation

- [ ] T005 Create comprehensive body parts catalog with 60 regions in src/lib/body-parts-refined.ts
  - Define all 60 region IDs: `neck_left_anterior`, `neck_left_posterior`, ..., `foot_right_planta`
  - Include Spanish names and abbreviations for all 60
  - Define location (front|back) for visibility control
  - Tag: Glúteo regions back-only, Ingle regions front-only

- [ ] T006 [P] Update data models in src/lib/data-models.ts
  - Extend `BodyPartEntry` to include region hierarchy info
  - Ensure backward compatibility with legacy entries
  - Update `PainEntry` type to reference 60-region IDs

- [ ] T007 [P] Create region grouping utility in src/lib/body-parts-utils.ts
  - Function: get primary region from sub-region ID
  - Function: get subdivisions for a primary region
  - Function: filter regions by location (front/back)

- [ ] T008 [P] Create data migration utilities in src/lib/migrate-pain-data.ts
  - Function: migrate legacy 30-region data to 60-region format
  - Function: map old region IDs to primary region + subdivision
  - Add timestamp for migration tracking

- [ ] T009 Update usePainData hook in src/lib/hooks/usePainData.ts
  - Support both legacy (30-region) and new (60-region) formats
  - Auto-migrate on first load if old format detected
  - Maintain all existing CRUD operations for new format

**Checkpoint**: Foundation complete - User story implementation can begin

---

## Phase 3: User Story 1 - Record Pain with Highly Granular Regions (Priority: P1) 🎯 MVP

**Goal**: Users can record pain for all 60 anatomical sub-regions with 2-stage selection (region → subdivision → intensity)

**Independent Test**: 
1. Open pain tracker (front view)
2. Click on "Hombro Izquierdo" → see "Superior" and "Inferior" options
3. Select "Superior" → pain slider appears
4. Set intensity to 7 → Confirm
5. Verify data saved as "Hombro Izquierdo - Superior: 7"
6. Switch to back view, click "Glúteo Izquierdo" → see two subdivisions
7. Verify in History that all 60 areas can be recorded independently

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create SubdivisionSelector modal component in src/components/SubdivisionSelector.tsx
  - Display 2 subdivision options for selected primary region
  - Accept selected primary region as prop
  - Return selected subdivision to parent
  - Include Cancel button with keyboard ESC support
  - ARIA labels for accessibility

- [ ] T011 [P] [US1] Update PainSlider component in src/components/PainSlider.tsx
  - Accept full 60-region ID (e.g., `shoulder_left_superior`) instead of simple ID
  - Display complete 3-level anatomical name in Spanish
  - Example: "Hombro Izquierdo - Superior" (was "Left Shoulder")

- [ ] T012 [P] [US1] Refactor BodySVGDiagram in src/components/BodySVGDiagram.tsx
  - Change from 30-region circles to 30 primary region clickable areas (15 regions × 2 sides)
  - When user clicks region: show SubdivisionSelector modal
  - From modal: capture subdivision selection → open PainSlider with full ID
  - Update SVG positioning for clarity with 30 clickable areas

- [ ] T013 [P] [US1] Update recorder page in src/pages/index.tsx
  - Integrate new 2-stage interaction (region → subdivision → intensity)
  - Pass full 60-region ID to recordPain function
  - Update error handling for new region format
  - Verify front/back view filtering (exclude gluteal from front, groin from back)

- [ ] T014 [US1] Test 2-stage interaction flow
  - Manually verify: primary region click → subdivision options → intensity slider → save
  - Test all 15 regions on front view
  - Test all 15 regions on back view
  - Verify gluteal/groin filtering per view

- [ ] T015 [US1] Update History page in src/pages/history.tsx
  - Display full 60-region names (e.g., "Hombro Izquierdo - Superior")
  - Show subdivision hierarchy clearly
  - Verify CRUD operations work with new 60-region format

- [ ] T016 [US1] Add helper function to format region display name in src/lib/body-parts-utils.ts
  - Input: 60-region ID (e.g., `shoulder_left_superior`)
  - Output: Spanish anatomical name (e.g., "Hombro Izquierdo - Superior")
  - Used throughout pain slider, history, and statistics

**Checkpoint**: User Story 1 complete - Can record pain for all 60 regions independently

---

## Phase 4: User Story 2 - Statistics Dashboard with 60-Region Rankings (Priority: P2)

**Goal**: Statistics page accurately ranks top 10 regions from the new 60-region catalog

**Independent Test**:
1. Record pain in 5+ different sub-regions (e.g., Left Shoulder Superior, Right Knee Lateral, etc.)
2. Navigate to statistics page
3. Verify top 10 shows correct sub-region names (not just primary regions)
4. Verify rankings separate left from right (e.g., "Left Arm - Proximal" vs "Right Arm - Distal")
5. Filter by week/month and verify rankings update correctly

### Implementation for User Story 2

- [ ] T017 [P] [US2] Update calculateStatistics function in src/lib/aggregation.ts
  - Change from grouping by 30-region IDs to 60-region IDs
  - Ensure each sub-region is ranked separately
  - Prevent combining left/right or anterior/posterior in rankings
  - Example: "Hombro Izquierdo - Superior" and "Hombro Izquierdo - Inferior" rank independently

- [ ] T018 [P] [US2] Update StatisticsRecord data model in src/lib/data-models.ts
  - Extend to include full 60-region ID reference
  - Support subdivision field for clarity
  - Maintain frequency and averageIntensity calculations per exact sub-region

- [ ] T019 [US2] Update statistics page in src/pages/statistics.tsx
  - Use new 60-region display names (with Spanish 3-level labels)
  - Verify period filtering (week/month) applies to 60-region rankings
  - Update top 10 display to show full anatomical names
  - Color legend works with 60 total regions

- [ ] T020 [US2] Update stats card component (if separate) or inline stats display
  - Display "Hombro Izquierdo - Superior" instead of generic "Hombro"
  - Show frequency and average for specific sub-region
  - Rank positioning (1st, 2nd, etc.) based on new aggregation

- [ ] T021 [US2] Test statistics aggregation with 60 regions
  - Record pain in multiple sub-regions with different intensities
  - Verify top 10 rankings are correct and separated by subdivision
  - Test week vs month filtering
  - Verify no regression from 30-region system

**Checkpoint**: User Story 2 complete - Statistics accurately show 60-region rankings

---

## Phase 5: Data Migration & Backward Compatibility

**Purpose**: Handle transition from 30-region to 60-region system

- [ ] T022 [P] Implement data migration on first app load in src/lib/hooks/usePainData.ts
  - Detect legacy 30-region format in localStorage
  - Auto-migrate to 60-region format using migration utilities
  - Log migration stats (how many entries migrated)
  - Preserve dates and intensity values during migration

- [ ] T023 [P] Add migration UI notification (optional banner)
  - Show one-time message if migration occurred
  - Confirm data was migrated successfully
  - Provide option to view migration summary

- [ ] T024 Test data migration scenarios
  - Migrate app with no existing data → should start fresh with 60 regions
  - Migrate app with 30-region data → verify all entries map to new 60 regions
  - Verify no data loss during migration
  - Test both front-view and back-view regions after migration

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, testing, and deployment readiness

- [ ] T025 [P] Verify SVG diagram accuracy
  - Confirms all 30 primary regions (front view) are clickable and positioned correctly
  - Confirm all 30 primary regions (back view) are clickable and positioned correctly
  - Test on mobile (320px) and desktop (2560px) viewports
  - Verify touch/click responsiveness

- [ ] T026 [P] Accessibility audit
  - ARIA labels for all 60 regions in SVG
  - Keyboard navigation: Tab through primary regions, arrow keys for subdivisions
  - Test with screen reader (WAVE, axe DevTools)
  - Verify contrast ratios for subdivision modal

- [ ] T027 [P] Performance testing
  - Verify build size increase is <10% (currently ~92 KB)
  - Check memory usage with 60-region catalog in memory
  - Verify no runtime performance regression
  - Test statistics calculation speed with large datasets

- [ ] T028 [P] TypeScript compilation check
  - Run `npm run build` and verify zero TypeScript errors
  - Type-check all new utility functions
  - Verify data-models are fully typed for 60-region system

- [ ] T029 [P] Update documentation
  - Update README.md with new 60-region feature
  - Document migration process for existing users
  - Update IMPLEMENTATION_SUMMARY.md with anatomical refinement details
  - Document 2-stage selection UX in user-facing docs

- [ ] T030 Test full user journeys (E2E)
  - Journey 1: First-time user records pain in 5 different sub-regions, views stats, checks history
  - Journey 2: Returning user (migrated from 30-region system) records additional pain, verifies clean migration
  - Journey 3: User switches between front/back views, records in gluteal (back only) and groin (front only)
  - Verify no regressions in existing features (time period filtering, CRUD, localStorage persistence)

- [ ] T031 [P] Create migration summary document
  - Document all breaking changes from 30-region to 60-region system
  - Reference migration utilities and automatic migration process
  - Provide fallback instructions if manual migration needed

- [ ] T032 Build and test production bundle
  - Run `npm run build`
  - Verify static export (out/ folder) is complete
  - Test bundle size increase
  - Verify no console errors in production build

- [ ] T033 Final review checklist
  - ✅ All 60 regions accessible and saveable
  - ✅ Statistics rankings show all 60 regions separately
  - ✅ Front/back view filtering works (gluteal, groin)
  - ✅ No TypeScript errors
  - ✅ No regression in existing features
  - ✅ Data migrated from 30-region system
  - ✅ Build size <10% increase
  - ✅ Documentation updated

- [ ] T034 Commit and push feature branch
  - Commit all changes: "feat: implement anatomical refinement with 60-region granularity"
  - Push to 002-anatomical-refinement branch
  - Prepare pull request description with migration notes

- [ ] T035 Create pull request and notify stakeholders
  - PR title: "Refactor pain tracking with 60-region anatomical precision"
  - PR description: Summary of changes, migration process, testing performed
  - Request review from team

---

## Task Dependencies

```
T001-T004 (Setup) 
  ↓
T005-T009 (Foundational - REQUIRED before user stories)
  ↓
┌─────────────────────────────────────────┐
│ Parallel User Story Tracks              │
├─────────────────────────────────────────┤
│ T010-T016 (US1: Record Granular Pain)   │  → Can run in parallel
│ T017-T021 (US2: Statistics Rankings)    │  → Can run in parallel
└─────────────────────────────────────────┘
  ↓
T022-T024 (Data Migration)
  ↓
T025-T035 (Polish & Deployment)
```

## Parallel Execution Opportunities

**Can implement simultaneously** (different files, minimal dependencies):

- **Data Model Phase**: T005 (catalog), T006 (models), T007 (utils), T008 (migration) - all independent file creation
- **US1 Components**: T010 (modal), T011 (slider), T012 (diagram), T013 (page) - mostly independent components
- **US2 Functions**: T017 (aggregation), T018 (data model ext), T019 (page) - can work in parallel once T005-T009 complete
- **Polish Phase**: T025-T031 - all independent reviews and documentation

**Recommend Timeline**:
- **Day 1**: Complete T001-T009 (foundational)
- **Days 2-3**: Execute US1 (T010-T016) and US2 (T017-T021) in parallel
- **Day 4**: Execute data migration and polish (T022-T035)

---

## Success Metrics

✅ All 60 anatomical sub-regions independently accessible and saveable  
✅ Statistics correctly rank 60 regions separately (no aggregation across subdivisions)  
✅ Front view excludes gluteal; back view excludes groin (view-specific filtering works)  
✅ Zero TypeScript errors in build  
✅ Data migration: legacy 30-region entries → new 60-region format  
✅ Build size increase <10% (remains <102 KB)  
✅ No regression in core pain recording, history management, localStorage persistence  
✅ Spanish anatomical names correct for all 60 regions  
✅ 2-stage selection UX intuitive (region click → subdivision modal → intensity slider)  

