# ISO 11088 DIN Calculation Engine Specification

## 1. Overview
The DIN calculation engine is a pure, deterministic mathematical module that calculates ski binding release settings according to the international standard **ISO 11088** ("Assembly, adjustment and inspection of the ski-binding-boot system").

---

## 2. Input Parameters

| Parameter | Type | Valid Range | Description |
| :--- | :--- | :--- | :--- |
| `weightKg` | `number` | 10 – 150+ kg | Skier weight (converted from lbs if imperial) |
| `heightCm` | `number` | 100 – 220+ cm | Skier height (converted from ft/in if imperial) |
| `age` | `number` | 1 – 100 years | Skier age |
| `skierType` | `enum` | `-1`, `1`, `2`, `3`, `4` | `Type -I` (0), `Type I` (1), `Type II` (2), `Type III` (3), `Type III+` (4) |
| `bslMm` | `number` | 200 – 400 mm | Boot Sole Length stamped on boot heel in mm |

---

## 3. Step-by-Step Calculation Algorithm

### Step 1: Find Weight Skier Code
Locate the skier's weight row in the **Skier Code Matrix**:
- 10 – 13 kg (22 – 29 lbs) $\rightarrow$ `A`
- 14 – 17 kg (30 – 38 lbs) $\rightarrow$ `B`
- 18 – 21 kg (39 – 47 lbs) $\rightarrow$ `C`
- 22 – 25 kg (48 – 56 lbs) $\rightarrow$ `D`
- 26 – 30 kg (57 – 66 lbs) $\rightarrow$ `E`
- 31 – 35 kg (67 – 78 lbs) $\rightarrow$ `F`
- 36 – 41 kg (79 – 91 lbs) $\rightarrow$ `G`
- 42 – 48 kg (92 – 107 lbs) $\rightarrow$ `H`
- 49 – 57 kg (108 – 125 lbs) $\rightarrow$ `I`
- 58 – 66 kg (126 – 147 lbs) $\rightarrow$ `J`
- 67 – 78 kg (148 – 174 lbs) $\rightarrow$ `K`
- 79 – 94 kg (175 – 209 lbs) $\rightarrow$ `L`
- $\ge$ 95 kg ($\ge$ 210 lbs) $\rightarrow$ `M`

