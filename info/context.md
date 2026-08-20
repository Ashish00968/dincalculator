# Project Context & Agent Handover Guide

## Overview
**DIN Calculator Pro** (`dincalculatorpro.com`) is a production-ready, ultra-fast static web application designed to calculate ISO 11088:2018 ski binding release settings with mathematical precision. It is built with zero servers, zero cookies, and zero user data tracking.

---

## Tech Stack
- **Framework**: [Astro 5.x](https://astro.build/) (Static Site Generation / SSG mode)
- **UI Island Framework**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` CSS variable tokens
- **Icons**: Custom SVG Action Sports Icons + [Lucide React](https://lucide.dev/)
- **Language**: TypeScript (Strict Mode)
- **Engine**: Pure deterministic TypeScript ISO 11088 engine (`src/engine/din-engine.ts`) with 100% test coverage (`src/engine/din-engine.test.ts`)

---

## Architecture & Codebase Directory Map
```
/
├── public/
│   ├── logo-icon.png        # Primary brand icon (Stitch AI downhill skier mark, 512x512)
│   ├── logo-wordmark.png    # Primary brand wordmark banner
│   ├── favicon.svg          # SVG wrapper with embedded brand mark
│   ├── favicon-16x16.png    # 16px standard favicon
│   ├── favicon-32x32.png    # 32px retina favicon
│   ├── favicon-48x48.png    # 48px tab icon
│   ├── favicon-96x96.png    # 96px high-density icon
│   ├── apple-touch-icon.png # 180px iOS home screen icon
│   ├── android-chrome-192x192.png # 192px Android PWA icon
│   ├── android-chrome-512x512.png # 512px Android splash icon
│   ├── site.webmanifest     # PWA manifest with shortcuts and metadata
│   ├── og-image.svg         # 1200x630 High-res social share preview card
│   ├── robots.txt           # Crawl permissions with disallow paths & sitemap link
│   └── sitemap.xml          # XML sitemap indexing all 8 active routes
├── src/
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── CalculatorApp.tsx   # Top-level state coordinator & smart unit detector
│   │   │   ├── InputForm.tsx       # Sliders, steppers, unit switcher & BSL picker
│   │   │   ├── ResultDisplay.tsx   # Gauge display, DIN rating & breakdown drawer
│   │   │   ├── DinGauge.tsx        # High-performance animated SVG torque dial
│   │   │   ├── MatrixTable.tsx     # Full interactive ISO 11088 crosshair matrix
│   │   │   └── BslGuideModal.tsx   # Mondo-to-BSL sizing modal
│   │   └── ui/
│   │       ├── AccordionFAQ.tsx    # Responsive FAQ accordion with 12 SERP questions
│   │       ├── ThemeToggle.tsx     # Dark/Light mode toggle (localStorage + media query)
│   │       └── Toggle.tsx          # Reusable pill toggle component
│   ├── engine/
│   │   ├── din-engine.ts           # Pure ISO 11088:2018 calculation engine
│   │   ├── din-engine.test.ts      # 8 comprehensive automated unit test cases
│   │   ├── iso-table.ts            # Matrix data and skier code definitions
│   │   └── types.ts                # Strict TypeScript domain types
│   ├── layouts/
│   │   └── BaseLayout.astro        # Master layout, navigation, footer, favicon links & @graph JSON-LD
│   ├── pages/
│   │   ├── index.astro             # Main Calculator, Methodology, Features, SEO Guide & FAQ
│   │   ├── iso-11088-chart.astro   # Dedicated full-screen ISO Matrix Table explorer
│   │   ├── bsl-guide.astro         # Boot Sole Length identification & Mondo charts
│   │   ├── skier-types.astro       # Skier Type I, II, III classification guide
│   │   ├── about.astro             # About Us, mission statement, principles & tech architecture
│   │   ├── contact.astro           # Contact page for user feedback & tech verification
│   │   ├── 404.astro               # Custom branded 404 error page
│   │   ├── 500.astro               # Custom branded 500 server error page
│   │   ├── terms.astro             # Terms of Service, ISO attribution & copyright notice
│   │   └── privacy.astro           # Zero-Data storage policy
│   └── styles/
│       └── global.css              # Tailwind v4 theme tokens (Action Sports high-contrast)
└── info/                           # Architecture, PRD, design system & handover docs
```

---

## Design System & Theme Tokens (`src/styles/global.css`)
We follow an **Action Sports (High-Vis Orange & Alpine Carbon)** aesthetic:
- `--theme-primary`: High-Vis Orange (`#FF6B00` / `#FF8533`)
- `--theme-canvas`: Ultra-dark zinc/slate base (`#090A0C` in dark mode, `#F8FAFC` in light mode)
- `--theme-parchment`: Secondary elevated container surface (`#121316` dark, `#FFFFFF` light)
- `--theme-input`: Input card and pill background (`#18191E` dark, `#F1F5F9` light)
- `--theme-hairline`: Crisp boundary borders (`rgba(255,255,255,0.08)` dark, `#E2E8F0` light)
- `--theme-ink`: High-contrast foreground text (`#FAFAFA` dark, `#0F172A` light)
- `--theme-mute`: Secondary readable body text (`#A1A1AA` dark, `#64748B` light)

---

## Key Development Commands
```bash
# Start Astro local development server (runs at http://localhost:4321)
npm run dev

# Run the ISO 11088 calculation engine test suite
npm run test

# Run a static production build (outputs to dist/)
npm run build

# Preview the static production build locally
npm run preview
```

---

## SEO & Schema.org Configuration
- Injected via `src/layouts/BaseLayout.astro` inside `<head>` using `<script type="application/ld+json">`.
- Implements a unified `@graph` containing:
  1. `SoftwareApplication`: Identifies DIN Calculator Pro as a free health/fitness tool.
  2. `HowTo`: Step-by-step methodology explaining the ISO 11088 formula.
  3. `FAQPage`: 12 exact-match questions corresponding with Google "People also ask" queries.
- OpenGraph & Twitter cards are configured with dynamic titles, descriptions, and `https://dincalculatorpro.com/og-image.svg`.
