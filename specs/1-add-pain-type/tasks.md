# Tasks: Añadir tipo de dolor

Feature: Añadir `painType` al guardar un `PainEntry` (1-add-pain-type)

Phase 1: Setup

- [ ] T001 Create feature branch `1-add-pain-type` at repository root
- [ ] T002 Add `PainType` enum in src/lib/types/painType.ts
- [ ] T003 Add `painType` field to `PainEntry` model in src/lib/models/painEntry.ts

Phase 2: Foundational (blocking prerequisites)

- [ ] T004 Update `src/lib/hooks/usePainData.ts` to persist and validate `painType` when saving entries
- [ ] T011 Update migration utility in src/lib/migrate-pain-data.ts to mark legacy records with `painType: 'unknown'`

Phase 3: User Story 1 - Registrar dolor con intensidad y tipo (Priority: P1)

- [ ] T005 [US1] Implement `PainTypeSelector` component in src/components/PainTypeSelector.tsx (accessible radio group or select)
- [ ] T006 [P] [US1] Integrate `PainTypeSelector` into src/components/PainSlider.tsx so user selects type immediately after intensity
- [ ] T007 [US1] Enforce selection and validation in src/pages/index.tsx save flow; show inline validation messages and prevent save without `painType`

Phase 4: User Story 2 - Filtrar y agregar estadísticas por tipo (Priority: P2)

- [ ] T009 [P] [US2] Implement `PainTypeFilter` UI in src/components/PainTypeFilter.tsx (dropdown or chips) for statistics view
- [ ] T008 [US2] Extend src/pages/statistics.tsx and src/lib/aggregation.ts to support filtering/aggregation by `painType` (count, average intensity)

Phase 5: User Story 3 - Editar registro para corregir tipo (Priority: P3)

- [ ] T010 [US3] Add edit capability to history: src/components/PainEntryEditor.tsx and src/pages/history.tsx must allow updating `painType` and re-saving

Final Phase: Polish & Docs

- [ ] T012 Update `README.md` and add `specs/1-add-pain-type/MIGRATION-NOTES.md` documenting new field, migration strategy, and UI changes

Dependencies:

- T004 & T011 are foundational and should be completed before T005-T007 and T008-T010 where appropriate.

Parallel Opportunities:

- T005 (component) can be implemented in parallel with T011 (migration utility) and T012 (docs).
- T006 integration & T007 UI validation should follow T005 but can be split across different files by separate engineers (marked `[P]`).

Notes:

- Use the enum values localized keys and store short string codes internally (e.g., `pulsatile`, `burning`, `electric`, `sharp`, `deep`, `stiffness`, `tenderness`, `unknown`).
- Ensure `usePainData` hook update includes TypeScript typings and tests where present.
- Keep migration manual/optional per product decision; do not auto-migrate on load.
