import { useState, useEffect } from 'react';
import { InputForm } from './InputForm';
import { ResultDisplay } from './ResultDisplay';
import { Toggle } from '../ui/Toggle';
import { calculateDin } from '../../engine/din-engine';
import type { SkierProfile, UnitSystem, DinResult } from '../../engine/types';
import { ShieldAlert, Sparkles } from 'lucide-react';
import { MatrixTable } from './MatrixTable';

export default function CalculatorApp() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [profile, setProfile] = useState<SkierProfile | null>(null);
  const [result, setResult] = useState<DinResult | null>(null);

  // Smart Localization (Auto Unit Detection)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('din_unit_preference') as UnitSystem | null;
      if (stored && (stored === 'imperial' || stored === 'metric')) {
        setUnitSystem(stored);
      } else {
        const locale = new Intl.Locale(navigator.language);
        const region = locale.region || '';
        const isImperial = ['US', 'GB', 'LR', 'MM', 'AU'].includes(region);
        setUnitSystem(isImperial ? 'imperial' : 'metric');
      }
    } catch (e) {
      // Fallback if Intl.Locale is unsupported
      setUnitSystem('metric');
    }
  }, []);

  const handleUnitChange = (val: string) => {
    const newUnit = val as UnitSystem;
    setUnitSystem(newUnit);
    localStorage.setItem('din_unit_preference', newUnit);
  };

  useEffect(() => {
    if (profile) {
      const calculatedResult = calculateDin(profile);
      setResult(calculatedResult);
    }
  }, [profile]);

  return (
    <div className="w-full">
      {/* Unit Switcher Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-hairline">
        <div className="flex items-center gap-2 text-xs font-mono text-mute">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="uppercase tracking-wider">Parameters & Calibration</span>
        </div>
        <Toggle
          value={unitSystem}
          onChange={handleUnitChange}
          options={[
            { value: 'imperial', label: 'Imperial (lbs, ft)' },
            { value: 'metric', label: 'Metric (kg, cm)' }
          ]}
        />
      </div>

      {/* Main Grid: Form Inputs + Sticky Live Gauge Result Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative items-start">
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          <InputForm unitSystem={unitSystem} onProfileChange={setProfile} />
        </div>
        
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 self-start">
          <ResultDisplay result={result} />
        </div>
      </div>

      {/* ISO Safety Advisory Notice */}
      <div className="mt-14 p-6 rounded-[18px] bg-parchment border border-hairline flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <p className="font-semibold text-ink">ISO 11088 Calibration Notice</p>
          <p className="leading-relaxed text-mute">
            This tool provides baseline mathematical DIN settings strictly per ISO 11088. Actual release forces vary with boot wear, binding model, friction strips, and mechanical forward pressure. Bindings must be calibrated on a certified torque test bench by a trained ski technician.
          </p>
        </div>
      </div>

      {/* Full Interactive Matrix Explorer */}
      <div className="mt-16 mb-8">
        <MatrixTable result={result} />
      </div>
    </div>
  );
}
