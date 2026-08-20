# Design System & UI Specification — DIN Calculator Pro

## 1. Aesthetic Direction
- **Concept:** *Action Sports & Alpine Precision*
- **Vibe:** High-energy, modern dark mode, technical precision, high-contrast, adventure sports aesthetic.
- **Tone:** Authoritative, high-performance, accessible, safety-first.

---

## 2. Color Palette & CSS Variables (`src/styles/global.css`)

All colors are controlled dynamically via CSS custom properties on `:root` and `.dark` layers:

```css
@theme {
  --color-canvas: var(--theme-canvas);
  --color-parchment: var(--theme-parchment);
  --color-input: var(--theme-input);
  --color-hairline: var(--theme-hairline);
  --color-ink: var(--theme-ink);
  --color-mute: var(--theme-mute);
  --color-accent: var(--theme-accent);
  --color-primary: var(--theme-primary);
}
```

### Dark Mode Tokens (Default)
- **`--theme-canvas`**: `#090A0C` (Deep titanium/carbon background)
- **`--theme-parchment`**: `#121316` (Elevated card container surface)
- **`--theme-input`**: `#18191E` (Input and secondary badge surface)
- **`--theme-hairline`**: `rgba(255, 255, 255, 0.08)` (Subtle crisp borders)
- **`--theme-ink`**: `#FAFAFA` (High-contrast pure white text)
- **`--theme-mute`**: `#A1A1AA` (Readable muted body text)
- **`--theme-accent`**: `#FF6B00` (High-Vis Action Sports Orange)
- **`--theme-primary`**: `#FAFAFA`

### Light Mode Tokens
- **`--theme-canvas`**: `#F8FAFC` (Slate 50 snow canvas)
- **`--theme-parchment`**: `#FFFFFF` (Pure white cards)
- **`--theme-input`**: `#F1F5F9` (Slate 100 inputs)
- **`--theme-hairline`**: `#E2E8F0` (Slate 200 borders)
- **`--theme-ink`**: `#0F172A` (Slate 900 primary text)
- **`--theme-mute`**: `#64748B` (Slate 500 secondary text)
- **`--theme-accent`**: `#FF6B00` (High-Vis Orange)
- **`--theme-primary`**: `#0F172A`

---

## 3. Typography
- **Primary Body & Headings:** `Inter`, `system-ui`, `-apple-system`, sans-serif
- **Numerical & DIN Readouts:** `ui-monospace`, `JetBrains Mono`, monospace (with tabular numbers `tnum` for zero-jitter updates)

---

## 4. Key UI Components

### 4.1 The Unit Switcher
- Segmented pill switch: `[ Imperial (lbs, ft) | Metric (kg, cm) ]`
- Automated locale detection (`Intl.Locale`) on first load with persistent `localStorage` preference.

### 4.2 Skier Type Selector
- 5 distinct selectable buttons (Type -I, Type I, Type II, Type III, Type III+) with visual release vs retention indicators.

### 4.3 The DIN Dial / Gauge Display (`DinGauge.tsx`)
- Animated curved SVG torque arc with dynamic safety color zones (Green, Yellow, Orange, Red) and precision needle tracking.

### 4.4 Interactive ISO Matrix (`MatrixTable.tsx`)
- Live matrix coordinates table highlighting the exact intersection row (Skier Code) and column (BSL range) in real time.

### 4.5 Responsive Accordion FAQ (`AccordionFAQ.tsx`)
- High-performance React accordion with 12 Google SERP-matched queries, fluid mobile-first touch targets, and full JSON-LD schema parity.
