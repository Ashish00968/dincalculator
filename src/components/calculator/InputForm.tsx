import { useState, useEffect, useRef } from 'react';
import type { SkierProfile, SkierTypeCode, UnitSystem } from '../../engine/types';
import { Card, CardContent } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { imperialToMetric } from '../../engine/din-engine';
import { cn } from '../../utils/cn';
import { BslModal } from './BslModal';
import { HelpCircleIcon as HelpCircle, ChevronRightIcon as ChevronRight, Settings2Icon as Settings2 } from '../ui/Icons';

import { useTranslations } from '../../i18n/utils';
import type { ui } from '../../i18n/ui';

interface InputFormProps {
  unitSystem: UnitSystem;
  onProfileChange: (profile: SkierProfile) => void;
  lang?: keyof typeof ui;
}

const SKIER_TYPE_CODES: { code: SkierTypeCode; titleKey: string; descKey: string; detailKey: string }[] = [
  { code: '-I', titleKey: 'Type -I', descKey: 'skierType.minusI.desc', detailKey: 'skierType.minusI.detail' },
  { code: 'I',  titleKey: 'Type I',  descKey: 'skierType.I.desc',      detailKey: 'skierType.I.detail' },
  { code: 'II', titleKey: 'Type II', descKey: 'skierType.II.desc',     detailKey: 'skierType.II.detail' },
  { code: 'III',titleKey: 'Type III',descKey: 'skierType.III.desc',    detailKey: 'skierType.III.detail' },
  { code: 'III+',titleKey: 'Type III+',descKey: 'skierType.IIIplus.desc', detailKey: 'skierType.IIIplus.detail' },
];

