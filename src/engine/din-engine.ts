import type { SkierProfile, DinResult, BslRange } from './types';

export const SKIER_CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] as const;

export const BSL_RANGES: BslRange[] = [
  { min: 0, max: 230, label: '≤ 230 mm', index: 0 },
  { min: 231, max: 250, label: '231–250 mm', index: 1 },
  { min: 251, max: 270, label: '251–270 mm', index: 2 },
  { min: 271, max: 290, label: '271–290 mm', index: 3 },
  { min: 291, max: 310, label: '291–310 mm', index: 4 },
  { min: 311, max: 330, label: '311–330 mm', index: 5 },
  { min: 331, max: 350, label: '331–350 mm', index: 6 },
  { min: 351, max: 9999, label: '≥ 351 mm', index: 7 },
];

/**
 * ISO 11088 DIN Lookup Matrix (Codes A through P x 8 BSL Ranges)
 * null indicates blank cell (requires horizontal fallback to nearest value)
 */
export const ISO_11088_MATRIX: (number | null)[][] = [
  // <=230, 231-250, 251-270, 271-290, 291-310, 311-330, 331-350, >=351
  [0.75, 0.75, 0.75, null, null, null, null, null], // A
  [1.00, 0.75, 0.75, 0.75, null, null, null, null], // B
  [1.50, 1.25, 1.25, 1.00, null, null, null, null], // C
  [2.00, 1.75, 1.50, 1.50, 1.25, null, null, null], // D
  [2.50, 2.25, 2.00, 1.75, 1.50, 1.50, null, null], // E
  [3.00, 2.75, 2.50, 2.25, 2.00, 1.75, 1.75, null], // F
  [null, 3.50, 3.00, 2.75, 2.50, 2.25, 2.00, null], // G
  [null, null, 3.50, 3.00, 3.00, 2.75, 2.50, null], // H
  [null, null, 4.50, 4.00, 3.50, 3.50, 3.00, null], // I
  [null, null, 5.50, 5.00, 4.50, 4.00, 3.50, 3.00], // J
  [null, null, 6.50, 6.00, 5.50, 5.00, 4.50, 4.00], // K
  [null, null, 7.50, 7.00, 6.50, 6.00, 5.50, 5.00], // L
  [null, null, 8.50, 8.00, 7.00, 6.50, 6.00, 5.50], // M
  [null, null, 10.0, 9.50, 8.50, 8.00, 7.50, null], // N
  [null, null, 11.5, 11.0, 10.0, 9.50, 9.00, null], // O
  [null, null, null, null, 12.0, 11.0, 10.5, null], // P
];

/**
 * Get Skier Code index for weight according to ISO 11088 Table 1
 */
export function getWeightCodeIndex(weightKg: number): number {
  if (weightKg <= 13) return 0; // A (10–13 kg / 22–29 lbs)
  if (weightKg <= 17) return 1; // B (14–17 kg / 30–38 lbs)
  if (weightKg <= 21) return 2; // C (18–21 kg / 39–47 lbs)
  if (weightKg <= 25) return 3; // D (22–25 kg / 48–56 lbs)
  if (weightKg <= 30) return 4; // E (26–30 kg / 57–66 lbs)
  if (weightKg <= 35) return 5; // F (31–35 kg / 67–78 lbs)
  if (weightKg <= 41) return 6; // G (36–41 kg / 79–91 lbs)
  if (weightKg <= 48) return 7; // H (42–48 kg / 92–107 lbs)
  if (weightKg <= 57) return 8; // I (49–57 kg / 108–125 lbs)
  if (weightKg <= 66) return 9; // J (58–66 kg / 126–147 lbs)
  if (weightKg <= 78) return 10; // K (67–78 kg / 148–174 lbs)
  if (weightKg <= 94) return 11; // L (79–94 kg / 175–209 lbs)
  return 12; // M (>= 95 kg / >= 210 lbs)
}

/**
 * Get Skier Code index for height according to ISO 11088 Table 1
 * Height is only evaluated when weight reaches Code H (>=42 kg)
 */
export function getHeightCodeIndex(heightCm: number): number {
  if (heightCm <= 148) return 7; // H (<= 148 cm / <= 4'10")
  if (heightCm <= 157) return 8; // I (149–157 cm / 4'11"–5'1")
  if (heightCm <= 166) return 9; // J (158–166 cm / 5'2"–5'5")
  if (heightCm <= 178) return 10; // K (167–178 cm / 5'6"–5'10")
  if (heightCm <= 194) return 11; // L (179–194 cm / 5'11"–6'4")
  return 12; // M (>= 195 cm / >= 6'5")
}

/**
 * Find Boot Sole Length (BSL) bracket index
 */
export function getBslRange(bslMm: number): BslRange {
  for (const range of BSL_RANGES) {
    if (bslMm >= range.min && bslMm <= range.max) {
      return range;
    }
  }
  return BSL_RANGES[4]; // Default fallback to 291–310 mm
}

/**
 * Converts imperial units to metric
 */
export function imperialToMetric(weightLbs: number, heightFt: number, heightIn: number) {
  const weightKg = weightLbs * 0.45359237;
  const totalInches = heightFt * 12 + heightIn;
  const heightCm = totalInches * 2.54;
  return { weightKg, heightCm };
}

