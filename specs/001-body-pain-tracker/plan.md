# Implementation Plan: Daily Body Pain Tracker

**Branch**: `001-body-pain-tracker` | **Date**: 2026-02-24 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-body-pain-tracker/spec.md`

## Summary

Build a responsive static web application for daily pain tracking using **Next.js 14+ with Static Export** (SSG), **TypeScript**, and **Tailwind CSS**. Users will interact with interactive SVG body diagrams (front/back views with 30+ anatomical regions) to record daily pain using slider controls (1-10). Data persists in localStorage. Features include: daily pain recording (P1), statistics dashboard with rolling 7/30-day periods (P2), and historical entry review (P3). Application must be fully responsive (320px-2560px), accessibility-compliant (WCAG 2.1 AA), and optimized for mobile with Lighthouse score ≥90.

## Technical Context

**Language/Version**: TypeScript 5.0+, Node.js 18+, Next.js 14+ with `next export` (Static Export)  
**Primary Dependencies**: React 18+, Tailwind CSS 3+, TypeScript, SVG manipulation (native)  
**Storage**: Browser localStorage only (no backend, no database)  
**Testing**: Jest + React Testing Library (unit), Playwright (E2E), Axe (accessibility)  
**Target Platform**: Static HTML/CSS/JS deployed to CDN (Vercel, Netlify, GitHub Pages, S3)  
**Project Type**: Static web application (SPA)  
**Performance Goals**: Lighthouse Performance ≥90, First Contentful Paint <1.5s, interactive in <3s on 4G  
**Constraints**: Bundle size <500KB (uncompressed), localStorage quota <5MB, no backend compute, rolling periods (7/30 days)  
**Scale/Scope**: MVP with 3 pages (Recorder, Statistics, History), 30+ body part regions, responsive design, data integrity for 30+ days

## Constitution Check

**Status**: ✅ FULL COMPLIANCE

| Principle | Requirement | Compliance | Notes |
|-----------|------------|-----------|-------|
| I. Static-First | No server-side rendering, static files only | ✅ PASS | Next.js `next export` produces static HTML; no API routes used |
| II. Client-Side Rendering | All UI updates in browser, graceful degradation | ✅ PASS | React/Next.js for dynamic UI; localStorage for data; falls back to empty state if JS disabled |
| III. External API Only | No dedicated backend, CORS-compliant | ✅ PASS | No external APIs needed for MVP; all logic client-side |
| IV. Performance | Bundle <500KB, minified, lazy-loading, CSP | ✅ PASS | Tailwind optimizes CSS; Next.js minifies; images vectorized as SVG; no large dependencies |
| V. Security | XSS prevention, CSP, no hardcoded secrets | ✅ PASS | React auto-escapes; localStorage scopes to origin; no secrets in code |
| VI. Accessibility & SEO | WCAG 2.1 AA, semantic HTML, meta tags | ✅ PASS | Tailwind + semantic components; automated Axe testing; meta tags in Next.js head |
| VII. Responsive Design | Mobile-first, 320px+, touch targets ≥44px | ✅ PASS | Tailwind responsive utilities; slider and buttons sized for touch; tested across breakpoints |

**Gates**: All passed. No violations. No exemptions needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-body-pain-tracker/
├── spec.md                  # Feature specification (input)
├── plan.md                  # This file (Phase 0/1 planning output)
├── research.md              # Phase 0: Research findings (TBD)
├── data-model.md            # Phase 1: Data schemas & entities (TBD)
├── quickstart.md            # Phase 1: Setup & dev guide (TBD)
├── contracts/               # Phase 1: API/UI contracts (TBD)
│   ├── localStorage-schema.md
│   ├── body-diagram-spec.md
│   ├── component-api.md
│   └── aggregation-logic.md
└── tasks.md                 # Phase 2: Decomposed tasks (TBD)
```

### Source Code Repository (Next.js Static Site)

