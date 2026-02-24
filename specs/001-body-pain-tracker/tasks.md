# Development Tasks: Daily Body Pain Tracker

**Feature**: Daily Body Pain Tracker | **Branch**: `001-body-pain-tracker` | **Date**: 2026-02-24

**Status**: Ready for Implementation | **Total Tasks**: 28 | **Estimated Duration**: 2-3 weeks (MVP)

---

## Overview

This document decomposes the feature specification and implementation plan into executable tasks organized by phase and user story. Tasks are independently testable and dependencies are clearly marked for parallel execution planning.

## Dependency Graph & User Story Order

```
Phase 1: Setup (2-3 tasks)
    ↓
Phase 2: Foundational (4 tasks) - Shared across all stories
    ├─→ Phase 3: US1 (Recorder) [P1] (7-8 tasks) - BLOCKS US2 & US3
    │   ├─→ Phase 4: US2 (Statistics) [P2] (6-7 tasks) - Depends on US1 data
    │   └─→ Phase 5: US3 (History) [P3] (4-5 tasks) - Depends on US1 data
    └─→ Phase 6: Polish & Optimization (4-5 tasks)
```

**Sequential Path (MVP)**: Setup → Foundational → US1 → US2 → US3 → Polish  
**Parallel Opportunities**: US2 and US3 UI tasks can start while US1 storage/logic is being finalized

---

## Phase 1: Project Setup

**Goal**: Initialize Next.js project with TypeScript, Tailwind CSS, and development environment  
**Duration**: 1-2 hours  
**Independent Test**: `npm install && npm run dev` starts dev server on localhost:3000 with no errors

### Tasks

- [ ] T001 Create Next.js project scaffold with static export configuration
  - Create `next.config.js` with `output: 'export'`
  - Create `tsconfig.json` for TypeScript
  - Create `tailwind.config.js` and `postcss.config.js`
  - File: `next.config.js`, `tsconfig.json`, `tailwind.config.js`

- [ ] T002 Install and configure dependencies
  - `npm install` (React 18+, Next.js 14+, TypeScript, Tailwind, testing libs)
  - `npm install --save-dev jest @testing-library/react @testing-library/jest-dom playwright @axe-core/react`
  - File: `package.json`

- [ ] T003 Set up project directory structure and initial pages
  - Create `src/pages/_app.tsx` and `src/pages/_document.tsx` (layouts)
  - Create `src/pages/index.tsx` (Recorder page stub)
  - Create `src/pages/statistics.tsx` (Statistics page stub)
  - Create `src/pages/history.tsx` (History page stub)
  - Create `src/components/`, `src/lib/`, `src/styles/` directories
  - File: `src/pages/`, `src/components/`, `src/lib/`, `src/styles/globals.css`

- [ ] T004 [P] Create global styles and Tailwind setup
  - Configure Tailwind directives in `src/styles/globals.css`
  - Add CSS reset, typography base styles
  - Create responsive breakpoint utilities
  - File: `src/styles/globals.css`, `tailwind.config.js`

- [ ] T005 [P] Configure testing infrastructure
  - Create `jest.config.js` with React Testing Library setup
  - Create `playwright.config.ts` for E2E tests
  - Create `.env.test` for test environment variables
  - File: `jest.config.js`, `playwright.config.ts`, `.env.test`

- [ ] T006 [P] Set up CI/CD pipeline (GitHub Actions or equivalent)
  - Create `.github/workflows/test-build-deploy.yml`
  - Configure: lint → type-check → test → build → Lighthouse audit
  - File: `.github/workflows/test-build-deploy.yml`

---

## Phase 2: Foundational Features (Shared Across All Stories)

**Goal**: Establish shared data models, storage layer, and utilities that all features depend on  
**Duration**: 1-2 days  
**Independent Test**: Can save/load/delete pain entries from localStorage; aggregation logic works on sample data

### Tasks

- [ ] T007 Implement localStorage wrapper (storage.ts)
  - Create `src/lib/storage.ts` with full CRUD operations
  - Functions: `loadPainTrackerData()`, `savePainTrackerData()`, `addPainEntry()`, `updatePainLevel()`, `deletePainEntry()`
  - Include error handling (QuotaExceeded, StorageDisabled)
  - File: `src/lib/storage.ts`

- [ ] T008 Define TypeScript data models (data-models.ts)
  - Create interfaces: `PainEntry`, `BodyPartEntry`, `BodyPartCatalog`, `StatisticsRecord`
  - Create `src/lib/data-models.ts` with exported types
  - File: `src/lib/data-models.ts`