### Step 2: Find Height Skier Code (Applicable only if Weight Code $\ge$ H / Weight $\ge$ 42 kg)
- $\le$ 148 cm ($\le$ 4'10") $\rightarrow$ `H`
- 149 – 157 cm (4'11" – 5'1") $\rightarrow$ `I`
- 158 – 166 cm (5'2" – 5'5") $\rightarrow$ `J`
- 167 – 178 cm (5'6" – 5'10") $\rightarrow$ `K`
- 179 – 194 cm (5'11" – 6'4") $\rightarrow$ `L`
- $\ge$ 195 cm ($\ge$ 6'5") $\rightarrow$ `M`

### Step 3: Conflict Resolution (Baseline Skier Code)
If Weight Code and Height Code differ, **select the row closer to the top of the chart** (the lesser/safer code letter).
*Example:* Weight gives `K`, Height gives `I` $\rightarrow$ Baseline Skier Code is `I`.

### Step 4: Apply Safety Constraints & Skier Type Modifiers
1. **Weight $\le$ 13 kg (Code A):** No Skier Type or Age modifications permitted. Code remains `A`.
2. **Weight $\le$ 17 kg (Code B):** `Type -I` is not permitted.
3. **Skier Type Modifiers:**
   - `Type -I` (Extremely Cautious): Move up 1 row (-1 code letter).
   - `Type I` (Cautious / Beginner): 0 modification (keep baseline).
   - `Type II` (Moderate / Intermediate): Move down 1 row (+1 code letter).
   - `Type III` (Aggressive / Advanced): Move down 2 rows (+2 code letters).
   - `Type III+` (Extreme / Freeride / Racer): Move down 3 rows (+3 code letters).

### Step 5: Apply Age Modifiers
- **Age < 10:** Move up 1 row (-1 code letter).
- **Age $\ge$ 50:** Move up 1 row (-1 code letter).
- **Age 10 to 49:** 0 modification.

### Step 6: Code Range Clamping
The resulting adjusted code index is clamped between minimum `A` (Index 0) and maximum `P` (Index 15).

```
Codes: [A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P]
```

---

## 4. ISO 11088 DIN Lookup Matrix

| Code | $\le$ 230mm | 231–250mm | 251–270mm | 271–290mm | 291–310mm | 311–330mm | 331–350mm | $\ge$ 351mm |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A** | 0.75 | 0.75 | 0.75 | — | — | — | — | — |
| **B** | 1.00 | 0.75 | 0.75 | 0.75 | — | — | — | — |
| **C** | 1.50 | 1.25 | 1.25 | 1.00 | — | — | — | — |
| **D** | 2.00 | 1.75 | 1.50 | 1.50 | 1.25 | — | — | — |
| **E** | 2.50 | 2.25 | 2.00 | 1.75 | 1.50 | 1.50 | — | — |
| **F** | 3.00 | 2.75 | 2.50 | 2.25 | 2.00 | 1.75 | 1.75 | — |
| **G** | — | 3.50 | 3.00 | 2.75 | 2.50 | 2.25 | 2.00 | — |
| **H** | — | — | 3.50 | 3.00 | 3.00 | 2.75 | 2.50 | — |
| **I** | — | — | 4.50 | 4.00 | 3.50 | 3.50 | 3.00 | — |
| **J** | — | — | 5.50 | 5.00 | 4.50 | 4.00 | 3.50 | 3.00 |
| **K** | — | — | 6.50 | 6.00 | 5.50 | 5.00 | 4.50 | 4.00 |
| **L** | — | — | 7.50 | 7.00 | 6.50 | 6.00 | 5.50 | 5.00 |
| **M** | — | — | 8.50 | 8.00 | 7.00 | 6.50 | 6.00 | 5.50 |
| **N** | — | — | 10.00 | 9.50 | 8.50 | 8.00 | 7.50 | — |
| **O** | — | — | 11.50 | 11.00 | 10.00 | 9.50 | 9.00 | — |
| **P** | — | — | — | — | 12.00 | 11.00 | 10.50 | — |

### Step 7: Blank Cell (—) Resolution Rule
If the cell at `(Adjusted Code, BSL Column)` is blank (`—`), **slide horizontally along the same row** to the closest valid column without changing the code row.

---

## 5. TypeScript Engine Reference Implementation

```typescript
export type SkierTypeCode = '-I' | 'I' | 'II' | 'III' | 'III+';

export interface DinInput {
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
  skierTypeModifier: number;
  ageModifier: number;
  notes: string[];
}

const SKIER_CODES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] as const;

const BSL_RANGES = [
  { max: 230, index: 0 },
  { min: 231, max: 250, index: 1 },
  { min: 251, max: 270, index: 2 },
  { min: 271, max: 290, index: 3 },
  { min: 291, max: 310, index: 4 },
  { min: 311, max: 330, index: 5 },
  { min: 331, max: 350, index: 6 },
  { min: 351, max: Infinity, index: 7 },
];

const DIN_TABLE: (number | null)[][] = [
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

export function getWeightCodeIndex(weightKg: number): number {
  if (weightKg <= 13) return 0; // A
  if (weightKg <= 17) return 1; // B
  if (weightKg <= 21) return 2; // C
  if (weightKg <= 25) return 3; // D
  if (weightKg <= 30) return 4; // E
  if (weightKg <= 35) return 5; // F
  if (weightKg <= 41) return 6; // G
  if (weightKg <= 48) return 7; // H
  if (weightKg <= 57) return 8; // I
  if (weightKg <= 66) return 9; // J
  if (weightKg <= 78) return 10; // K
  if (weightKg <= 94) return 11; // L
  return 12; // M (>= 95 kg)
}

export function getHeightCodeIndex(heightCm: number): number {
  if (heightCm <= 148) return 7; // H
  if (heightCm <= 157) return 8; // I
  if (heightCm <= 166) return 9; // J
  if (heightCm <= 178) return 10; // K
  if (heightCm <= 194) return 11; // L
  return 12; // M (>= 195 cm)
}

export function calculateDin(input: DinInput): DinResult {
  const notes: string[] = [];
  const weightIndex = getWeightCodeIndex(input.weightKg);

  let baselineIndex = weightIndex;

  // Height only applies when weight corresponds to Code H (index 7) or higher
  if (weightIndex >= 7 && input.heightCm !== undefined && input.heightCm > 0) {
    const heightIndex = getHeightCodeIndex(input.heightCm);
    if (heightIndex < weightIndex) {
      baselineIndex = heightIndex;
      notes.push(`Height placed you in Code ${SKIER_CODES[heightIndex]}, which is lighter than weight (Code ${SKIER_CODES[weightIndex]}). Used safer baseline Code ${SKIER_CODES[baselineIndex]}.`);
    }
  }

  const initialCode = SKIER_CODES[baselineIndex];
  let modifier = 0;
  let skierTypeMod = 0;
  let ageMod = 0;

  // Safety Constraint: Weight <= 13 kg -> no modifications allowed
  if (input.weightKg <= 13) {
    notes.push('For skiers weighing 13 kg (29 lbs) or less, ISO 11088 mandates no age or skier type modifications.');
  } else {
    // Skier Type Modifier
    switch (input.skierType) {
      case '-I':
        if (input.weightKg > 17) skierTypeMod = -1;
        else notes.push('Type -I is not recommended for skiers 17 kg or under.');
        break;
      case 'I':
        skierTypeMod = 0;
        break;
      case 'II':
        skierTypeMod = 1;
        break;
      case 'III':
        skierTypeMod = 2;
        break;
      case 'III+':
        skierTypeMod = 3;
        break;
    }

    // Age Modifier
    if (input.age < 10 || input.age >= 50) {
      ageMod = -1;
      notes.push(`Age ${input.age} applies a -1 skier code safety adjustment per ISO standard.`);
    }

    modifier = skierTypeMod + ageMod;
  }

  let finalIndex = baselineIndex + modifier;
  if (finalIndex < 0) finalIndex = 0;
  if (finalIndex >= SKIER_CODES.length) finalIndex = SKIER_CODES.length - 1;

  const adjustedCode = SKIER_CODES[finalIndex];

  // Map BSL to column
  let colIndex = 0;
  for (const range of BSL_RANGES) {
    if (input.bslMm <= (range.max ?? Infinity) && input.bslMm >= (range.min ?? 0)) {
      colIndex = range.index;
      break;
    }
  }

  // Lookup in DIN table with horizontal blank cell resolution
  let din = DIN_TABLE[finalIndex][colIndex];
  if (din === null) {
    // Search horizontally on the same row for the closest available cell
    let closestVal: number | null = null;
    let minDistance = Infinity;
    for (let c = 0; c < DIN_TABLE[finalIndex].length; c++) {
      const val = DIN_TABLE[finalIndex][c];
      if (val !== null) {
        const dist = Math.abs(c - colIndex);
        if (dist < minDistance) {
          minDistance = dist;
          closestVal = val;
        }
      }
    }
    din = closestVal ?? 1.0;
    notes.push(`Selected BSL (${input.bslMm}mm) fell on a blank cell for Code ${adjustedCode}; shifted to nearest standard setting (${din}).`);
  }

  return {
    din,
    initialCode,
    adjustedCode,
    skierTypeModifier: skierTypeMod,
    ageModifier: ageMod,
    notes,
  };
}
```
