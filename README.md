# DIN Calculator Pro (dincalculatorpro.com)

[![ISO 11088:2018 Compliant](https://img.shields.io/badge/Standard-ISO%2011088%3A2018-FF6B00.svg)](https://www.iso.org/standard/70362.html)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20with-Cloudflare%20Pages-F38020.svg?logo=cloudflare)](https://dincalculatorpro.pages.dev)
[![100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10B981.svg)](#privacy-guarantee)
[![Tests Passing](https://img.shields.io/badge/Tests-8%2F8%20Passing-emerald.svg)](#running-tests)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**DIN Calculator Pro** is a high-performance, mobile-first, static web application for calculating ski binding release settings (DIN values) in strict compliance with the international standard **ISO 11088:2018**.

Built with an **Action Sports & Alpine Precision** aesthetic, it features a zero-dependency calculation engine, an animated SVG DIN gauge, interactive matrix crosshair highlighting, a Boot Sole Length (BSL) Mondo converter, a 12-question Google SERP-optimized FAQ accordion, and comprehensive educational guides.

---

## ⛷️ Features

- **ISO 11088:2018 Calculation Engine**: Zero-dependency, client-side algorithm (<1ms execution) implementing height-weight conflict resolution, skier type adjustments, age modifiers, and horizontal nearest-neighbor fallback logic.
- **Smart Geolocation Auto-Units**: Uses `Intl.Locale` to automatically default to Imperial (`lbs`, `ft/in`) in the US/UK and Metric (`kg`, `cm`) in Europe/international regions.
- **Interactive SVG DIN Gauge**: Calibrated analog/digital arc display with dynamic needle animation and safety color zone thresholds.
- **Interactive ISO Matrix Table**: Live crosshair and glowing cell indicator mapping the user's active code and BSL bracket onto the full official ISO 11088 chart.
- **SEO & Google SERP Alignment**: 12 structured FAQ questions matching Google "People also ask" and "People also search for" queries, backed by unified `@graph` JSON-LD schemas (`SoftwareApplication`, `HowTo`, `FAQPage`).
- **Precision Iconography & Brand Emblem**: Custom geometric mountain/binding torque logo mark and custom SVG step badges for the calculation methodology breakdown.
- **Ski Tech Card Export**: One-click clipboard copy with formatted technician summary and print-ready workshop sheet.
- **100% Client-Side Privacy**: Zero cookies, zero trackers, and zero personal physical data sent over the network.

---

## 🌲 Site Architecture & Routes

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Calculator & FAQ** | Interactive calculator island, live DIN gauge, matrix preview, 4-step methodology, and schema-backed FAQ accordion. |
| `/iso-11088-chart` | **ISO 11088 Reference Chart** | Full reference matrix (Codes A–P vs 8 BSL brackets) with printable workshop view and torque physics guide. |
| `/bsl-guide` | **BSL & Mondo Guide** | Boot sole length measurement guide, heel lug stamp identifier, and brand conversion tables. |
| `/skier-types` | **Skier Type Guide** | Detailed guide on selecting Type -I through III+ with release vs retention risk trade-offs. |
| `/about` | **About Us** | Mission statement, transparency principles, and technical architecture overview. |
| `/contact` | **Contact Us** | Direct feedback and inquiry channel for skiers and certified ski technicians. |
| `/terms` | **Terms & Disclaimer** | Comprehensive ISO 11088 liability disclaimers, ISO trademark attribution, and safety notices. |
| `/privacy` | **Privacy Policy** | Zero-data storage, client-side execution architecture, and GDPR compliance. |

---

## 🛠️ Technology Stack

- **Framework**: [Astro 5.x](https://astro.build/) (Static Site Generation / SSG mode)
- **UI Framework**: [React 19](https://react.dev/) (Client Island components)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with Action Sports Design System
- **Icons**: Custom SVG Action Sports Icons + [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **SEO & Structured Data**: OpenGraph, Twitter Cards, `SoftwareApplication`, `HowTo`, and `FAQPage` JSON-LD schemas.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/dincalculatorpro.git
cd dincalculatorpro

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Navigate to `http://localhost:4321` in your browser.

### Running Tests
Execute the ISO 11088 calculation engine test suite:
```bash
npm run test
```
*Runs 8 comprehensive test scenarios covering intermediate adults, beginner children, senior skiers, tall/thin conflict resolution, and blank-cell fallback rules.*

### Production Build
```bash
npm run build
```
Generates optimized static HTML, CSS, and JS bundles into the `dist/` directory ready for deployment on Cloudflare Pages, Vercel, or any CDN.

---

## 🔒 Privacy Guarantee

DIN Calculator Pro is architected with a **Zero-Data Policy**:
- **No Servers or Databases**: Calculations run exclusively in your browser's local memory.
- **No Personal Data Collected**: Body weight, height, age, and boot size never leave your device.
- **No Tracking Cookies**: Zero third-party profiling or ad tracking.

---

## ⚠️ Mandatory Safety Disclaimer

> **IMPORTANT SAFETY NOTICE:**  
> DIN Calculator Pro generates estimated binding release values based on the international ISO 11088 standard for informational, educational, and cross-reference purposes only. 
>
> Ski binding release mechanisms directly affect your safety and risk of injury. Actual binding settings depend on boot wear, binding model, friction strip condition, forward pressure, and mechanical calibration. **Never ski on bindings that have not been professionally inspected, adjusted, and torque-tested on calibrated test equipment by a certified ski technician.**

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
