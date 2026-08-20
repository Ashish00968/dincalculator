# DIN Calculator Pro — Master Execution Checklist

## Phase 1: Research, Verification & Specification (Completed)
- [x] Gather ISO 11088 standard data via NotebookLM
- [x] Document verified Skier Code matrix (Weight & Height)
- [x] Document full DIN lookup matrix (Codes A–P vs BSL ranges)
- [x] Document modifier rules (Skier Type -I to III+, Age <10 / 50+, <=13kg safety limits)
- [x] Document blank cell horizontal resolution logic

## Phase 2: Documentation Setup (Completed)
- [x] Create `info/PRD.md`
- [x] Create `info/architecture.md`
- [x] Create `info/calculation-engine.md`
- [x] Create `info/design-system.md`
- [x] Create `info/legal.md`
- [x] Create `info/content-sources.md`
- [x] Create `info/todo.md`

## Phase 3: Engine Implementation & Unit Tests (Completed)
- [x] Initialize project configs (`package.json`, `tsconfig.json`, `astro.config.mjs`, Tailwind v4 setup)
- [x] Implement `src/engine/din-engine.ts` with pure TypeScript ISO 11088 logic
- [x] Implement `src/engine/din-engine.test.ts` covering:
  - [x] Standard adult intermediate (72kg, 175cm, Type II, Age 28, BSL 305mm)
  - [x] Beginner adult (62kg, 162cm, Type I, Age 32, BSL 285mm)
  - [x] Senior skier (Age 55+ with -1 code offset)
  - [x] Child / lightweight skier (<13kg safety clamp)
  - [x] Expert / aggressive skier (Type III with +2 code offset)
  - [x] Height vs Weight conflict resolution (safer top row selection)
  - [x] Blank cell horizontal slide fallback
  - [x] Imperial to metric conversion utility
- [x] Run test suite (`8/8 passed` in Node.js)

## Phase 4: UI & Calculator Component Build (Completed)
- [x] Install and configure React 19 + Astro 5
- [x] Build `InputForm.tsx` interactive component (Imperial/Metric toggles, sliders, BSL helper)
- [x] Build `DinGauge.tsx` visual gauge component with dynamic safety color zones
- [x] Build `BslGuideModal.tsx` boot sole measurement guide
- [x] Build `MatrixTable.tsx` interactive ISO matrix table with live coordinate highlighting
- [x] Build breakdown drawer with step-by-step calculation explanation

## Phase 5: Content, FAQ & SEO (Completed)
- [x] Implement dynamic `AccordionFAQ.tsx` component with 12 Google SERP-matched queries
- [x] Add unified `@graph` JSON-LD schema (`SoftwareApplication`, `HowTo`, `FAQPage`) to `BaseLayout.astro`
- [x] Create dedicated subpages (`/bsl-guide`, `/skier-types`, `/iso-11088-chart`, `/privacy`, `/terms`)
- [x] Generate custom Action Sports `og-image.svg`, `favicon.svg`, `sitemap.xml`, and `robots.txt`
- [x] Implement Smart Geolocation Auto-Unit Detection (`Intl.Locale`) in `CalculatorApp.tsx`
- [x] Target primary high-volume keywords ("Ski Binding DIN Calculator", "How to Find BSL", "Skier Type Guide")

## Phase 6: Brand Identity & Polish (Completed)
- [x] Design Action Sports Alpine & Binding Release brand emblem
- [x] Implement custom SVG vector iconography for the 4-step methodology breakdown
- [x] Audit dark and light mode contrast for full WCAG AA/AAA compliance
- [x] Verify static production build (`npm run build` static generation in ~2.5s)

## Phase 7: Pages, Stitch AI Logo & Legal/SEO Overhaul (Completed)
- [x] Streamline homepage hero for high-impact minimalist UX and zero-scroll calculator visibility
- [x] Remove cluttered technical subtitle from header brand mark
- [x] Build dedicated `/about` (About Us & Architecture) page
- [x] Build dedicated `/contact` (Contact & Technician Feedback) page
- [x] Build custom branded `/404` error page
- [x] Build custom branded `/500` error page
- [x] Generate downhill skier racing logo via Stitch AI MCP (`logo-icon.png`, `logo-wordmark.png`)
- [x] Generate complete multi-resolution favicon pack (16, 32, 48, 96, 180, 192, 512px)
- [x] Add PWA `site.webmanifest` and theme-color meta tags
- [x] Expand `terms.astro` and `info/legal.md` with explicit ISO trademark attribution, Table 2 fair-use citation, and MIT copyright
- [x] Update `sitemap.xml` with all 8 active pages and configure `robots.txt`

---

## Future Roadmap & Backlog for Next Agent
- [ ] **Ski Boot Database**: Searchable database of ski boot models with standard factory BSL values.
- [ ] **Binding Model Directory**: Compatibility checker for GripWalk (ISO 23223), WTR, and Alpine (ISO 5355) bindings.
- [ ] **PDF Export**: Generate downloadable vector PDF certification reports for ski techs and rental shops.
- [ ] **Multi-language Support (i18n)**: French, German, and Italian translations for European ski markets.
- [ ] **Service Worker Offline Cache**: Enable complete offline caching for mountain resorts without cellular connectivity.
