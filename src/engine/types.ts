export type SkierTypeCode = '-I' | 'I' | 'II' | 'III' | 'III+';

export type UnitSystem = 'imperial' | 'metric';

export interface SkierProfile {
  weightKg: number;
  heightCm?: number;
  age: number;
  skierType: SkierTypeCode;
  bslMm: number;
}

export interface DinResult {
  din: number;
  initialCode: string;
  adjustedCode: string;
  weightCode: string;
  heightCode: string | null;
  baselineCode: string;
  skierTypeModifier: number;
  ageModifier: number;
  bslRangeLabel: string;
  isLighterSkierCapped: boolean;
  notes: string[];
  warningLevel: 'safe' | 'caution' | 'warning';
}

export interface BslRange {
  min: number;
  max: number;
  label: string;
  index: number;
}
