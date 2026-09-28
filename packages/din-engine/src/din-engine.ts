import type { SkierProfile, DinResult, BslRange, DinNote } from './types';
import { ALGORITHM_STEPS, SKIER_TYPE_DESCRIPTIONS } from './rules';

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
 * ISO 11088:2023 DIN Lookup Matrix (Codes A through P x 8 BSL Ranges)
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
 * Get Skier Code index for weight according to ISO 11088:2023 Table 1
 * Supports both metric (kg) and imperial (lbs) columns directly to prevent boundary rounding errors.
 */
export function getWeightCodeIndex(weightKg: number, weightLbs?: number): number {
  if (weightLbs !== undefined && weightLbs > 0) {
    if (weightLbs <= 29) return 0; // A (22–29 lbs)
    if (weightLbs <= 38) return 1; // B (30–38 lbs)
    if (weightLbs <= 47) return 2; // C (39–47 lbs)
    if (weightLbs <= 56) return 3; // D (48–56 lbs)
    if (weightLbs <= 66) return 4; // E (57–66 lbs)
    if (weightLbs <= 78) return 5; // F (67–78 lbs)
    if (weightLbs <= 91) return 6; // G (79–91 lbs)
    if (weightLbs <= 107) return 7; // H (92–107 lbs)
    if (weightLbs <= 125) return 8; // I (108–125 lbs)
    if (weightLbs <= 147) return 9; // J (126–147 lbs)
    if (weightLbs <= 174) return 10; // K (148–174 lbs)
    if (weightLbs <= 209) return 11; // L (175–209 lbs)
    return 12; // M (>= 210 lbs)
  }

  if (weightKg <= 13) return 0; // A (10–13 kg)
  if (weightKg <= 17) return 1; // B (14–17 kg)
  if (weightKg <= 21) return 2; // C (18–21 kg)
  if (weightKg <= 25) return 3; // D (22–25 kg)
  if (weightKg <= 30) return 4; // E (26–30 kg)
  if (weightKg <= 35) return 5; // F (31–35 kg)
  if (weightKg <= 41) return 6; // G (36–41 kg)
  if (weightKg <= 48) return 7; // H (42–48 kg)
  if (weightKg <= 57) return 8; // I (49–57 kg)
  if (weightKg <= 66) return 9; // J (58–66 kg)
  if (weightKg <= 78) return 10; // K (67–78 kg)
  if (weightKg <= 94) return 11; // L (79–94 kg)
  return 12; // M (>= 95 kg)
}

/**
 * Get Skier Code index for height according to ISO 11088:2023 Table 1
 * Height is only evaluated when weight reaches Code H (>=42 kg / >=92 lbs).
 * Supports both metric (cm) and imperial (total inches) columns.
 */
export function getHeightCodeIndex(heightCm: number, heightInches?: number): number {
  if (heightInches !== undefined && heightInches > 0) {
    if (heightInches <= 58) return 7; // H (<= 4'10" / 58 in)
    if (heightInches <= 61) return 8; // I (4'11"–5'1" / 59–61 in)
    if (heightInches <= 65) return 9; // J (5'2"–5'5" / 62–65 in)
    if (heightInches <= 70) return 10; // K (5'6"–5'10" / 66–70 in)
    if (heightInches <= 76) return 11; // L (5'11"–6'4" / 71–76 in)
    return 12; // M (>= 6'5" / 77+ in)
  }

  if (heightCm <= 148) return 7; // H (<= 148 cm)
  if (heightCm <= 157) return 8; // I (149–157 cm)
  if (heightCm <= 166) return 9; // J (158–166 cm)
  if (heightCm <= 178) return 10; // K (167–178 cm)
  if (heightCm <= 194) return 11; // L (179–194 cm)
  return 12; // M (>= 195 cm)
}

/**
 * Find Boot Sole Length (BSL) bracket index using continuous comparisons to prevent gaps.
 */
export function getBslRangeIndex(bslMm: number): number {
  if (bslMm <= 230) return 0;
  if (bslMm <= 250) return 1;
  if (bslMm <= 270) return 2;
  if (bslMm <= 290) return 3;
  if (bslMm <= 310) return 4;
  if (bslMm <= 330) return 5;
  if (bslMm <= 350) return 6;
  return 7;
}

export function getBslRange(bslMm: number): BslRange {
  const index = getBslRangeIndex(bslMm);
  return BSL_RANGES[index];
}

/**
 * Converts imperial units to metric while retaining exact imperial numbers
 */
export function imperialToMetric(weightLbs: number, heightFt: number, heightIn: number) {
  const weightKg = weightLbs * 0.45359237;
  const totalInches = heightFt * 12 + heightIn;
  const heightCm = totalInches * 2.54;
  return { weightKg, heightCm, weightLbs, totalInches };
}