- [ ] T009 Create body parts catalog (body-parts.ts)
  - Define 30+ anatomical regions (left/right, front/back)
  - Create `src/lib/body-parts.ts` with BodyPartCatalog constant
  - Include: IDs, names, categories, locations
  - File: `src/lib/body-parts.ts`

- [ ] T010 Implement date utilities (dates.ts)
  - Functions: `getTodayString()`, `getDateNDaysAgo()`, `calculatePeriodBounds()`, `isValidDate()`
  - Handle rolling period calculations (7/30 days)
  - File: `src/lib/dates.ts`

- [ ] T011 [P] Implement validation utilities (validation.ts)
  - Functions: `isValidBodyPartId()`, `isValidIntensityLevel()`, `isValidISO8601()`, `validateBodyPartEntry()`
  - File: `src/lib/validation.ts`

- [ ] T012 [P] Implement aggregation algorithm (aggregation.ts)
  - Functions: `calculateStatistics()`, `filterEntriesByPeriod()`, `aggregateByBodyPart()`, `rankByTotalIntensity()`
  - Return top 10 ranked body parts by totalIntensity
  - File: `src/lib/aggregation.ts`

### Foundational Tests

- [ ] T013 [P] Write unit tests for storage operations
  - Test: CREATE pain entry, READ by date, UPDATE intensity, DELETE entry
  - Test: Handle quota exceeded, localStorage disabled
  - File: `tests/unit/storage.test.ts`

- [ ] T014 [P] Write unit tests for aggregation logic
  - Test: Week/month period filtering, ranking by intensity, top 10 selection
  - Test: Empty data, single entry, tied rankings
  - File: `tests/unit/aggregation.test.ts`

---

## Phase 3: User Story 1 - Register Daily Body Pain [P1]

**Goal**: Enable users to record pain for selected body parts on today's date using interactive diagrams and slider controls  
**Priority**: P1 (Core MVP feature)  
**Duration**: 3-4 days  
**Independent Test**: User can click body part on diagram, adjust slider (1-10), save entry → data persists in localStorage and reloads on refresh

### Tasks

- [ ] T015 [US1] Create custom hook useLocalStorage
  - Implement `src/lib/hooks/useLocalStorage.ts`
  - Functions: `usePainData()` (custom hook for managing pain entries)
  - File: `src/lib/hooks/useLocalStorage.ts`

- [ ] T016 [US1] Design and create SVG body diagrams (front and back)
  - Create `public/body-diagram-front.svg` with 26 body regions
  - Create `public/body-diagram-back.svg` with 18 body regions
  - All regions have clickable `<path>` or `<circle>` elements with data-body-part-id attributes
  - File: `public/body-diagram-front.svg`, `public/body-diagram-back.svg`

- [ ] T017 [P] [US1] Implement BodyDiagram component
  - Create `src/components/BodyDiagram.tsx` (stateless, receives props)
  - Accepts props: `location='front' | 'back'`, `onBodyPartSelect()` callback, `selectedParts?`
  - Renders SVG, handles click events, applies CSS classes for selected/recorded states
  - File: `src/components/BodyDiagram.tsx`

- [ ] T018 [P] [US1] Implement PainSlider component
  - Create `src/components/PainSlider.tsx`
  - Slider: HTML5 `<input type="range" min="1" max="10">`
  - Shows current value, handles onChange, ESC to close
  - Accessibility: ARIA labels, keyboard support
  - File: `src/components/PainSlider.tsx`

- [ ] T019 [P] [US1] Implement BodyPartButton wrapper component
  - Create `src/components/BodyPartButton.tsx`
  - Wrapper around SVG regions for state management and visual feedback
  - Shows recorded pain level with color coding
  - File: `src/components/BodyPartButton.tsx`

- [ ] T020 [US1] Build Recorder page (index.tsx)
  - Create `src/pages/index.tsx` (main entry point)
  - Layout: Header + today's date + body diagrams (front/back in tabs or side-by-side)
  - Integrates: BodyDiagram, PainSlider, usePainData hook
  - Handles: click body part → show slider → save on confirm
  - File: `src/pages/index.tsx`

- [ ] T021 [US1] Implement pain input flow with visual feedback
  - User clicks body part → slider appears with current value (if exists)
  - User adjusts slider 1-10 → real-time visual feedback
  - User confirms → saves to localStorage, slider closes, region highlights with color (yellow/orange/red by level)
  - File: `src/pages/index.tsx` (logic), `src/components/PainSlider.tsx` (UI)

