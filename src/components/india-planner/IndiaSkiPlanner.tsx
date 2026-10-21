import React, { useState, useMemo } from 'react';
import {
  RESORTS,
  calculateTripBudget,
} from '../../data/indiaSkiData';
import type { TripPlanInput, BudgetItem } from '../../data/indiaSkiData';

export default function IndiaSkiPlanner() {
  const [resortId, setResortId] = useState<string>('gulmarg');
  const [discipline, setDiscipline] = useState<'ski' | 'snowboard'>('ski');
  const [skillTrack, setSkillTrack] = useState<'firstTimer' | 'intermediate' | 'advanced' | 'govtCourse'>('intermediate');
  const [daysOnSnow, setDaysOnSnow] = useState<number>(5);
  const [totalTripDays, setTotalTripDays] = useState<number>(6);
  const [groupSize, setGroupSize] = useState<number>(2);
  const [needClothingRental, setNeedClothingRental] = useState<boolean>(true);
  const [needTangmargTransfer, setNeedTangmargTransfer] = useState<boolean>(true);
  const [needPrivateInstructor, setNeedPrivateInstructor] = useState<boolean>(false);
  const [accommodationType, setAccommodationType] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [isIndianResident, setIsIndianResident] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');
  const [copied, setCopied] = useState<boolean>(false);

  const budget = useMemo(() => {
    return calculateTripBudget({
      resortId,
      discipline,
      skillTrack,
      daysOnSnow,
      totalTripDays,
      groupSize,
      needClothingRental,
      needTangmargTransfer,
      needPrivateInstructor,
      accommodationType,
      isIndianResident,
      currency,
    });
  }, [
    resortId,
    discipline,
    skillTrack,
    daysOnSnow,
    totalTripDays,
    groupSize,
    needClothingRental,
    needTangmargTransfer,
    needPrivateInstructor,
    accommodationType,
    isIndianResident,
    currency,
  ]);

  const activeResort = RESORTS[resortId] || RESORTS.gulmarg;

  const handleCopyBudget = () => {
    const textLines = [
      `⛷️ INDIA SKI TRIP BUDGET RECEIPT (2026–2027)`,
      `Resort: ${activeResort.name} (${activeResort.state})`,
      `Discipline: ${discipline === 'ski' ? 'Alpine Skiing' : 'Snowboarding'}`,
      `Track: ${skillTrack} · Group Size: ${groupSize} · Days on Snow: ${daysOnSnow} (Total: ${totalTripDays} days)`,
      `Total Cost: ${budget.displayTotal} (${budget.displayPerPerson} per person)`,
      `------------------------------------------`,
      ...budget.items.map(it => `• [${it.category}] ${it.item}: ₹${it.amountInr.toLocaleString()}`),
      `------------------------------------------`,
      `Calculated via DINCalculatorPro.com India Ski Trip Planner`,
    ];
    navigator.clipboard.writeText(textLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div class="space-y-8">
      {/* Top Banner / Currency Switcher */}
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-parchment border border-hairline">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs sm:text-sm font-medium text-ink">
            <strong>2026–2027 Winter Season Tariff</strong> · Baseline Audited October 2026
          </span>
        </div>
        <div class="flex items-center gap-1.5 self-end sm:self-auto bg-canvas p-1 rounded-xl border border-hairline text-xs font-mono">
          <span class="text-mute px-2">Currency:</span>
          {(['INR', 'USD', 'EUR'] as const).map(curr => (
            <button
              key={curr}
              type="button"
              onClick={() => setCurrency(curr)}
              class={`px-2.5 py-1 rounded-lg transition-all ${
                currency === curr
                  ? 'bg-primary text-white font-bold shadow-sm'
                  : 'text-mute hover:text-ink hover:bg-parchment'
              }`}
            >
              {curr === 'INR' ? '₹ INR' : curr === 'USD' ? '$ USD' : '€ EUR'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Receipt on Right */}
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (7 cols) */}
        <div class="lg:col-span-7 space-y-6">
          
          {/* Step 1: Destination Selector */}
          <div class="p-5 sm:p-6 rounded-2xl bg-canvas border border-hairline shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                Step 1 · Choose Destination
              </label>
              <span class="text-xs text-mute font-mono">{activeResort.state}</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(RESORTS).map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setResortId(r.id)}
                  class={`p-3 rounded-xl border text-left transition-all ${
                    resortId === r.id
                      ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/40'
                      : 'border-hairline bg-parchment text-ink hover:border-primary/30'
                  }`}
                >
                  <div class="font-bold text-xs sm:text-sm">{r.name}</div>
                  <div class="text-[11px] text-mute">{r.elevationTopM}m peak</div>
                </button>
              ))}
            </div>

            {/* Quick Resort Context Strip */}
            <div class="p-3.5 rounded-xl bg-parchment/60 border border-hairline/60 text-xs text-mute flex items-start gap-2.5">
              <svg class="w-4 h-4 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong class="text-ink">{activeResort.name}:</strong> {activeResort.terrainSummary}
                <div class="mt-1 text-[11px]">
                  <strong>Peak Season:</strong> {activeResort.bestMonths} · <strong>Nearest Airport:</strong> {activeResort.nearestAirport} ({activeResort.airportDistanceKm} km)
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Discipline & Skill Track */}
          <div class="p-5 sm:p-6 rounded-2xl bg-canvas border border-hairline shadow-sm space-y-4">
            <label class="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
              Step 2 · Discipline & Skill Track
            </label>

            {/* Discipline Toggle */}
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscipline('ski')}
                class={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-sm transition-all ${
                  discipline === 'ski'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-hairline bg-parchment text-mute hover:text-ink'
                }`}
              >
                <span>⛷️ Alpine Skiing</span>
              </button>
              <button
                type="button"
                onClick={() => setDiscipline('snowboard')}
                class={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-semibold text-sm transition-all ${
                  discipline === 'snowboard'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-hairline bg-parchment text-mute hover:text-ink'
                }`}
              >
                <span>🏂 Snowboarding</span>
              </button>
            </div>

            {discipline === 'snowboard' && (
              <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                <strong>Snowboarder Notice:</strong> Daily board rental is ₹1,200–₹1,500 vs. ₹700–₹1,100 for skis in India due to limited shop inventory. Note that surface drag lifts on nursery slopes require practice on a snowboard.
              </div>
            )}

            {/* Skill Track Radio Cards */}
            <div class="space-y-2 pt-1">
              {[
                {
                  id: 'firstTimer',
                  title: 'First-Timer / Beginner',
                  desc: 'Nursery slopes (85 Bowl / Poma tow), beginner gear, green terrain.',
                },
                {
                  id: 'intermediate',
                  title: 'Intermediate (Gondola Phase 1 / Chairlift)',
                  desc: 'Kongdoori mid-station, groomed trails, chairlift laps.',
                },
                {
                  id: 'advanced',
                  title: 'Advanced / Powder (Phase 2 + Avy Kit)',
                  desc: 'Apharwat Peak 3,980m, deep powder glades, mandatory beacon/probe/shovel.',
                },
                {
                  id: 'govtCourse',
                  title: '14-Day Government Course (IISM / ABVIMAS)',
                  desc: 'Subsidized all-inclusive module (hostel stay, all meals, gear, certified instructors).',
                },
              ].map(track => (
                <label
                  key={track.id}
                  class={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    skillTrack === track.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-hairline bg-parchment/60 hover:bg-parchment'
                  }`}
                >
                  <input
                    type="radio"
                    name="skillTrack"
                    value={track.id}
                    checked={skillTrack === track.id}
                    onChange={() => setSkillTrack(track.id as any)}
                    class="mt-1 text-primary focus:ring-primary h-4 w-4"
                  />
                  <div>
                    <div class="text-xs sm:text-sm font-semibold text-ink">{track.title}</div>
                    <div class="text-[11px] text-mute leading-relaxed">{track.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Step 3: Duration, Group Size & Residency */}
          <div class="p-5 sm:p-6 rounded-2xl bg-canvas border border-hairline shadow-sm space-y-4">
            <label class="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
              Step 3 · Trip Logistics
            </label>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Days on Snow */}
              <div>
                <label class="block text-xs text-mute mb-1 font-medium">Days on Snow</label>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={daysOnSnow}
                    onChange={e => {
                      const v = parseInt(e.target.value) || 1;
                      setDaysOnSnow(v);
                      if (v > totalTripDays) setTotalTripDays(v + 1);
                    }}
                    class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink font-mono text-sm focus:border-primary focus:outline-none"
                  />
                  <span class="text-xs text-mute font-mono">days</span>
                </div>
              </div>

              {/* Total Trip Days */}
              <div>
                <label class="block text-xs text-mute mb-1 font-medium">Total Trip Days</label>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min={daysOnSnow}
                    max="21"
                    value={totalTripDays}
                    onChange={e => setTotalTripDays(Math.max(daysOnSnow, parseInt(e.target.value) || daysOnSnow))}
                    class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink font-mono text-sm focus:border-primary focus:outline-none"
                  />
                  <span class="text-xs text-mute font-mono">days</span>
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label class="block text-xs text-mute mb-1 font-medium">Group Size</label>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={groupSize}
                    onChange={e => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                    class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink font-mono text-sm focus:border-primary focus:outline-none"
                  />
                  <span class="text-xs text-mute font-mono">skiers</span>
                </div>
              </div>
            </div>

            {/* Residency & Stay Tier */}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs text-mute mb-1 font-medium">Nationality / Residency</label>
                <select
                  value={isIndianResident ? 'indian' : 'foreigner'}
                  onChange={e => setIsIndianResident(e.target.value === 'indian')}
                  class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink text-xs focus:border-primary focus:outline-none"
                >
                  <option value="indian">Indian Resident (Standard JKCCC / IISM Tariff)</option>
                  <option value="foreigner">International Visitor (JKCCC Foreigner Tariff)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs text-mute mb-1 font-medium">Lodging Category</label>
                <select
                  value={accommodationType}
                  onChange={e => setAccommodationType(e.target.value as any)}
                  class="w-full px-3 py-2 rounded-xl border border-hairline bg-input text-ink text-xs focus:border-primary focus:outline-none"
                >
                  <option value="budget">Budget (₹1,800–₹2,500/night guest houses)</option>
                  <option value="mid">Mid-Range (₹4,500–₹6,500/night warm hotels)</option>
                  <option value="luxury">Luxury (₹12,000–₹25,000/night boutique resorts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Real-Talk Add-ons */}
          <div class="p-5 sm:p-6 rounded-2xl bg-canvas border border-hairline shadow-sm space-y-3">
            <label class="text-xs font-mono font-bold text-accent uppercase tracking-wider block">
              Step 4 · Smart Add-ons & Ground Truth Toggles
            </label>

            <div class="space-y-2.5">
              <label class="flex items-center justify-between p-3 rounded-xl border border-hairline bg-parchment/60 hover:bg-parchment cursor-pointer text-xs">
                <span class="text-ink">Rent Waterproof Winter Clothing (Jacket + Snow Pants + Goggles + Helmet)</span>
                <input
                  type="checkbox"
                  checked={needClothingRental}
                  onChange={e => setNeedClothingRental(e.target.checked)}
                  class="text-primary focus:ring-primary h-4 w-4 rounded"
                />
              </label>

              {resortId === 'gulmarg' && (
                <label class="flex items-center justify-between p-3 rounded-xl border border-hairline bg-parchment/60 hover:bg-parchment cursor-pointer text-xs">
                  <span class="text-ink">Include Tangmarg 4x4 Snow-Chain Taxi (Mandatory mountain pass transfer)</span>
                  <input
                    type="checkbox"
                    checked={needTangmargTransfer}
                    onChange={e => setNeedTangmargTransfer(e.target.checked)}
                    class="text-primary focus:ring-primary h-4 w-4 rounded"
                  />
                </label>
              )}

              <label class="flex items-center justify-between p-3 rounded-xl border border-hairline bg-parchment/60 hover:bg-parchment cursor-pointer text-xs">
                <span class="text-ink">Hire Certified Private Ski/Snowboard Instructor (Full Day)</span>
                <input
                  type="checkbox"
                  checked={needPrivateInstructor}
                  onChange={e => setNeedPrivateInstructor(e.target.checked)}
                  class="text-primary focus:ring-primary h-4 w-4 rounded"
                />
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Sticky Budget Card / Receipt (5 cols) */}
        <div class="lg:col-span-5 sticky top-24 space-y-6">
          <div class="p-6 rounded-2xl bg-canvas border border-hairline shadow-lg space-y-6">
            
            {/* Header / Summary Badge */}
            <div class="border-b border-hairline pb-4 flex items-start justify-between">
              <div>
                <span class="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold block">
                  Expedition Budget Card
                </span>
                <h3 class="text-xl font-bold text-ink mt-0.5">
                  {activeResort.name} Trip Estimate
                </h3>
                <div class="text-xs text-mute mt-0.5">
                  {groupSize} {groupSize === 1 ? 'person' : 'people'} · {daysOnSnow} on-snow days · {discipline === 'ski' ? 'Ski' : 'Snowboard'}
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl sm:text-3xl font-black text-primary font-mono tracking-tight">
                  {budget.displayTotal}
                </div>
                {groupSize > 1 && (
                  <div class="text-[11px] font-mono text-mute">
                    ({budget.displayPerPerson} / person)
                  </div>
                )}
              </div>
            </div>

            {/* Category Spend Progress Bar */}
            <div class="space-y-2">
              <div class="text-[11px] font-mono font-medium text-mute uppercase flex justify-between">
                <span>Cost Breakdown</span>
                <span>{currency}</span>
              </div>
              <div class="space-y-1.5 text-xs">
                {Object.entries(budget.breakdownByCategory).map(([cat, amount]) => {
                  const pct = Math.round((amount / budget.totalInr) * 100);
                  return (
                    <div key={cat} class="space-y-0.5">
                      <div class="flex justify-between text-mute text-[11px]">
                        <span>{cat}</span>
                        <span class="font-mono text-ink">₹{amount.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div class="h-1.5 rounded-full bg-parchment overflow-hidden">
                        <div
                          class="h-full bg-primary rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Itemized Line Items */}
            <div class="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              <span class="text-[11px] font-mono font-medium text-mute uppercase block">
                Itemized Line Items
              </span>
              <div class="space-y-2">
                {budget.items.map((item, idx) => (
                  <div
                    key={idx}
                    class="p-2.5 rounded-xl bg-parchment/60 border border-hairline/60 text-xs space-y-1"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-ink font-medium leading-tight">{item.item}</span>
                      <span class="font-mono font-bold text-ink shrink-0">₹{item.amountInr.toLocaleString()}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {item.confidence === 'VERIFIED_OFFICIAL' ? (
                        <span class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                          ✓ OFFICIAL 2026-27
                        </span>
                      ) : (
                        <span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-semibold">
                          ~ MARKET RANGE
                        </span>
                      )}
                      <span class="text-mute truncate">Source: {item.source}</span>
                    </div>
                    {item.note && (
                      <p class="text-[11px] text-mute italic leading-relaxed pt-0.5">
                        {item.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions: Copy & Print */}
            <div class="flex items-center gap-2 pt-2 border-t border-hairline">
              <button
                type="button"
                onClick={handleCopyBudget}
                class="flex-1 py-2.5 px-3 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copied ? '✓ Copied to Clipboard!' : '📋 Copy Budget Receipt'}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                class="py-2.5 px-3 rounded-xl border border-hairline bg-parchment text-ink text-xs font-medium hover:border-primary/40 transition-all"
                title="Print Receipt"
              >
                🖨️ Print
              </button>
            </div>

            {/* Mandatory Safety Cross-Sell to DIN Calculator */}
            <div class="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/30 space-y-2">
              <div class="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                <span>⚠️ Rental Binding Safety Warning</span>
              </div>
              <p class="text-xs text-ink leading-relaxed">
                Renting equipment in Gulmarg, Auli, or Solang? Local ski shops routinely set binding release torque by guesswork without asking for your Boot Sole Length (BSL) in mm. This causes catastrophic knee tears and non-release fractures.
              </p>
              <a
                href="/"
                class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
              >
                Calculate your exact ISO 11088 DIN & Save Ski Tech Card →
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
