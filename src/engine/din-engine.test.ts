import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDin, imperialToMetric } from './din-engine.ts';

test('Scenario 1: Standard Intermediate Adult (72kg, 175cm, Type II, Age 28, BSL 305mm)', () => {
  const result = calculateDin({
    weightKg: 72,
    heightCm: 175,
    age: 28,
    skierType: 'II',
    bslMm: 305,
  });

  // Weight 72kg -> K (10), Height 175cm -> K (10) -> Baseline K
  // Type II -> +1 -> Final Code L (11)
  // BSL 305mm -> 291–310 mm (col index 4)
  // Matrix[L][4] = 6.50
  assert.equal(result.baselineCode, 'K');
  assert.equal(result.adjustedCode, 'L');
  assert.equal(result.skierTypeModifier, 1);
  assert.equal(result.ageModifier, 0);
  assert.equal(result.din, 6.5);
});

test('Scenario 2: Beginner Adult (62kg, 162cm, Type I, Age 32, BSL 285mm)', () => {
  const result = calculateDin({
    weightKg: 62,
    heightCm: 162,
    age: 32,
    skierType: 'I',
    bslMm: 285,
  });

  // Weight 62kg -> J, Height 162cm -> J -> Baseline J
  // Type I -> 0 -> Final Code J
  // BSL 285mm -> 271–290 mm (col index 3)
  // Matrix[J][3] = 5.00
  assert.equal(result.baselineCode, 'J');
  assert.equal(result.adjustedCode, 'J');
  assert.equal(result.din, 5.0);
});

test('Scenario 3: Senior Skier (68kg, 170cm, Type II, Age 58, BSL 298mm)', () => {
  const result = calculateDin({
    weightKg: 68,
    heightCm: 170,
    age: 58,
    skierType: 'II',
    bslMm: 298,
  });

  // Weight 68kg -> K, Height 170cm -> K -> Baseline K
  // Type II -> +1, Age 58 -> -1 => Net modifier 0 -> Final Code K
  // BSL 298mm -> 291–310 mm (col index 4)
  // Matrix[K][4] = 5.50
  assert.equal(result.baselineCode, 'K');
  assert.equal(result.adjustedCode, 'K');
  assert.equal(result.skierTypeModifier, 1);
  assert.equal(result.ageModifier, -1);
  assert.equal(result.din, 5.5);
});

test('Scenario 4: Toddler / Very Light Skier (12kg, Age 4, Type I, BSL 215mm)', () => {
  const result = calculateDin({
    weightKg: 12,
    age: 4,
    skierType: 'I',
    bslMm: 215,
  });

  // Weight 12kg -> A. Under 13kg safety cap -> No age or type mod allowed
  assert.equal(result.isLighterSkierCapped, true);
  assert.equal(result.baselineCode, 'A');
  assert.equal(result.adjustedCode, 'A');
  assert.equal(result.din, 0.75);
});

test('Scenario 5: Aggressive Expert (88kg, 185cm, Type III, Age 26, BSL 315mm)', () => {
  const result = calculateDin({
    weightKg: 88,
    heightCm: 185,
    age: 26,
    skierType: 'III',
    bslMm: 315,
  });

  // Weight 88kg -> L, Height 185cm -> L -> Baseline L
  // Type III -> +2 -> Final Code N
  // BSL 315mm -> 311–330 mm (col index 5)
  // Matrix[N][5] = 8.00
  assert.equal(result.baselineCode, 'L');
  assert.equal(result.adjustedCode, 'N');
  assert.equal(result.skierTypeModifier, 2);
  assert.equal(result.din, 8.0);
});

test('Scenario 6: Height vs Weight Conflict (Tall & Thin: 54kg [I], 185cm [L])', () => {
  const result = calculateDin({
    weightKg: 54,
    heightCm: 185,
    age: 25,
    skierType: 'I',
    bslMm: 295,
  });

  // Weight 54kg -> I, Height 185cm -> L. Lighter/safer row selected -> Baseline I
  assert.equal(result.weightCode, 'I');
  assert.equal(result.heightCode, 'L');
  assert.equal(result.baselineCode, 'I');
  assert.equal(result.adjustedCode, 'I');
  // BSL 295mm -> 291–310 mm -> Matrix[I][4] = 3.50
  assert.equal(result.din, 3.5);
});

test('Scenario 7: Blank Cell Horizontal Fallback (Code A with BSL 305mm)', () => {
  const result = calculateDin({
    weightKg: 12,
    age: 3,
    skierType: 'I',
    bslMm: 305,
  });

  // Code A at BSL 305mm is blank -> nearest valid cell on row A is col 2 (0.75)
  assert.equal(result.adjustedCode, 'A');
  assert.equal(result.din, 0.75);
});

test('Scenario 8: Imperial conversion utility check', () => {
  const { weightKg, heightCm } = imperialToMetric(165, 5, 10);
  assert.ok(Math.abs(weightKg - 74.84) < 0.1);
  assert.ok(Math.abs(heightCm - 177.8) < 0.1);
});
