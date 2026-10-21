import React, { useState, useMemo } from 'react';
import { GULMARG_GONDOLA_RATES_2026_27 } from '../../data/indiaSkiData';

export default function GondolaBreakEvenCalculator() {
  const [phase, setPhase] = useState<'phase1' | 'phase2'>('phase2');
  const [skiDays, setSkiDays] = useState<number>(5);
  const [lapsPerDay, setLapsPerDay] = useState<number>(3);
  const [isIndian, setIsIndian] = useState<boolean>(true);

  const rates = GULMARG_GONDOLA_RATES_2026_27;

  const analysis = useMemo(() => {
    const singleLapPrice = phase === 'phase1' 
      ? rates.skierPasses.singleLapPhase1 
      : rates.skierPasses.singleLapPhase2;

    const dayPassPrice = phase === 'phase1'
      ? (isIndian ? rates.skierPasses.phase1DayIndian : rates.skierPasses.phase1DayForeigner)
      : (isIndian ? rates.skierPasses.phase2DayIndian : rates.skierPasses.phase2DayForeigner);

    const weeklyPassPrice = isIndian 
      ? rates.skierPasses.weeklyPassIndian 
      : rates.skierPasses.weeklyPassForeigner;

    const singleLapsCost = singleLapPrice * lapsPerDay * skiDays;
    const dayPassesCost = dayPassPrice * skiDays;
    const weeklyPassCost = weeklyPassPrice;

    // Daily laps needed to break even on a day pass vs single laps
    const lapsToBreakEvenDayPass = Math.ceil(dayPassPrice / singleLapPrice);

    // Days needed to break even on a weekly pass vs day passes
    const daysToBreakEvenWeekly = Math.ceil(weeklyPassPrice / dayPassPrice);

    let bestOption = 'dayPass';
    let savings = 0;

    if (skiDays >= daysToBreakEvenWeekly && phase === 'phase2') {
      bestOption = 'weeklyPass';
      savings = dayPassesCost - weeklyPassCost;
    } else if (lapsPerDay < lapsToBreakEvenDayPass) {
      bestOption = 'singleLaps';
      savings = dayPassesCost - singleLapsCost;
    } else {
      bestOption = 'dayPass';
      savings = singleLapsCost - dayPassesCost;
    }

    return {
      singleLapPrice,
      dayPassPrice,
      weeklyPassPrice,
      singleLapsCost,
      dayPassesCost,
      weeklyPassCost,
      lapsToBreakEvenDayPass,
      daysToBreakEvenWeekly,
      bestOption,
      savings,
    };
  }, [phase, skiDays, lapsPerDay, isIndian]);

  return (
    <div class="space-y-6 p-6 rounded-2xl bg-canvas border border-hairline shadow-sm">
      <div class="border-b border-hairline pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span class="text-xs font-mono font-bold text-accent uppercase tracking-wider">
            Break-Even Calculator
          </span>
          <h3 class="text-lg sm:text-xl font-bold text-ink">
            Gulmarg Gondola: Day Pass vs. Weekly vs. Single Laps
          </h3>
        </div>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium self-start sm:self-auto">
          <span>✓ Official 2026–27 JKCCC Tariff</span>
        </span>
      </div>

      {/* Input Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Phase Choice */}
        <div>
          <label class="block text-xs font-medium text-mute mb-1">Mountain Zone</label>
          <div class="grid grid-cols-2 gap-1 bg-parchment p-1 rounded-xl border border-hairline">
            <button
              type="button"
              onClick={() => setPhase('phase1')}
              class={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                phase === 'phase1' ? 'bg-primary text-white shadow-sm' : 'text-mute hover:text-ink'
              }`}
            >
              Phase 1 (Mid)
            </button>
            <button
              type="button"
              onClick={() => setPhase('phase2')}
              class={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                phase === 'phase2' ? 'bg-primary text-white shadow-sm' : 'text-mute hover:text-ink'
              }`}
            >
              Phase 2 (Top)
            </button>
          </div>
        </div>

        {/* Ski Days */}
        <div>
          <label class="block text-xs font-medium text-mute mb-1">Days on Snow</label>
          <input
            type="number"
            min="1"
            max="14"
            value={skiDays}
            onChange={e => setSkiDays(Math.max(1, parseInt(e.target.value) || 1))}
            class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink font-mono text-xs focus:border-primary focus:outline-none"
          />
        </div>

        {/* Laps per day */}
        <div>
          <label class="block text-xs font-medium text-mute mb-1">Estimated Laps / Day</label>
          <input
            type="number"
            min="1"
            max="8"
            value={lapsPerDay}
            onChange={e => setLapsPerDay(Math.max(1, parseInt(e.target.value) || 1))}
            class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink font-mono text-xs focus:border-primary focus:outline-none"
          />
        </div>

        {/* Residency */}
        <div>
          <label class="block text-xs font-medium text-mute mb-1">Pass Category</label>
          <select
            value={isIndian ? 'indian' : 'foreigner'}
            onChange={e => setIsIndian(e.target.value === 'indian')}
            class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink text-xs focus:border-primary focus:outline-none"
          >
            <option value="indian">Indian Resident</option>
            <option value="foreigner">Foreign National</option>
          </select>
        </div>
      </div>

      {/* Comparison Outcome Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Single Laps Card */}
        <div class={`p-4 rounded-xl border transition-all ${
          analysis.bestOption === 'singleLaps'
            ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30'
            : 'border-hairline bg-parchment/60'
        }`}>
          <div class="text-[11px] font-mono text-mute uppercase">Option A · Single Ski Rides</div>
          <div class="text-xl font-bold font-mono text-ink mt-1">₹{analysis.singleLapsCost.toLocaleString()}</div>
          <div class="text-xs text-mute mt-1">
            ₹{analysis.singleLapPrice}/lap × {lapsPerDay} laps × {skiDays} days
          </div>
          {analysis.bestOption === 'singleLaps' && (
            <span class="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              ✓ CHEAPEST FOR CASUAL RIDING
            </span>
          )}
        </div>

        {/* Day Passes Card */}
        <div class={`p-4 rounded-xl border transition-all ${
          analysis.bestOption === 'dayPass'
            ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
            : 'border-hairline bg-parchment/60'
        }`}>
          <div class="text-[11px] font-mono text-mute uppercase">Option B · Daily Skier Passes</div>
          <div class="text-xl font-bold font-mono text-ink mt-1">₹{analysis.dayPassesCost.toLocaleString()}</div>
          <div class="text-xs text-mute mt-1">
            ₹{analysis.dayPassPrice}/day × {skiDays} days (Unlimited daily laps)
          </div>
          {analysis.bestOption === 'dayPass' && (
            <span class="inline-block mt-2 px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
              ★ RECOMMENDED OPTION
            </span>
          )}
        </div>

        {/* Weekly Pass Card */}
        <div class={`p-4 rounded-xl border transition-all ${
          analysis.bestOption === 'weeklyPass'
            ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30'
            : 'border-hairline bg-parchment/60'
        }`}>
          <div class="text-[11px] font-mono text-mute uppercase">Option C · 7-Day Season Pass</div>
          <div class="text-xl font-bold font-mono text-ink mt-1">₹{analysis.weeklyPassCost.toLocaleString()}</div>
          <div class="text-xs text-mute mt-1">
            Flat 7-day rate (Breaks even at {analysis.daysToBreakEvenWeekly}+ days)
          </div>
          {analysis.bestOption === 'weeklyPass' && (
            <span class="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              ✓ BEST FOR DEDICATED RIDERS
            </span>
          )}
        </div>
      </div>

      {/* Weather Closure Risk Notice */}
      <div class="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
        <strong>⚠️ Crucial Weather Advisory:</strong> Apharwat Peak (Phase 2 at 3,980m) frequently closes for 1–2 days during active western disturbances and avalanche mitigation blasts. If weather closes Phase 2, JKCCC generally does NOT refund weekly passes. If visiting for 5 days or fewer, buying <strong>Daily Skier Passes</strong> on each clear morning is substantially lower financial risk!
      </div>
    </div>
  );
}
