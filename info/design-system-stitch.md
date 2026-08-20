---
name: Alpine Precision
colors:
  surface: '#0B1120'
  surface-dim: '#0B1120'
  surface-bright: '#1E293B'
  surface-container-lowest: '#020617'
  surface-container-low: '#0B1120'
  surface-container: '#0F172A'
  surface-container-high: '#1E293B'
  surface-container-highest: '#334155'
  on-surface: '#F8FAFC'
  on-surface-variant: '#94A3B8'
  inverse-surface: '#F8FAFC'
  inverse-on-surface: '#0B1120'
  outline: '#475569'
  outline-variant: '#1E293B'
  surface-tint: '#0284C7'
  primary: '#38BDF8'
  on-primary: '#0B1120'
  primary-container: '#0284C7'
  on-primary-container: '#F0F9FF'
  inverse-primary: '#0369A1'
  secondary: '#F8FAFC'
  on-secondary: '#0F172A'
  secondary-container: '#334155'
  on-secondary-container: '#F8FAFC'
  tertiary: '#10B981'
  on-tertiary: '#064E3B'
  tertiary-container: '#047857'
  on-tertiary-container: '#D1FAE5'
  error: '#F87171'
  on-error: '#450A0A'
  error-container: '#991B1B'
  on-error-container: '#FEE2E2'
  primary-fixed: '#BAE6FD'
  primary-fixed-dim: '#7DD3FC'
  on-primary-fixed: '#0C4A6E'
  on-primary-fixed-variant: '#0369A1'
  secondary-fixed: '#F1F5F9'
  secondary-fixed-dim: '#E2E8F0'
  on-secondary-fixed: '#0F172A'
  on-secondary-fixed-variant: '#334155'
  tertiary-fixed: '#A7F3D0'
  tertiary-fixed-dim: '#6EE7B7'
  on-tertiary-fixed: '#064E3B'
  on-tertiary-fixed-variant: '#047857'
  background: '#0B1120'
  on-background: '#F8FAFC'
  surface-variant: '#1E293B'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 40px
  gutter: 24px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  max-width: 1440px
---

## Brand & Style
This design system embodies a modern "Alpine Precision & Snow Performance" aesthetic. It's built for power users requiring highly accurate ski binding settings, merging rugged mountain energy with precise scientific calculation.

The style utilizes a deep Slate Navy base (#0B1120) with Crisp Snow White (#F8FAFC) for high contrast and Electric Glacier Blue (#38BDF8) for dynamic accents.

## Typography
- **Inter** is the primary UI and heading font, giving a sleek, highly legible, and modern feel.
- **JetBrains Mono** is used for all numeric inputs, readouts, labels, and DIN metrics, emphasizing the "calculator/precision tool" aspect of the app.

## Layout & Glassmorphism
The design relies on "Glassmorphism" for its primary calculator cards. 
- **Surfaces** use a deep slate color with a backdrop-blur effect, making the UI feel like frosted glass over a dark mountain background.
- Emphasize distinct visual borders (`border-alpine-700` which maps to our outline color) and subtle inner shadows to differentiate layers.
- The interface is centered on a calculator card layout, keeping inputs compact, with immediate, highly-visible readouts of the calculations.

## Components
- **Cards**: Softly rounded (`rounded-xl` or 1rem) to contrast with the sharp numeric data. They should look like high-end ski equipment displays.
- **Buttons**: Action buttons should use strong, vibrant colors. Glacier Blue for primary actions, Emerald (#10B981) for safe states, and Amber (#F59E0B) for cautions/warnings.
- **Data Tables**: Matrices should use a distinct hover effect (e.g., cell glowing) to highlight the intersection of row and column.
