import { useState, useEffect } from 'react';
import type { SkierProfile, SkierTypeCode, UnitSystem } from '../../engine/types';
import { Card, CardContent } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { imperialToMetric } from '../../engine/din-engine';
import { cn } from '../../utils/cn';
import { BslModal } from './BslModal';
import { HelpCircle, ChevronRight, Settings2 } from 'lucide-react';

interface InputFormProps {
  unitSystem: UnitSystem;
  onProfileChange: (profile: SkierProfile) => void;
}

const SKIER_TYPES: { code: SkierTypeCode; title: string; desc: string; detail: string }[] = [
  { code: '-I', title: 'Type -I', desc: 'Extremely Cautious', detail: 'Minimum release tension for beginners' },
  { code: 'I', title: 'Type I', desc: 'Cautious / Beginner', detail: 'Green & gentle blue slopes' },
  { code: 'II', title: 'Type II', desc: 'Moderate / All-Mountain', detail: 'Standard all-terrain recreational' },
  { code: 'III', title: 'Type III', desc: 'Aggressive / Expert', detail: 'High retention for steep & fast lines' },
  { code: 'III+', title: 'Type III+', desc: 'Racer / Freeride', detail: 'Extreme competition retention' },
];

export function InputForm({ unitSystem, onProfileChange }: InputFormProps) {
  const [weight, setWeight] = useState<number>(unitSystem === 'imperial' ? 165 : 75);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [skierType, setSkierType] = useState<SkierTypeCode>('II');
  const [bslMm, setBslMm] = useState<number>(305);
  const [isBslModalOpen, setIsBslModalOpen] = useState<boolean>(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  useEffect(() => {
    let finalWeightKg = weight;
    let finalHeightCm = heightCm;

    if (unitSystem === 'imperial') {
      const metric = imperialToMetric(weight, heightFt, heightIn);
      finalWeightKg = metric.weightKg;
      finalHeightCm = metric.heightCm;
    }

    onProfileChange({
      weightKg: finalWeightKg,
      heightCm: finalHeightCm,
      age,
      skierType,
      bslMm,
    });
  }, [weight, heightFt, heightIn, heightCm, age, skierType, bslMm, unitSystem, onProfileChange]);

  const isImperial = unitSystem === 'imperial';

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-parchment p-1 rounded-full border border-hairline">
          <button
            type="button"
            onClick={() => setIsAdvancedMode(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer",
              !isAdvancedMode ? "bg-canvas text-ink shadow-sm" : "text-mute hover:text-ink"
            )}
          >
            Basic
          </button>
          <button
            type="button"
            onClick={() => setIsAdvancedMode(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5",
              isAdvancedMode ? "bg-canvas text-ink shadow-sm" : "text-mute hover:text-ink"
            )}
          >
            <Settings2 className="w-4 h-4" />
            Advanced
          </button>
        </div>
      </div>

      {/* Physical Parameters Card */}
      <div className="store-utility-card space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <span className="text-sm font-semibold text-ink">Physical Dimensions</span>
          <span className="text-xs text-mute font-mono">ISO Step 1 & 2</span>
        </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label className="text-primary font-medium text-xs tracking-wide">
                Skier Weight
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-20 bg-input border border-hairline rounded-lg px-2.5 py-1 text-primary text-right numeric-readout text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                />
                <span className="text-mute text-xs font-mono">{isImperial ? 'lbs' : 'kg'}</span>
              </div>
            </div>
            <Slider
              value={weight}
              onValueChange={setWeight}
              min={isImperial ? 20 : 10}
              max={isImperial ? 300 : 140}
            />
          </div>

          {/* Height */}
          <div>
            <label className="text-primary font-medium text-xs tracking-wide block mb-2.5">
              Skier Height
            </label>
            {isImperial ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-input border border-hairline rounded-lg px-3 py-1.5 focus-within:border-accent transition-colors">
                  <select
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full bg-transparent text-primary text-sm focus:outline-none cursor-pointer font-mono"
                  >
                    {[3, 4, 5, 6, 7].map((ft) => (
                      <option key={ft} value={ft} className="bg-input text-primary">{ft} ft</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-input border border-hairline rounded-lg px-3 py-1.5 focus-within:border-accent transition-colors">
                  <select
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full bg-transparent text-primary text-sm focus:outline-none cursor-pointer font-mono"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i} className="bg-input text-primary">{i} in</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-end items-center mb-2.5 gap-2">
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-20 bg-input border border-hairline rounded-lg px-2.5 py-1 text-primary text-right numeric-readout text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                  <span className="text-mute text-xs font-mono">cm</span>
                </div>
                <Slider
                  value={heightCm}
                  onValueChange={setHeightCm}
                  min={100}
                  max={220}
                />
              </div>
            )}
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-primary font-medium text-xs tracking-wide">
                Age
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={2}
                  max={120}
                  className="w-20 bg-input border border-hairline rounded-lg px-2.5 py-1 text-primary text-right numeric-readout text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                />
                <span className="text-mute text-xs font-mono">yrs</span>
              </div>
            </div>
            <div className="flex gap-2 text-[11px] font-mono mt-2">
              {age < 10 && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  <span>●</span> Child (-1 Code Modifier)
                </span>
              )}
              {age >= 50 && (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                  <span>●</span> Senior (-1 Code Modifier)
                </span>
              )}
              {age >= 10 && age < 50 && (
                <span className="text-mute">Standard adult rating (0 modifier)</span>
              )}
            </div>
          </div>

      </div>

      {/* Skier Type Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-semibold text-ink">
            Skier Type Classification
          </label>
          <a
            href="/skier-types"
            className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-medium"
          >
            <span>Type Guide</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid gap-2">
          {SKIER_TYPES.map((type) => {
            // Hide extreme types in Basic mode
            if (!isAdvancedMode && (type.code === '-I' || type.code === 'III+')) return null;

            const isSelected = skierType === type.code;

            return (
              <button
                key={type.code}
                type="button"
                onClick={() => setSkierType(type.code)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left cursor-pointer select-none",
                  isSelected
                    ? "bg-canvas border-primary ring-1 ring-primary/20"
                    : "bg-canvas border-hairline hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0",
                    isSelected ? "border-primary bg-primary" : "border-hairline bg-canvas"
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-canvas" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={cn("text-base font-semibold", isSelected ? "text-ink" : "text-ink")}>
                        {type.title}
                      </span>
                      <span className="text-sm text-mute font-normal">
                        — {type.desc}
                      </span>
                    </div>
                    {isAdvancedMode && (
                      <p className="text-xs text-mute mt-1">
                        {type.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden sm:block">
                  <span className="text-xs text-mute bg-parchment px-2 py-1 rounded">
                    {type.code}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Boot Sole Length (BSL) Card */}
      <div className="store-utility-card space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="text-sm font-semibold text-ink block">
              Boot Sole Length (BSL)
            </label>
            <span className="text-xs text-mute mt-1 block">Stamped on boot heel in millimeters</span>
          </div>
            <button
              type="button"
              onClick={() => setIsBslModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>BSL Finder</span>
            </button>
          </div>

        {isAdvancedMode ? (
          <div className="flex items-center gap-3 mt-4">
            <input
              type="number"
              value={bslMm}
              onChange={(e) => setBslMm(Number(e.target.value))}
              min={200}
              max={400}
              className="flex-1 bg-canvas border border-hairline rounded-lg px-4 py-2.5 text-ink text-xl font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <span className="text-mute font-mono text-sm">mm</span>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-parchment rounded-lg flex items-center justify-between border border-hairline">
            <div>
              <span className="block text-xs text-mute mb-1">Current Value</span>
              <span className="text-2xl font-semibold text-ink">{bslMm} mm</span>
            </div>
            <button
              type="button"
              onClick={() => setIsBslModalOpen(true)}
              className="px-4 py-2 bg-primary text-canvas rounded-full text-sm font-medium hover:scale-[0.98] transition-transform cursor-pointer"
            >
              Estimate from Shoe Size
            </button>
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] text-mute mr-1">Common Presets:</span>
          {[265, 275, 295, 305, 315, 325, 335].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setBslMm(preset)}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-all cursor-pointer",
                bslMm === preset
                  ? "bg-primary text-canvas border-primary font-medium"
                  : "bg-canvas border-hairline text-ink hover:border-primary/50"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* BSL Finder Modal */}
      <BslModal
        isOpen={isBslModalOpen}
        onClose={() => setIsBslModalOpen(false)}
        onSelectBsl={(bsl) => setBslMm(bsl)}
      />
    </div>
  );
}
