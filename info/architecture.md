# Technical Architecture & Stack Specification

- **Project:** DIN Calculator Pro (`dincalculatorpro.com`)
- **Architecture Pattern:** Static Site Generation (SSG) + Client-Side Island

---

## 1. Why Static Architecture?
1. **Zero Database / Server Overhead:** The ISO 11088 calculation is deterministic mathematics that executes in <1ms in any browser.
2. **Speed & Core Web Vitals:** Static HTML generated at build time delivered over a global CDN edge ensures instant load times globally.
3. **Zero Hosting Cost & Infinite Scale:** Effortlessly handles traffic spikes during ski season without scaling servers or incurring database costs.
4. **Security:** No server attack surface, no database injection risks, no user auth vulnerability.

---

## 2. Tech Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Astro 4.x / 5.x** | Industry benchmark for content-focused, ultra-fast static sites with zero client JS by default. |
| **UI Island** | **Vanilla TS / Alpine.js / Preact** | Micro-bundle interactive calculator island (<10KB) embedded inside static markup. |
| **Styling** | **Tailwind CSS** | Utility-first, responsive, zero-runtime CSS with modern dark/light mode tokens. |
| **Icons** | **Lucide Icons** | Featherweight SVG icons for mountain, gauge, sliders, rulers, and info tooltips. |
| **Deployment** | **Cloudflare Pages / Vercel** | Free global edge network, automatic SSL, instant preview branches, and DDoS protection. |
| **Analytics** | **Cloudflare Web Analytics / Plausible** | Privacy-focused, lightweight, cookie-less tracking. |

---

## 3. Project Directory Structure

```
dincalculatorpro.com/
├── info/                         # Project master knowledge base & specs
│   ├── PRD.md                    # Product requirements document
│   ├── architecture.md           # Stack & architecture documentation
│   ├── calculation-engine.md     # ISO 11088 matrix & algorithm spec
│   ├── design-system.md          # UI tokens, color palette & component specs
│   ├── design-system-stitch.md   # Stitch AI brand token mappings
│   ├── legal.md                  # Safety disclaimers, ISO trademark & policies
│   ├── content-sources.md        # Authoritative citations & manual links
│   └── todo.md                   # Execution roadmap checklist
├── public/                       # Static public assets
│   ├── logo-icon.png             # Stitch AI downhill skier app icon (512x512)
│   ├── logo-wordmark.png         # Horizontal wordmark banner
│   ├── favicon.svg               # SVG wrapper embedding brand mark
│   ├── favicon-16x16.png         # Favicon suite (16, 32, 48, 96, 180, 192, 512px)
│   ├── favicon-32x32.png
│   ├── favicon-48x48.png
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── site.webmanifest          # PWA metadata & application shortcuts
│   ├── og-image.svg              # OpenGraph social share banner
│   ├── robots.txt                # Search engine crawler directives
│   └── sitemap.xml               # Complete 8-route sitemap
├── src/
│   ├── components/               # Astro & React 19 UI Island components
│   │   ├── calculator/
│   │   │   ├── CalculatorApp.tsx # Main state coordinator & geolocation unit detection
│   │   │   ├── InputForm.tsx     # Sliders, steppers, and unit toggle
│   │   │   ├── ResultDisplay.tsx # Recommended DIN, code, bracket & calculation trace
│   │   │   ├── DinGauge.tsx      # SVG torque dial with animated needle
│   │   │   ├── MatrixTable.tsx   # Interactive ISO 11088 matrix with crosshair
│   │   │   └── BslGuideModal.tsx # Boot Sole Length Mondo reference modal
│   │   └── ui/
│   │       ├── AccordionFAQ.tsx  # Interactive FAQ accordion
│   │       ├── ThemeToggle.tsx   # Light/dark mode toggle
│   │       └── Toggle.tsx        # Segmented pill toggle
│   ├── engine/                   # Pure calculation logic
│   │   ├── din-engine.ts         # Zero-dependency ISO 11088 calculation logic
│   │   ├── din-engine.test.ts    # 8 automated unit test scenarios
│   │   ├── iso-table.ts          # Matrix data tables & skier code rows
│   │   └── types.ts              # Domain interfaces & types
│   ├── layouts/
│   │   └── BaseLayout.astro      # Master layout, navigation, footer, schema JSON-LD
│   ├── pages/
│   │   ├── index.astro           # Homepage, hero, calculator, SEO guide & FAQs
│   │   ├── iso-11088-chart.astro # Full matrix table page
│   │   ├── bsl-guide.astro       # Boot Sole Length complete guide
│   │   ├── skier-types.astro     # Skier Type 1, 2, 3 selection guide
│   │   ├── about.astro           # About Us & technical architecture
│   │   ├── contact.astro         # Contact Us form
│   │   ├── 404.astro             # Custom 404 error page
│   │   ├── 500.astro             # Custom 500 error page
│   │   ├── privacy.astro         # Zero-data privacy policy
│   │   └── terms.astro           # Terms of service, ISO attribution & copyright
│   └── styles/
│       └── global.css            # Tailwind directives & custom Action Sports theme tokens
├── astro.config.mjs              # Astro configuration
├── package.json
└── tsconfig.json
```

---

## 4. Performance & Core Web Vitals Budget
- **Total JS on Page:** < 15 KB (Gzipped)
- **Total CSS on Page:** < 12 KB (Gzipped)
- **First Contentful Paint (FCP):** < 0.4s
- **Cumulative Layout Shift (CLS):** 0.00
- **Largest Contentful Paint (LCP):** < 0.8s
- **Lighthouse Target:** 100 / 100 / 100 / 100
