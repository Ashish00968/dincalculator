/**
 * Single source of truth for ISO 11088:2023 algorithm rules, wording, and step definitions.
 * Both the calculation engine, the breakdown drawer, and on-page guides import from here.
 */

export const STANDARD_VERSION = 'ISO 11088:2023';
export const STANDARD_EDITION = 'Edition 7 (March 2023)';
export const ENGINE_VERSION = '2.0.0';

export interface RuleStepDefinition {
  step: number;
  titleKey: string;
  title: string;
  descriptionKey: string;
  description: string;
}

export const ALGORITHM_STEPS: RuleStepDefinition[] = [
  {
    step: 1,
    titleKey: 'rules.step1.title',
    title: 'Skier Weight & Height Classification',
    descriptionKey: 'rules.step1.desc',
    description: 'Determine preliminary Skier Codes from body weight and height. Height is evaluated only for skiers weighing 42 kg (92 lbs) or more (Code H+). If weight and height yield different codes, select the row closer to the top of the chart (lower code) for conservative safety.',
  },
  {
    step: 2,
    titleKey: 'rules.step2.title',
    title: 'Skier Type Capability Adjustment',
    descriptionKey: 'rules.step2.desc',
    description: 'Type I uses the baseline row. Type II moves one row lower on the chart (higher DIN). Type III moves two rows lower on the chart (higher DIN). Type III+ moves three rows lower (manufacturer extension). Type -I moves one row higher (lower DIN, for skiers over 17 kg). Skiers weighing 13 kg or less receive no ability modifier.',
  },
  {
    step: 3,
    titleKey: 'rules.step3.title',
    title: 'Age Modifier',
    descriptionKey: 'rules.step3.desc',
    description: 'Skiers under 10 years old, or 50 years and older, move one row higher on the chart (lower DIN) to account for bone density and joint vulnerability. Skiers weighing 13 kg or less receive no age modifier.',
  },
  {
    step: 4,
    titleKey: 'rules.step4.title',
    title: 'Boot Sole Length (BSL) Matrix Lookup',
    descriptionKey: 'rules.step4.desc',
    description: 'Cross-reference the final adjusted Skier Code with the Boot Sole Length (BSL in mm) on the ISO matrix. If the intersection falls on a blank cell, the nearest horizontal valid cell is selected, choosing the lower (safer) value in equidistant cases.',
  },
];

export const SKIER_TYPE_DESCRIPTIONS = {
  '-I': {
    name: 'Type -I',
    shortDesc: 'Extremely cautious / Junior beginner',
    rowShift: -1,
    shiftText: 'One row higher on the chart (lower DIN / easier release)',
    applicable: 'Weight > 17 kg / 38 lbs only',
  },
  'I': {
    name: 'Type I',
    shortDesc: 'Cautious / Beginner on smooth gentle slopes',
    rowShift: 0,
    shiftText: 'Baseline row (no shift)',
    applicable: 'All skiers',
  },
  'II': {
    name: 'Type II',
    shortDesc: 'Moderate / Intermediate all-mountain',
    rowShift: 1,
    shiftText: 'One row lower on the chart (higher DIN / increased retention)',
    applicable: 'Weight > 13 kg / 29 lbs',
  },
  'III': {
    name: 'Type III',
    shortDesc: 'Aggressive / Advanced on steep and fast terrain',
    rowShift: 2,
    shiftText: 'Two rows lower on the chart (higher DIN / maximum retention)',
    applicable: 'Weight > 13 kg / 29 lbs',
  },
  'III+': {
    name: 'Type III+',
    shortDesc: 'Extreme / Freeride / Racer (Manufacturer convention)',
    rowShift: 3,
    shiftText: 'Three rows lower on the chart (manufacturer convention for extreme retention)',
    applicable: 'Weight > 13 kg / 29 lbs',
  },
} as const;

export const SAFETY_DISCLAIMER_TEXT =
  'Based on ISO 11088:2023. Independent project, not affiliated with ISO or binding manufacturers. This tool provides an informational starting point. Ski bindings must always be inspected, calibrated, and mechanically torque-tested on calibrated workshop equipment by a trained ski technician before use.';
