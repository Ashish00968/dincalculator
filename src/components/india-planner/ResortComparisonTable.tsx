import React, { useState } from 'react';
import { RESORTS } from '../../data/indiaSkiData';

export default function ResortComparisonTable() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'all' | 'ski' | 'snowboard'>('all');
  const [selectedSkill, setSelectedSkill] = useState<'all' | 'beginner' | 'advanced'>('all');

  const resortsList = Object.values(RESORTS);

  return (
    <div class="space-y-6">
      {/* Filter Toolbar */}
      <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-parchment border border-hairline">
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="text-mute font-mono uppercase font-semibold">Filter by:</span>
          
          {/* Discipline Filter */}
          <div class="inline-flex rounded-lg border border-hairline bg-canvas p-0.5">
            <button
              type="button"
              onClick={() => setSelectedDiscipline('all')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedDiscipline === 'all' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              All Sports
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiscipline('ski')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedDiscipline === 'ski' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              ⛷️ Skiing
            </button>
            <button
              type="button"
              onClick={() => setSelectedDiscipline('snowboard')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedDiscipline === 'snowboard' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              🏂 Snowboard
            </button>
          </div>

          {/* Skill Filter */}
          <div class="inline-flex rounded-lg border border-hairline bg-canvas p-0.5">
            <button
              type="button"
              onClick={() => setSelectedSkill('all')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedSkill === 'all' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              All Levels
            </button>
            <button
              type="button"
              onClick={() => setSelectedSkill('beginner')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedSkill === 'beginner' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              Beginners
            </button>
            <button
              type="button"
              onClick={() => setSelectedSkill('advanced')}
              class={`px-2.5 py-1 rounded-md text-xs transition-all ${
                selectedSkill === 'advanced' ? 'bg-primary text-white font-bold' : 'text-mute hover:text-ink'
              }`}
            >
              Advanced / Powder
            </button>
          </div>
        </div>

        <div class="text-[11px] font-mono text-mute">
          Comparing 4 Premier Indian Ski Destinations
        </div>
      </div>

      {/* Comparison Grid (Cards on Mobile, Matrix on Tablet/Desktop) */}
      <div class="hidden md:block overflow-x-auto rounded-2xl border border-hairline bg-canvas shadow-sm">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-parchment border-b border-hairline text-mute font-mono uppercase text-[11px]">
              <th class="p-3.5">Resort & State</th>
              <th class="p-3.5">Altitude & Drop</th>
              <th class="p-3.5">Lift Infrastructure</th>
              <th class="p-3.5">Best Months</th>
              <th class="p-3.5">Snowboard Suitability</th>
              <th class="p-3.5">Est. Daily Budget</th>
              <th class="p-3.5">Official Booking</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-hairline">
            {resortsList.map(r => (
              <tr key={r.id} class="hover:bg-parchment/40 transition-colors">
                <td class="p-3.5 font-semibold text-ink">
                  <div class="text-sm font-bold text-ink">{r.name}</div>
                  <div class="text-[11px] text-mute">{r.state}</div>
                </td>
                <td class="p-3.5 font-mono text-ink">
                  <div>{r.elevationBaseM}m – {r.elevationTopM}m</div>
                  <div class="text-[11px] text-accent font-semibold">↕ {r.verticalDropM}m vertical</div>
                </td>
                <td class="p-3.5 text-mute max-w-[200px]">
                  {r.primaryLifts}
                </td>
                <td class="p-3.5 text-ink">
                  {r.bestMonths}
                </td>
                <td class="p-3.5">
                  <span
                    class={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                      r.snowboardSuitability.startsWith('Excellent')
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : r.snowboardSuitability.startsWith('Moderate')
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {r.snowboardSuitability}
                  </span>
                </td>
                <td class="p-3.5 font-mono text-ink">
                  <div>₹{r.avgDailyBudgetInr.backpacker.toLocaleString()} (Budget)</div>
                  <div class="text-mute text-[11px]">₹{r.avgDailyBudgetInr.midRange.toLocaleString()} (Comfort)</div>
                </td>
                <td class="p-3.5">
                  {r.officialBookingUrl ? (
                    <a
                      href={r.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <span>{r.officialPortalName || 'Official Portal'}</span>
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                    </a>
                  ) : (
                    <span class="text-mute text-[11px]">Offline / On-ground</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card Layout */}
      <div class="md:hidden space-y-4">
        {resortsList.map(r => (
          <div key={r.id} class="p-4 rounded-2xl bg-canvas border border-hairline shadow-sm space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h4 class="text-base font-bold text-ink">{r.name}</h4>
                <span class="text-xs text-mute font-mono">{r.state} · {r.elevationTopM}m</span>
              </div>
              <span class="text-xs font-mono font-bold text-primary">
                ₹{r.avgDailyBudgetInr.midRange.toLocaleString()}/day
              </span>
            </div>

            <div class="space-y-1 text-xs text-mute">
              <div><strong class="text-ink">Vertical Drop:</strong> {r.verticalDropM}m ({r.elevationBaseM}m to {r.elevationTopM}m)</div>
              <div><strong class="text-ink">Lifts:</strong> {r.primaryLifts}</div>
              <div><strong class="text-ink">Season:</strong> {r.bestMonths}</div>
              <div><strong class="text-ink">Snowboard Suitability:</strong> {r.snowboardSuitability}</div>
            </div>

            {r.officialBookingUrl && (
              <div class="pt-2 border-t border-hairline">
                <a
                  href={r.officialBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Book on {r.officialPortalName || 'Official Portal'} →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