- [ ] T022 [US1] Add validation and error handling to Recorder
  - Validate intensity level 1-10 before save
  - Handle localStorage quota exceeded (show cleanup notification)
  - Handle localStorage disabled (graceful fallback, session-only data)
  - File: `src/pages/index.tsx`, `src/lib/storage.ts`

### US1 Integration Tests

- [ ] T023 [US1] Write integration test: Record pain flow
  - Test: Click body part → slider appears → adjust slider → save → data persists → page refresh → data reloads
  - File: `tests/integration/recorder-flow.test.ts`

- [ ] T024 [US1] Write E2E test: Recorder page on desktop and mobile
  - Playwright test: Open recorder → click multiple body parts → save → verify visual feedback
  - Test mobile viewport (375px), tablet (768px), desktop (1024px)
  - File: `tests/e2e/recorder.spec.ts`

---

## Phase 4: User Story 2 - View Pain Statistics Dashboard [P2]

**Goal**: Display aggregated pain data showing top 10 most painful body parts over selected time period (This Week / This Month)  
**Priority**: P2 (High value, depends on US1 data)  
**Duration**: 2-3 days  
**Independent Test**: Record entries across 5+ days → open statistics → filter by week/month → verify top 10 ranking is correct and consistent

### Tasks

- [ ] T025 [P] [US2] Implement useStatistics custom hook
  - Create `src/lib/hooks/useStatistics.ts`
  - Fetches data, calls aggregation logic, returns StatisticsResult
  - Memoizes results to prevent recalculation on every render
  - File: `src/lib/hooks/useStatistics.ts`

- [ ] T026 [P] [US2] Create PeriodFilter component
  - Create `src/components/PeriodFilter.tsx`
  - Toggle buttons: "This Week" | "This Month"
  - Emits period changes via callback
  - File: `src/components/PeriodFilter.tsx`

- [ ] T027 [US2] Create StatisticsTable component
  - Create `src/components/StatisticsTable.tsx` (ranked list of top 10)
  - Columns: Rank, Body Part Name, Total Intensity, Frequency, Average Intensity, Last Recorded
  - Responsive: Stacks on mobile, full columns on desktop
  - File: `src/components/StatisticsTable.tsx`

- [ ] T028 [US2] Create EmptyState component
  - Create `src/components/EmptyState.tsx`
  - Shows message when no data exists for selected period
  - Encourages user to record pain data
  - File: `src/components/EmptyState.tsx`

- [ ] T029 [US2] Build Statistics page (statistics.tsx)
  - Create `src/pages/statistics.tsx`
  - Layout: Header + PeriodFilter + StatisticsTable OR EmptyState
  - Integrates: useStatistics hook, PeriodFilter, StatisticsTable, EmptyState
  - File: `src/pages/statistics.tsx`

- [ ] T030 [P] [US2] Add Navigation component for page routing
  - Create `src/components/Navigation.tsx`
  - Links to: Recorder (index), Statistics, History
  - Highlight active page
  - Mobile-friendly (hamburger menu or stack)
  - File: `src/components/Navigation.tsx`

### US2 Integration Tests

- [ ] T031 [US2] Write integration test: Statistics aggregation flow
  - Test: Create entries across 7 days with varying pain levels → calculate week stats → verify top 10 ranking
  - File: `tests/integration/statistics-flow.test.ts`

- [ ] T032 [US2] Write E2E test: Statistics page filtering
  - Playwright test: Open statistics → switch week/month → verify data recalculates correctly
  - File: `tests/e2e/statistics.spec.ts`

---

## Phase 5: User Story 3 - View Recording History [P3]

**Goal**: Display chronological log of all pain entries with ability to view details, edit, and delete past records  
**Priority**: P3 (Nice-to-have, depends on US1 data)  
**Duration**: 1-2 days  
**Independent Test**: Record entries on 5+ different dates → open history → all entries display in reverse chronological order → can edit and delete

### Tasks

- [ ] T033 [P] [US3] Create HistoryTable component
  - Create `src/components/HistoryTable.tsx`
  - Displays all entries sorted by date (descending)
  - Columns: Date, Body Parts Affected, Pain Levels, Actions (Edit/Delete)
  - Responsive: Collapse details on mobile, full on desktop
  - File: `src/components/HistoryTable.tsx`

- [ ] T034 [US3] Create EditEntryModal component
  - Create `src/components/EditEntryModal.tsx`
  - Modal: Select date + body parts (with sliders) + save/cancel
  - Updates pain levels for selected date
  - File: `src/components/EditEntryModal.tsx`

