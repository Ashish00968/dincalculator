# @dincalc/engine

[![Tests](https://img.shields.io/badge/tests-1560%20passed-brightgreen.svg)](#testing)
[![Standard](https://img.shields.io/badge/standard-ISO%2011088%3A2023%20(Ed.%207)-blue.svg)](https://www.iso.org/standard/83647.html)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

A modern, zero-dependency TypeScript implementation of the international ski binding release setting indicator standard: **ISO 11088:2023 (Edition 7)**.

Powers the free, privacy-first ski binding calculator at [dincalculatorpro.com](https://dincalculatorpro.com/).

---

## Features

- **Strict ISO 11088:2023 Compliance**: Updated to Edition 7 (the latest standard revision replacing ISO 11088:2018).
- **Comprehensive Skier Profiles**: Full support for Skier Types `-I`, `I`, `II`, `III`, and `III+`.
- **Children & Senior Logic**: Accurately applies Age &lt; 10 Junior skier code capping and Age &ge; 50 shift rules.
- **Imperial & Metric Input**: Native support for weight in kg/lbs, height in cm/inches, and BSL in mm.
- **Full Calculation Traceability**: Generates intermediate steps (Weight Code, Height Code, Baseline Code, Modifiers) for technical inspection.
- **Extensively Tested**: 1,560 golden test vectors validated against the published ISO standard matrix.
- **Zero Runtime Dependencies**: Ultra-lightweight and fast (< 15 KB unbundled).

---

## Installation

```bash
npm install @dincalc/engine
# or
pnpm add @dincalc/engine
# or
yarn add @dincalc/engine
```

---

## Quickstart

### TypeScript / ESM

```typescript
import { calculateDin, type SkierProfile } from '@dincalc/engine';

const profile: SkierProfile = {
  weightKg: 75,
  heightCm: 178,
  age: 32,
  skierType: 'II',
  bslMm: 305
};

const result = calculateDin(profile);

console.log(result.din); // 6.5
console.log(result.baselineCode); // "L"
console.log(result.adjustedCode); // "M"
console.log(result.bslRangeLabel); // "291-310 mm"
```

### Imperial Units (lbs / inches)

```typescript
import { calculateDin } from '@dincalc/engine';

const result = calculateDin({
  weightLbs: 165,
  heightInches: 70,
  age: 28,
  skierType: 'III',
  bslMm: 312,
  unitSystem: 'imperial'
});

console.log(result.din); // 8.5
```

---

## Calculation Steps (ISO 11088:2023)

1. **Skier Code Determination**: Looks up skier weight and height in the standard ISO bracket tables. When height and weight point to different codes, the standard mandates selecting the higher row on the chart (i.e. the row for the lighter skier or shorter height) to prevent non-release.
2. **Skier Type Modifier**:
   - `Type -I`: -1 step (cautious, lower release torque)
   - `Type I`: 0 steps (baseline beginner/recreational)
   - `Type II`: +1 step (moderate intermediate)
   - `Type III`: +2 steps (aggressive advanced)
   - `Type III+`: +3 steps (expert custom release)
3. **Age Modifier**:
   - Skier age under 10: Automatic Skier Code reduction / junior capping.
   - Skier age 50 or older: -1 step downward adjustment for bone density considerations.
4. **Boot Sole Length (BSL) Cross-Reference**: Looks up the final Skier Code in the table column corresponding to the boot sole length measured in millimeters.

---

## Safety & Disclaimer

> [!CAUTION]
> **Important Safety Notice**: Software-calculated DIN settings are indicators intended for informational reference only. Real ski bindings must always be inspected, lubricated, checked for forward pressure, and calibrated using mechanical torque testing equipment (such as Wintersteiger or Montana testers compliant with ISO 11110 / ASTM F1063) by a certified ski technician. Never adjust bindings without understanding forward pressure and anti-friction device (AFD) clearances.

---

## Human Maintainer Checklist (Publishing to npm)

Before publishing:
- [ ] Confirm package name availability on npm (`@dincalc/engine` or `din-engine`).
- [ ] Run `npm run test` in the monorepo root to verify all 1,560 golden test vectors pass.
- [ ] Build the TypeScript declaration and bundle files (`npm run build`).
- [ ] Ensure versioning adheres to Semantic Versioning (SemVer).
- [ ] Publish with `npm publish --access public`.

---

## License

MIT © [DIN Calculator Pro](https://dincalculatorpro.com)
