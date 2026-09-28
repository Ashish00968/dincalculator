import { describe, it, expect } from 'vitest';
import { calculateDin } from './din-engine';
import goldenCases from '../../tests/golden.json';

describe('ISO 11088:2023 Comprehensive Golden Test Suite', () => {
  it(`successfully verifies all ${goldenCases.length} golden test cases`, () => {
    const startTime = performance.now();

    for (let i = 0; i < goldenCases.length; i++) {
      const c = goldenCases[i];
      const result = calculateDin({
        weightKg: c.weightKg,
        heightCm: c.heightCm,
        age: c.age,
        skierType: c.skierType as any,
        bslMm: c.bslMm,
      });

      expect(result.baselineCode, `Case #${i} baselineCode failed`).toBe(c.expectedBaselineCode);
      expect(result.adjustedCode, `Case #${i} adjustedCode failed`).toBe(c.expectedAdjustedCode);
      expect(result.din, `Case #${i} DIN failed for ${JSON.stringify(c)}`).toBe(c.expectedDin);
    }

    const duration = performance.now() - startTime;
    expect(duration).toBeLessThan(3000); // Must run in under 3 seconds
  });
});