export function calculateDin(profile: SkierProfile): DinResult {
  const notes: DinNote[] = [];

  // Validate and clamp BSL within 200–400 mm
  let effectiveBsl = profile.bslMm;
  if (effectiveBsl < 200) {
    effectiveBsl = 200;
    notes.push({ key: 'note.bslClampedMin', params: { rawBsl: profile.bslMm, clampedBsl: 200 } });
  } else if (effectiveBsl > 400) {
    effectiveBsl = 400;
    notes.push({ key: 'note.bslClampedMax', params: { rawBsl: profile.bslMm, clampedBsl: 400 } });
  }

  const weightIdx = getWeightCodeIndex(profile.weightKg, profile.weightLbs);
  const weightCode = SKIER_CODES[weightIdx];

  let heightIdx: number | null = null;
  let heightCode: string | null = null;
  let baselineIdx = weightIdx;

  // Height is evaluated only if weight corresponds to Code H (index 7) or higher
  const hasHeight = (profile.heightCm !== undefined && profile.heightCm > 0) || (profile.heightInches !== undefined && profile.heightInches > 0);
  if (weightIdx >= 7 && hasHeight) {
    heightIdx = getHeightCodeIndex(profile.heightCm ?? 0, profile.heightInches);
    heightCode = SKIER_CODES[heightIdx];

    // Conflict resolution: Choose the row closer to the top of the chart (lesser index)
    if (heightIdx < weightIdx) {
      baselineIdx = heightIdx;
      notes.push({
        key: 'note.heightLower',
        params: {
          heightCm: profile.heightCm ? Math.round(profile.heightCm) : 0,
          heightCode,
          weightKg: profile.weightKg.toFixed(1),
          weightCode,
          baselineCode: SKIER_CODES[baselineIdx],
        },
      });
    } else if (weightIdx < heightIdx) {
      notes.push({
        key: 'note.weightLower',
        params: {
          weightKg: profile.weightKg.toFixed(1),
          weightCode,
          heightCm: profile.heightCm ? Math.round(profile.heightCm) : 0,
          heightCode,
          baselineCode: SKIER_CODES[baselineIdx],
        },
      });
    }
  }

  const baselineCode = SKIER_CODES[baselineIdx];
  const initialCode = baselineCode;

  let skierTypeMod = 0;
  let ageMod = 0;
  let isLighterSkierCapped = false;

  const isUnder13Kg = profile.weightLbs !== undefined ? profile.weightLbs <= 29 : profile.weightKg <= 13;
  const isUnder17Kg = profile.weightLbs !== undefined ? profile.weightLbs <= 38 : profile.weightKg <= 17;

  // Safety Constraint 1: For skiers weighing <= 13 kg (29 lbs), no ability or age modifications are permitted
  if (isUnder13Kg) {
    isLighterSkierCapped = true;
    notes.push({ key: 'note.lightSkierCapped' });
  } else {
    // Skier Type Adjustment
    switch (profile.skierType) {
      case '-I':
        if (!isUnder17Kg) {
          skierTypeMod = -1;
          notes.push({ key: 'note.typeMinusI' });
        } else {
          notes.push({ key: 'note.typeMinusINotAllowed' });
        }
        break;
      case 'I':
        skierTypeMod = 0;
        break;
      case 'II':
        skierTypeMod = 1;
        notes.push({ key: 'note.typeII' });
        break;
      case 'III':
        skierTypeMod = 2;
        notes.push({ key: 'note.typeIII' });
        break;
      case 'III+':
        skierTypeMod = 3;
        notes.push({ key: 'note.typeIIIplus' });
        break;
    }

    // Age Adjustment: < 10 or >= 50
    if (profile.age < 10) {
      ageMod = -1;
      notes.push({ key: 'note.ageJunior', params: { age: profile.age } });
    } else if (profile.age >= 50) {
      ageMod = -1;
      notes.push({ key: 'note.ageSenior', params: { age: profile.age } });
    }
  }

  // Calculate final code index with clamping between A (0) and P (15)
  let finalIdx = baselineIdx + skierTypeMod + ageMod;
  if (finalIdx < 0) finalIdx = 0;
  if (finalIdx >= SKIER_CODES.length) finalIdx = SKIER_CODES.length - 1;

  const adjustedCode = SKIER_CODES[finalIdx];
  const bslRange = getBslRange(effectiveBsl);
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
        } else if (dist === minDistance && closestVal !== null) {
          // Tie-break rule: select the lower (safer) DIN value
          if (val < closestVal) {
            closestVal = val;
          }
        }
      }
    }
    din = closestVal ?? 1.0;
    notes.push({ key: 'note.bslNonStandard', params: { bslMm: effectiveBsl, code: adjustedCode, din } });
  }

  // Determine warning level
  let warningLevel: 'safe' | 'caution' | 'warning' = 'safe';
  if (din >= 10.0 || profile.skierType === 'III+') {
    warningLevel = 'warning';
  } else if (din >= 8.0 || ageMod !== 0) {
    warningLevel = 'caution';
  }

  // Structured algorithm steps for breakdown drawer and transparency
  const algorithmSteps = [
    {
      step: 1,
      title: ALGORITHM_STEPS[0].title,
      description: `Baseline Code: ${baselineCode} (Weight Code: ${weightCode}${heightCode ? `, Height Code: ${heightCode}` : ''})`,
      value: baselineCode,
    },
    {
      step: 2,
      title: ALGORITHM_STEPS[1].title,
      description: `Skier ${SKIER_TYPE_DESCRIPTIONS[profile.skierType].name} (${SKIER_TYPE_DESCRIPTIONS[profile.skierType].shiftText}): ${skierTypeMod >= 0 ? `+${skierTypeMod}` : skierTypeMod} row shift`,
      value: skierTypeMod >= 0 ? `+${skierTypeMod}` : `${skierTypeMod}`,
    },
    {
      step: 3,
      title: ALGORITHM_STEPS[2].title,
      description: ageMod !== 0 ? `Age ${profile.age}: ${ageMod} row shift (safety reduction)` : `Age ${profile.age}: Standard adult band (0 shift)`,
      value: ageMod !== 0 ? `${ageMod}` : '0',
    },
    {
      step: 4,
      title: ALGORITHM_STEPS[3].title,
      description: `Final Adjusted Code ${adjustedCode} × BSL bracket "${bslRange.label}" → DIN ${din.toFixed(2)}`,
      value: din.toFixed(2),
    },
  ];

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
    algorithmSteps,
  };
}

export const calculateDIN = calculateDin;