/**
 * Pure ISO 11088 DIN Calculation Function
 */
export function calculateDin(profile: SkierProfile): DinResult {
  const notes: string[] = [];
  const weightIdx = getWeightCodeIndex(profile.weightKg);
  const weightCode = SKIER_CODES[weightIdx];

  let heightIdx: number | null = null;
  let heightCode: string | null = null;
  let baselineIdx = weightIdx;

  // Height is evaluated only if weight corresponds to Code H (index 7) or higher
  if (weightIdx >= 7 && profile.heightCm !== undefined && profile.heightCm > 0) {
    heightIdx = getHeightCodeIndex(profile.heightCm);
    heightCode = SKIER_CODES[heightIdx];

    // Conflict resolution: Choose the row closer to the top of the chart (lesser index)
    if (heightIdx < weightIdx) {
      baselineIdx = heightIdx;
      notes.push(
        `Height (${Math.round(profile.heightCm)}cm / Code ${heightCode}) is lower on the chart than weight (${profile.weightKg.toFixed(1)}kg / Code ${weightCode}). ISO standard mandates using the safer baseline Code ${SKIER_CODES[baselineIdx]}.`
      );
    } else if (weightIdx < heightIdx) {
      notes.push(
        `Weight (${profile.weightKg.toFixed(1)}kg / Code ${weightCode}) is lower on the chart than height (${Math.round(profile.heightCm)}cm / Code ${heightCode}). Used safer baseline Code ${SKIER_CODES[baselineIdx]}.`
      );
    }
  }

  const baselineCode = SKIER_CODES[baselineIdx];
  const initialCode = baselineCode;

  let skierTypeMod = 0;
  let ageMod = 0;
  let isLighterSkierCapped = false;

  // Safety Constraint 1: For skiers weighing <= 13 kg (Code A), no modifications permitted
  if (profile.weightKg <= 13) {
    isLighterSkierCapped = true;
    notes.push('For skiers weighing 13 kg (29 lbs) or less, ISO 11088 strictly mandates no skier type or age adjustments.');
  } else {
    // Skier Type Adjustment
    switch (profile.skierType) {
      case '-I':
        if (profile.weightKg > 17) {
          skierTypeMod = -1;
          notes.push('Skier Type -I (Extremely Cautious) adjusts setting 1 row up (-1 code letter).');
        } else {
          notes.push('Skier Type -I is not permitted for skiers 17 kg (38 lbs) or under.');
        }
        break;
      case 'I':
        skierTypeMod = 0;
        break;
      case 'II':
        skierTypeMod = 1;
        notes.push('Skier Type II (Moderate) adjusts setting 1 row down (+1 code letter).');
        break;
      case 'III':
        skierTypeMod = 2;
        notes.push('Skier Type III (Aggressive) adjusts setting 2 rows down (+2 code letters).');
        break;
      case 'III+':
        skierTypeMod = 3;
        notes.push('Skier Type III+ (Racer/Extreme) adjusts setting 3 rows down (+3 code letters).');
        break;
    }

    // Age Adjustment
    if (profile.age < 10) {
      ageMod = -1;
      notes.push(`Junior skier age (${profile.age} yrs) applies a safety adjustment of 1 row up (-1 code letter).`);
    } else if (profile.age >= 50) {
      ageMod = -1;
      notes.push(`Skier age 50+ (${profile.age} yrs) applies a safety adjustment of 1 row up (-1 code letter).`);
    }
  }

  // Calculate final code index with clamping between A (0) and P (15)
  let finalIdx = baselineIdx + skierTypeMod + ageMod;
  if (finalIdx < 0) finalIdx = 0;
  if (finalIdx >= SKIER_CODES.length) finalIdx = SKIER_CODES.length - 1;

  const adjustedCode = SKIER_CODES[finalIdx];
  const bslRange = getBslRange(profile.bslMm);
  const colIdx = bslRange.index;

  // Matrix lookup
  let din = ISO_11088_MATRIX[finalIdx][colIdx];

  // Blank cell horizontal resolution
  if (din === null) {
    let closestVal: number | null = null;
    let minDistance = Infinity;
    for (let c = 0; c < ISO_11088_MATRIX[finalIdx].length; c++) {
      const val = ISO_11088_MATRIX[finalIdx][c];
      if (val !== null) {
        const dist = Math.abs(c - colIdx);
        if (dist < minDistance) {
          minDistance = dist;
          closestVal = val;
        }
      }
    }
    din = closestVal ?? 1.0;
    notes.push(
      `BSL of ${profile.bslMm}mm falls on a non-standard column for Code ${adjustedCode}; adjusted horizontally to nearest valid ISO setting (${din}).`
    );
  }

  // Determine warning level
  let warningLevel: 'safe' | 'caution' | 'warning' = 'safe';
  if (din >= 10.0 || profile.skierType === 'III+') {
    warningLevel = 'warning';
  } else if (din >= 8.0 || ageMod !== 0) {
    warningLevel = 'caution';
  }

  return {
    din,
    initialCode,
    adjustedCode,
    weightCode,
    heightCode,
    baselineCode,
    skierTypeModifier: skierTypeMod,
    ageModifier: ageMod,
    bslRangeLabel: bslRange.label,
    isLighterSkierCapped,
    notes,
    warningLevel,
  };
}
