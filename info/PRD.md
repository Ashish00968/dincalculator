# Product Requirements Document (PRD) — DIN Calculator Pro

- **Product Name:** DIN Calculator Pro
- **Domain:** `dincalculatorpro.com`
- **Target Release:** Q3/Q4 2026
- **Status:** Approved / In Documentation

---

## 1. Executive Summary & Value Proposition
**DIN Calculator Pro** is a high-speed, mobile-responsive, client-side web application designed to compute ski binding release settings (DIN values) in strict accordance with the **ISO 11088** standard. 

Most existing DIN calculators on the internet are dated, non-responsive, buried in advertising, or do not explain *how* calculations are derived. **DIN Calculator Pro** combines rigorous precision, instantaneous real-time feedback, visual dials, and comprehensive educational content to serve as the definitive tool for skiers, parents, and technicians worldwide.

---

## 2. Target Personas
1. **Recreational & Family Skiers:** Need a quick, trustworthy check before renting or heading to the slopes.
2. **Intermediate & Advanced Skiers:** Need to dial in settings based on changing boot soles, new bindings, or transitioning into freeride/backcountry terrain.
3. **Parents:** Need safe, conservative binding numbers for growing kids.
4. **Ski Rental Technicians & Shop Staff:** Need an instant reference tool that accurately implements the ISO 11088 conflict-resolution rules.

---

## 3. Core Functional Requirements

### 3.1 Dual-Unit Input Form
- **Unit Toggle:** Immediate switch between **Imperial** (`lbs`, `ft / in`) and **Metric** (`kg`, `cm`).
- **Skier Weight:** Numeric input + range slider (20 – 300 lbs / 10 – 140 kg).
- **Skier Height:** Dropdown / slider combo (3'0" – 7'0" / 90 – 215 cm).
- **Age:** Numeric input (3 – 99 years).
- **Skier Type:** Segmented visual cards with clear descriptions:
  - `Type -I` (Extremely Cautious / Beginner Junior)
  - `Type I` (Cautious / Beginner on green/blue runs)
  - `Type II` (Moderate / Intermediate all-mountain)
  - `Type III` (Aggressive / Expert on steep & variable terrain)
  - `Type III+` (Extreme / Freeride / High-speed racer)
- **Boot Sole Length (BSL):** 
  - Direct 3-digit millimeter input (e.g. 295 mm).
  - Built-in "BSL Finder Modal" explaining where to find the stamped millimeter number on the boot heel lug, along with a Mondo-to-estimated-BSL lookup chart.

### 3.2 Real-Time Calculation & Visual Output
- **Live Calculation:** Output updates dynamically on every input change without page reloads.
- **Visual DIN Gauge:** SVG / Canvas gauge displaying the calculated DIN with standard binding range markings.
- **Transparent Breakdown Drawer:** Shows:
  - Baseline Skier Code (from Weight & Height).
  - Skier Type Modifier ($\pm$ rows).
  - Age Modifier ($\pm$ rows).
  - Final Adjusted Skier Code.
  - Recommended DIN setting.
- **Printable / Savable Result Card:** Clean PDF / screenshot summary card to bring to a local ski shop.

### 3.3 Complete 8-Route Site Map & Educational Suite
- `/` — Homepage: Minimalist Hero, Live Calculator Island, ISO Table Preview, 4-Step Methodology, Educational SEO Guide & 12 SERP FAQs.
- `/iso-11088-chart` — Dedicated Full-Screen ISO 11088 Matrix Explorer with torque physics breakdown.
- `/bsl-guide` — Boot Sole Length Guide & Mondo Size conversion tables.
- `/skier-types` — Skier Type Classification Guide (Type -I to III+).
- `/about` — About Us, mission statement, transparency principles & architecture breakdown.
- `/contact` — Contact page & technician feedback form.
- `/404` — Custom branded Not Found page.
- `/500` — Custom branded Server Error page.
- `/terms` — Terms of Service, ISO trademark attribution & liability disclaimers.
- `/privacy` — Zero-Data storage policy & GDPR compliance.

---

## 4. Non-Functional & Technical Requirements
- **Zero Server Overhead:** 100% static client-side calculation (pure JavaScript/TypeScript engine).
- **Performance:** 
  - First Contentful Paint (FCP) < 0.4s
  - Time to Interactive (TTI) < 0.6s
  - 100/100 Lighthouse score across Performance, Accessibility, Best Practices, and SEO.
- **Accessibility:** WCAG 2.1 AA compliant, full keyboard navigation, ARIA live regions for calculation results.
- **Mobile-First Responsiveness:** Optimized for one-handed thumb navigation on slopes/mobile devices.

---

## 5. SEO & Growth Strategy
- **Target Keywords:** `ski din calculator`, `calculate ski binding setting`, `iso 11088 chart`, `skier type 1 2 3`, `boot sole length din chart`.
- **Structured Data:** 
  - `WebApplication` / `SoftwareApplication` Schema
  - `FAQPage` Schema
  - `HowTo` Schema (How to find your ski DIN setting)
- **OpenGraph & Twitter Cards:** Custom social preview cards displaying an alpine-themed DIN gauge.

---

## 6. Safety & Legal Compliance
- Every page and calculation result prominently displays the mandatory safety disclaimer:
  > *"DIN Calculator Pro provides estimates based strictly on ISO 11088 standard charts. These calculations are for informational purposes only. Ski bindings must always be inspected, tested, and adjusted by a certified ski technician using specialized calibration equipment."*