export function InputForm({ unitSystem, onProfileChange, lang = 'en' }: InputFormProps) {
  const t = useTranslations(lang);
  const [weight, setWeight] = useState<number>(unitSystem === 'imperial' ? 165 : 75);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [age, setAge] = useState<number>(30);
  const [skierType, setSkierType] = useState<SkierTypeCode>('II');
  const [bslMm, setBslMm] = useState<number>(305);
  const [isBslModalOpen, setIsBslModalOpen] = useState<boolean>(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  const onProfileChangeRef = useRef(onProfileChange);
  useEffect(() => {
    onProfileChangeRef.current = onProfileChange;
  });

  useEffect(() => {
    let finalWeightKg = weight;
    let finalHeightCm = heightCm;

    if (unitSystem === 'imperial') {
      const metric = imperialToMetric(weight, heightFt, heightIn);
      finalWeightKg = metric.weightKg;
      finalHeightCm = metric.heightCm;
      onProfileChangeRef.current({
        weightKg: finalWeightKg,
        heightCm: finalHeightCm,
        weightLbs: weight,
        heightInches: heightFt * 12 + heightIn,
        unitSystem,
        age,
        skierType,
        bslMm,
      });
    } else {
      onProfileChangeRef.current({
        weightKg: finalWeightKg,
        heightCm: finalHeightCm,
        unitSystem,
        age,
        skierType,
        bslMm,
      });
    }
  }, [weight, heightFt, heightIn, heightCm, age, skierType, bslMm, unitSystem]);

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
            {t('form.basic')}
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
            {t('form.advanced')}
          </button>
        </div>
      </div>

      {/* Physical Parameters Card */}
      <div className="store-utility-card space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <span className="text-sm font-semibold text-ink">{t('form.physicalDimensions')}</span>
          <span className="text-xs text-mute font-mono">{t('form.isoStep')}</span>
        </div>

          {/* Weight */}
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <label htmlFor="calc-weight-input" className="text-ink font-semibold text-xs tracking-wide">
                {t('calc.weight')}
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setWeight((w) => Math.max(isImperial ? 20 : 10, w - (isImperial ? 5 : 1)))}
                  aria-label="Decrease weight"
                  className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                >
                  −
                </button>
                <input
                  id="calc-weight-input"
                  type="number"
                  inputMode="decimal"
                  aria-label={`${t('calc.weight')} (${isImperial ? 'lbs' : 'kg'})`}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-16 bg-input border border-hairline rounded-md px-2 py-1 text-ink font-semibold text-center numeric-readout text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setWeight((w) => Math.min(isImperial ? 300 : 140, w + (isImperial ? 5 : 1)))}
                  aria-label="Increase weight"
                  className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                >
                  +
                </button>
                <span className="text-mute text-xs font-mono min-w-[24px] text-right">{isImperial ? 'lbs' : 'kg'}</span>
              </div>
            </div>
            <Slider
              aria-label={`${t('calc.weight')} slider`}
              value={weight}
              onValueChange={setWeight}
              min={isImperial ? 20 : 10}
              max={isImperial ? 300 : 140}
            />
            {((isImperial && (weight < 22 || weight > 286)) || (!isImperial && (weight < 10 || weight > 130))) && (
              <p className="text-xs text-amber-500 mt-2 font-medium leading-relaxed">
                {t('form.valWeightRange')}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label htmlFor={isImperial ? "calc-height-ft-select" : "calc-height-cm-input"} className="text-ink font-semibold text-xs tracking-wide block mb-2.5">
              {t('calc.height')}
            </label>
            {isImperial ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-input border border-hairline rounded-lg px-3 py-1.5 focus-within:border-accent transition-colors">
                  <select
                    id="calc-height-ft-select"
                    aria-label="Height in feet"
                    value={heightFt}
                    onChange={(e) => setHeightFt(Number(e.target.value))}
                    className="w-full bg-transparent text-ink font-semibold text-base focus:outline-none cursor-pointer font-mono"
                  >
                    {[3, 4, 5, 6, 7].map((ft) => (
                      <option key={ft} value={ft} className="bg-input text-ink">{ft} ft</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 bg-input border border-hairline rounded-lg px-3 py-1.5 focus-within:border-accent transition-colors">
                  <select
                    id="calc-height-in-select"
                    aria-label="Height in inches"
                    value={heightIn}
                    onChange={(e) => setHeightIn(Number(e.target.value))}
                    className="w-full bg-transparent text-ink font-semibold text-base focus:outline-none cursor-pointer font-mono"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i} className="bg-input text-ink">{i} in</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-end items-center mb-2.5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setHeightCm((h) => Math.max(100, h - 1))}
                    aria-label="Decrease height"
                    className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                  >
                    −
                  </button>
                  <input
                    id="calc-height-cm-input"
                    type="number"
                    inputMode="numeric"
                    aria-label={`${t('calc.height')} (cm)`}
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-16 bg-input border border-hairline rounded-md px-2 py-1 text-ink font-semibold text-center numeric-readout text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setHeightCm((h) => Math.min(220, h + 1))}
                    aria-label="Increase height"
                    className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                  >
                    +
                  </button>
                  <span className="text-mute text-xs font-mono min-w-[24px] text-right">cm</span>
                </div>
                <Slider
                  aria-label={`${t('calc.height')} slider`}
                  value={heightCm}
                  onValueChange={setHeightCm}
                  min={100}
                  max={220}
                />
                {(heightCm < 100 || heightCm > 220) && (
                  <p className="text-xs text-amber-500 mt-2 font-medium leading-relaxed">
                    {t('form.valHeightRange')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Age */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="calc-age-input" className="text-ink font-semibold text-xs tracking-wide">
                {t('calc.age')}
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAge((a) => Math.max(2, a - 1))}
                  aria-label="Decrease age"
                  className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                >
                  −
                </button>
                <input
                  id="calc-age-input"
                  type="number"
                  inputMode="numeric"
                  aria-label={t('calc.age')}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={2}
                  max={120}
                  className="w-16 bg-input border border-hairline rounded-md px-2 py-1 text-ink font-semibold text-center numeric-readout text-base focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setAge((a) => Math.min(120, a + 1))}
                  aria-label="Increase age"
                  className="w-7 h-7 rounded-md bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-sm font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
                >
                  +
                </button>
                <span className="text-mute text-xs font-mono min-w-[24px] text-right">{t('form.yrs')}</span>
              </div>
            </div>
            {(age < 3 || age > 100) && (
              <p className="text-xs text-amber-500 mt-1 mb-2 font-medium leading-relaxed">
                {t('form.valAgeRange')}
              </p>
            )}
            <div className="flex gap-2 text-[11px] font-mono mt-2">
              {age < 10 && (
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  <span>●</span> {t('form.childModifier')}
                </span>
              )}
              {age >= 50 && (
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full">
                  <span>●</span> {t('form.seniorModifier')}
                </span>
              )}
              {age >= 10 && age < 50 && (
                <span className="text-mute">{t('form.standardAdult')}</span>
              )}
            </div>
          </div>

      </div>

      {/* Skier Type Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <label className="text-sm font-semibold text-ink">
            {t('form.skierTypeClassification')}
          </label>
          <a
            href={lang === 'en' ? '/skier-types/' : `/${lang}/skier-types/`}
            className="text-xs text-accent hover:text-accent/80 transition-colors flex items-center gap-1 font-medium"
          >
            <span>{t('form.typeGuide')}</span>
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid gap-2">
          {SKIER_TYPE_CODES.map((type) => {
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
                      <span className={cn("text-base font-semibold", "text-ink")}>
                        {type.titleKey}
                      </span>
                      <span className="text-sm text-mute font-normal">
                        — {t(type.descKey as any)}
                      </span>
                    </div>
                    {/* Item 5: Persistent one-line 'who this is for' guidance */}
                    <p className="text-xs text-mute mt-1.5 flex items-start gap-1">
                      <span className="font-semibold text-ink/75 shrink-0">{t('form.whoThisIsFor') || 'Best for:'}</span>
                      <span>{t(type.detailKey as any)}</span>
                    </p>
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
            <label htmlFor="calc-bsl-input" className="text-sm font-semibold text-ink block">
              {t('calc.bsl')}
            </label>
            <span className="text-xs text-mute mt-1 block">{t('form.bslStamped')}</span>
          </div>
            <button
              type="button"
              onClick={() => setIsBslModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('form.bslFinder')}</span>
            </button>
          </div>

        {isAdvancedMode ? (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBslMm((b) => Math.max(200, b - 5))}
                aria-label="Decrease boot sole length"
                className="w-10 h-10 rounded-lg bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-base font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
              >
                −
              </button>
              <input
                id="calc-bsl-input"
                type="number"
                inputMode="numeric"
                aria-label={`${t('calc.bsl')} (mm)`}
                value={bslMm}
                onChange={(e) => setBslMm(Number(e.target.value))}
                min={200}
                max={400}
                className="flex-1 bg-canvas border border-hairline rounded-lg px-4 py-2 text-ink text-center text-xl font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setBslMm((b) => Math.min(400, b + 5))}
                aria-label="Increase boot sole length"
                className="w-10 h-10 rounded-lg bg-parchment hover:bg-input border border-hairline flex items-center justify-center text-ink text-base font-bold transition-all active:scale-95 touch-manipulation cursor-pointer select-none"
              >
                +
              </button>
              <span className="text-mute font-mono text-sm min-w-[28px]">mm</span>
            </div>
            <p className={cn("text-xs leading-relaxed", bslMm < 220 || bslMm > 360 ? "text-amber-500 font-medium" : "text-mute")}>
              {t('form.valBslNotice')}
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            <div className="p-4 bg-parchment rounded-lg flex items-center justify-between border border-hairline">
              <div>
                <span className="block text-xs text-mute mb-1">{t('form.currentValue')}</span>
                <span className="text-2xl font-semibold text-ink font-mono">{bslMm} mm</span>
              </div>
              <button
                type="button"
                onClick={() => setIsBslModalOpen(true)}
                className="px-4 py-2 bg-primary text-canvas rounded-full text-sm font-medium hover:scale-[0.98] transition-transform cursor-pointer"
              >
                {t('form.estimateFromShoeSize')}
              </button>
            </div>
            <p className="text-xs text-mute leading-relaxed">
              {t('form.valBslNotice')}
            </p>
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] text-mute mr-1">{t('form.commonPresets')}</span>
          {[265, 275, 295, 305, 315, 325, 335].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setBslMm(preset)}
              className={cn(
                "px-3 py-1 text-xs rounded-full border transition-all cursor-pointer font-mono",
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
        lang={lang}
      />
    </div>
  );
}