- [ ] T035 [US3] Build History page (history.tsx)
  - Create `src/pages/history.tsx`
  - Layout: Header + HistoryTable OR EmptyState
  - Integrates: HistoryTable, EditEntryModal, usePainData hook
  - File: `src/pages/history.tsx`

- [ ] T036 [US3] Implement delete entry functionality with confirmation
  - Add delete confirmation dialog
  - Remove entire day's entry from localStorage
  - Update UI to reflect deletion
  - File: `src/pages/history.tsx`, `src/components/HistoryTable.tsx`

### US3 Integration Tests

- [ ] T037 [US3] Write integration test: History edit/delete flow
  - Test: Create entries → navigate to history → edit pain level → verify updated → delete entry → verify removed
  - File: `tests/integration/history-flow.test.ts`

- [ ] T038 [US3] Write E2E test: History page full workflow
  - Playwright test: Record → view history → edit → delete → verify all operations
  - File: `tests/e2e/history.spec.ts`

---

## Phase 6: Polish, Optimization & Cross-Cutting Concerns

**Goal**: Mobile optimization, accessibility compliance, performance tuning, testing coverage, documentation  
**Duration**: 2-3 days  
**Independent Test**: Lighthouse score ≥90, all tests pass, WCAG 2.1 AA compliance verified, bundle <500KB

### Tasks

- [ ] T039 [P] Optimize responsive design for mobile (320px-2560px)
  - Test on actual devices (mobile, tablet, desktop)
  - Verify touch targets ≥44x44px
  - Fix layout issues, ensure slider/buttons responsive
  - File: `src/components/*`, `src/pages/*`, `src/styles/responsive.css`

- [ ] T040 [P] Run accessibility audit (WCAG 2.1 AA)
  - Execute: `npm run test:a11y` with Axe core
  - Fix all accessibility violations: contrast, ARIA labels, semantic HTML, keyboard nav
  - File: `tests/accessibility/axe.test.ts`

- [ ] T041 [P] Optimize bundle size and performance
  - Run build: `npm run build`, check `/out` size
  - Minify CSS/JS, tree-shake unused deps
  - Verify total <500KB uncompressed
  - Run Lighthouse audit: target Performance ≥90
  - File: `next.config.js`, `tailwind.config.js`

- [ ] T042 [P] Add localStorage quota warning and auto-cleanup notification
  - Monitor usage, warn user at 80% quota
  - Implement auto-cleanup of oldest month when quota exceeded
  - Show notification confirming cleanup
  - File: `src/components/LocalStorageWarning.tsx`, `src/lib/storage.ts`

- [ ] T043 Create documentation: ARCHITECTURE.md
  - Document design decisions, tech stack rationale
  - Explain component hierarchy, data flow
  - Deployment instructions
  - File: `docs/ARCHITECTURE.md`

- [ ] T044 [P] Configure production build and deployment
  - Add deployment script (Vercel/Netlify/GitHub Pages)
  - Set environment variables for production
  - Verify static export is complete and working
  - File: `.github/workflows/deploy.yml`, `vercel.json` or `netlify.toml`

- [ ] T045 Create final integration test: Full app workflow (recorder → stats → history)
  - Record entries across multiple days → view stats → verify rankings → edit/delete from history
  - File: `tests/integration/full-workflow.test.ts`

- [ ] T046 [P] Code review and cleanup
  - Review all code for quality, style consistency
  - Run linter: `npm run lint`
  - Format code: `npm run format`
  - Remove console logs, dead code
  - File: All source files

---

## Task Execution Matrix

### By Phase (Sequential)

```
Phase 1: Setup (6 tasks) → 1-2 hours
Phase 2: Foundational (8 tasks) → 1-2 days
Phase 3: US1 Recorder (10 tasks) → 3-4 days
Phase 4: US2 Statistics (8 tasks) → 2-3 days
Phase 5: US3 History (6 tasks) → 1-2 days
Phase 6: Polish (8 tasks) → 2-3 days
─────────────────────────────────
Total: 46 tasks → 2-3 weeks
```

### By Parallelization

**Day 1-2 (Setup & Foundational)**
```
T001-T006   Setup (6 tasks)        [SEQUENTIAL]
T007-T014   Foundational (8 tasks) [PARALLEL: groups T011-T014 can run in parallel]
```

**Day 3-5 (US1: Recorder)**
```
T015-T024   US1 (10 tasks)         [SEQUENTIAL: T016-T022 can parallelize after T015]
```

**Day 6-8 (US2: Statistics)**
```
T025-T032   US2 (8 tasks)          [PARALLEL: T025-T026 can start while US1 finalized; T027-T030 can parallelize]
```