```text
/ (repo root)
├── package.json
├── tsconfig.json
├── next.config.js           # Static export config: output: 'export'
├── tailwind.config.js
├── postcss.config.js
├── jest.config.js
├── playwright.config.ts
├── public/
│   ├── body-diagram-front.svg
│   └── body-diagram-back.svg
├── src/
│   ├── pages/               # Next.js pages (static generation)
│   │   ├── _app.tsx         # Global layout, styles, providers
│   │   ├── _document.tsx    # HTML structure, meta tags, CSP
│   │   ├── index.tsx        # Recorder page (main entry)
│   │   ├── statistics.tsx   # Statistics page
│   │   └── history.tsx      # History page
│   │
│   ├── components/
│   │   ├── BodyDiagram.tsx           # Interactive SVG body (front/back)
│   │   ├── PainSlider.tsx            # Slider input (1-10)
│   │   ├── BodyPartButton.tsx        # Clickable region wrapper
│   │   ├── StatisticsTable.tsx       # Top 10 ranking display
│   │   ├── HistoryTable.tsx          # Chronological log
│   │   ├── PeriodFilter.tsx          # Week/Month toggle
│   │   ├── EmptyState.tsx            # No data message
│   │   ├── Navigation.tsx            # Page navigation
│   │   ├── LocalStorageWarning.tsx   # Quota/disabled alerts
│   │   └── Breadcrumbs.tsx           # Navigation aid
│   │
│   ├── lib/
│   │   ├── storage.ts               # localStorage API wrapper
│   │   ├── data-models.ts           # TypeScript interfaces
│   │   ├── aggregation.ts           # Statistics calculation
│   │   ├── dates.ts                 # Date utilities
│   │   ├── body-parts.ts            # Static catalog of 30+ regions
│   │   ├── validation.ts            # Input validation
│   │   └── hooks/
│   │       ├── useLocalStorage.ts   # Custom storage hook
│   │       ├── usePainData.ts       # Data operations hook
│   │       └── useStatistics.ts     # Aggregation hook
│   │
│   ├── styles/
│   │   ├── globals.css             # Global styles, Tailwind directives
│   │   └── responsive.css          # Responsive utilities
│   │
│   └── types/
│       └── global.d.ts             # TypeScript declarations
│
├── tests/
│   ├── unit/
│   │   ├── aggregation.test.ts
│   │   ├── storage.test.ts
│   │   ├── validation.test.ts
│   │   └── dates.test.ts
│   ├── integration/
│   │   ├── recorder-flow.test.ts
│   │   ├── statistics-flow.test.ts
│   │   └── history-flow.test.ts
│   ├── e2e/
│   │   ├── recorder.spec.ts
│   │   ├── statistics.spec.ts
│   │   └── mobile.spec.ts
│   └── accessibility/
│       └── axe.test.ts
│
├── .github/
│   └── workflows/
│       └── build-test-deploy.yml
└── docs/
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

**Structure Decision**: Single Next.js static site (Option 1). No backend separation needed because all data logic is client-side (localStorage), no server-side rendering required, and no API routes needed.

## Phase 0: Research (Parallel Investigations)

**Output**: `research.md` with resolved research items and implementation decisions

### Key Research Areas

1. **SVG Body Diagram Implementation**
   - Approach: SVG with clickable `<path>` elements mapped to 30+ body regions
   - Event handling: React click handlers on SVG elements with data attributes
   - Tooling: Hand-crafted SVG or library (consider simplicity)

2. **Slider Component Pattern**
   - Approach: Native HTML5 `<input type="range">` with custom Tailwind styling
   - Accessibility: ARIA labels, keyboard navigation, screen reader support
   - Touch support: Native mobile slider interaction

3. **localStorage Architecture**
   - Schema: JSON by date key (YYYY-MM-DD), typed storage wrapper
   - Quota management: Monitor usage, auto-cleanup oldest month on exceed
   - Error handling: Graceful degradation when localStorage unavailable

4. **Statistics Aggregation Algorithm**
   - Period calculation: Rolling 7/30 days from today (no timestamps)
   - Aggregation: Sum pain levels by body part, descending rank
   - Performance: Cache results, memoize calculations

5. **Next.js Static Export Configuration**
   - Config: `output: 'export'` in next.config.js, no dynamic routes
   - Build output: Static HTML, CSS, JS in `/out` directory
   - Hosting: Deploy to CDN (Vercel, Netlify, GitHub Pages)

6. **Responsive Design & Mobile Testing**
   - Breakpoints: 576px, 768px, 1024px, 1280px (Tailwind defaults)
   - Touch targets: 44x44px minimum for all interactive elements
   - Viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`

## Phase 1: Design & Contracts

### 1A: Data Model (`data-model.md`)

Document the following entities and schemas:
- Pain Entry (date, body parts, timestamp)
- Body Part Entry (ID, intensity 1-10, optional notes)
- Body Part Catalog (30+ regions with IDs, anatomical names, coordinates)
- Period Filters (week, month, calculated date ranges)

### 1B: Interface Contracts (`contracts/`)

Create 4 contract documents:
1. **localStorage-schema.md** - JSON structure, CRUD operations, error handling
2. **body-diagram-spec.md** - SVG structure, clickable regions, body part IDs
3. **component-api.md** - React component props, hooks, state management
4. **aggregation-logic.md** - Statistics algorithm, ranking rules, period logic

### 1C: Quick Start Guide (`quickstart.md`)

Setup instructions:
- `npm install` → install dependencies
- `npm run dev` → start dev server on http://localhost:3000
- `npm run build` → build static export to `/out`
- `npm test` → run all tests
- Deploy `/out` to CDN

### 1D: Agent Context Update

Run update-agent-context script to register: Next.js, TypeScript, Tailwind CSS, staticexport

## Phase 2: Task Decomposition (Not in this plan)

Output of `/speckit.tasks` command will decompose into:
- **Setup**: Project scaffold, dependencies, configuration (2-3 tasks)
- **Core Features**: Body diagram, slider, storage, basic UI (8-10 tasks)
- **Analytics**: Aggregation logic, stats UI, filters (4-5 tasks)
- **Polish**: Mobile optimization, accessibility, testing (5-6 tasks)
- **Deployment**: Build config, CI/CD, hosting (3-4 tasks)

## Complexity Summary

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Scope | Low | 3 pages, MVP-focused |
| State Management | Low | localStorage only, hooks-based |
| Data Model | Low | Simple JSON by date, static catalog |
| Interactions | Medium | Clickable SVG + slider + tables |
| Performance | Medium | Optimize for mobile, Lighthouse 90+ |
| Testing | High | Unit, integration, E2E, accessibility |
| Deployment | Low | Static export, standard CDN |

**Overall**: Low-to-medium complexity with strong testing requirements.

## Next Steps

1. Run Phase 0 research to document decisions in `research.md`
2. Create `data-model.md` with detailed schemas
3. Generate `contracts/` specifications
4. Create `quickstart.md` with setup guide
5. Run `/speckit.tasks` to decompose into development tasks