**Day 9-10 (US3: History)**
```
T033-T038   US3 (6 tasks)          [PARALLEL: T033-T036 can run in parallel after T035 started]
```

**Day 11-14 (Polish)**
```
T039-T046   Polish (8 tasks)       [PARALLEL: T039-T042 can run in parallel; T043-T046 sequential]
```

### By Developer (2-Person Team)

**Developer 1** (Backend Logic)
- T007-T014: Store, models, dates, validation, aggregation + tests
- T015: usePainData hook (parallelize with Dev2's UI)
- T031-T032: Integration tests for US2

**Developer 2** (Frontend UI)
- T001-T006: Project setup
- T016-T024: BodyDiagram, PainSlider, Recorder + tests (wait for T015)
- T025-T030: PeriodFilter, Statistics, Navigation + tests
- T033-T038: HistoryTable, History page + tests

**Joint**
- T039-T046: Polish, a11y, perf, deployment, review

---

## Success Criteria Checklist

### Code Quality
- [ ] All functions have TypeScript types
- [ ] No `any` types (except where truly necessary, documented)
- [ ] ESLint passes (no warnings)
- [ ] Code formatted with Prettier
- [ ] No console.log statements in production code

### Testing Coverage
- [ ] Unit tests for all utilities (storage, aggregation, dates, validation): ≥85% coverage
- [ ] Integration tests for all 3 user story flows
- [ ] E2E tests for all pages (Playwright)
- [ ] Accessibility tests pass (Axe)
- [ ] All tests pass: `npm test` and `npm run test:e2e`

### Functional Completeness
- [ ] User Story 1 (Recorder) works end-to-end
- [ ] User Story 2 (Statistics) calculates and displays correctly
- [ ] User Story 3 (History) allows edit/delete
- [ ] Navigation between pages works
- [ ] localStorage persistence works across page reloads
- [ ] Auto-cleanup triggers at quota exceeded

### Performance & Optimization
- [ ] Build output `/out` contains only static files (no API routes)
- [ ] Bundle size <500KB uncompressed
- [ ] Lighthouse score ≥90 (Performance, Accessibility, Best Practices)
- [ ] First Contentful Paint <1.5s
- [ ] Statistics calculation <100ms

### Accessibility & Mobile
- [ ] WCAG 2.1 AA compliance verified (Axe)
- [ ] All interactive elements keyboard accessible
- [ ] Touch targets ≥44x44px on mobile
- [ ] Responsive on 320px to 2560px widths
- [ ] Tested on mobile (iOS Safari 12+, Android Chrome 80+)

### Documentation
- [ ] README.md with setup instructions
- [ ] ARCHITECTURE.md with design decisions
- [ ] Data model documentation complete
- [ ] Contract specifications finalized
- [ ] Code comments for complex logic

---

## Blockers & Dependencies

| Task | Depends On | Notes |
|------|-----------|-------|
| T015-T024 (US1 UI) | T007-T014 (Foundational) | Cannot build Recorder without storage and models |
| T025-T032 (US2) | T015-T024 (US1) | Statistics require recorded data to aggregate |
| T033-T038 (US3) | T015-T024 (US1) | History page requires pain entry data |
| T039-T042 (Polish) | T020-T036 (All features) | Polish phases last after features complete |
| T043 (Docs) | All tasks | Final documentation after implementation |

---

## Acceptance Criteria (Per Task Example)

**T020: Build Recorder page (index.tsx)**

Acceptance Criteria:
- [ ] Page renders at `http://localhost:3000`
- [ ] Front and back body diagrams visible and clickable
- [ ] Clicking body part displays PainSlider (1-10)
- [ ] Adjusting slider updates displayed value in real-time
- [ ] Confirming slider saves entry to localStorage with today's date
- [ ] Re-opening same body part shows existing value in slider
- [ ] Multiple body parts can be recorded in one session
- [ ] Selected regions highlight with appropriate color (yellow/orange/red based on level)
- [ ] Page is responsive on mobile/tablet/desktop
- [ ] No console errors or warnings

---

## Next Steps (Post-Planning)

1. **Milestone 1**: Complete Phase 1-2 (Setup + Foundational) - Day 1-2
2. **Milestone 2**: Complete Phase 3 (US1 Recorder MVP) - Day 3-5
3. **Milestone 3**: Complete Phase 4-5 (US2-US3) - Day 6-10
4. **Milestone 4**: Complete Phase 6 (Polish) - Day 11-14
5. **Release**: Static export to CDN, production deployment

**Start Task**: T001 (Create Next.js project scaffold)
