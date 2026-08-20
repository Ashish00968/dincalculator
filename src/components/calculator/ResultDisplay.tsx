import { useState } from 'react';
import type { DinResult } from '../../engine/types';
import { Card, CardContent } from '../ui/Card';
import { DinGauge } from './DinGauge';
import { Info, AlertTriangle, CheckCircle2, Copy, Printer, ChevronDown, ChevronUp, Check, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ResultDisplayProps {
  result: DinResult | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <Card className="h-full flex flex-col items-center justify-center min-h-[420px] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-input border border-hairline flex items-center justify-center text-mute mb-4 shadow-inner">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-primary mb-1">Awaiting Skier Profile</h3>
        <p className="text-xs text-mute max-w-xs leading-relaxed">
          Input your weight, height, age, skier type, and boot sole length to compute your ISO 11088 release setting.
        </p>
      </Card>
    );
  }

  const {
    din,
    baselineCode,
    adjustedCode,
    skierTypeModifier,
    ageModifier,
    bslRangeLabel,
    warningLevel,
    notes,
  } = result;

  const handleCopy = async () => {
    const summary = `=== DIN Calculator Pro Settings Card ===
Recommended DIN: ${din.toFixed(2)}
Baseline Skier Code: Code ${baselineCode}
Skier Type Modifier: ${skierTypeModifier > 0 ? '+' : ''}${skierTypeModifier}
Age Modifier: ${ageModifier < 0 ? ageModifier : '0'}
Final Skier Code: Code ${adjustedCode}
Boot Sole Length Bracket: ${bslRangeLabel}
Standard: ISO 11088:2018 Certified
Note: Bindings must be calibrated and tested by a certified ski technician.
Calculated at: https://dincalculatorpro.com`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Featured Primary Result Card */}
      <Card className="relative overflow-hidden border-hairline bg-canvas">
        
        <CardContent className="pt-6 pb-6 space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
              <span>Recommended Setting</span>
            </span>
            <span className="text-[11px] font-mono text-mute">ISO 11088</span>
          </div>

          <DinGauge din={din} />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-hairline">
            <div className="p-3 rounded-xl bg-parchment border border-hairline text-center">
              <span className="text-xs text-mute block mb-1">Final Code</span>
              <span className="text-base font-semibold text-ink">Code {adjustedCode}</span>
            </div>
            <div className="p-3 rounded-xl bg-parchment border border-hairline text-center">
              <span className="text-xs text-mute block mb-1">BSL Bracket</span>
              <span className="text-base font-semibold text-ink">{bslRangeLabel}</span>
            </div>
          </div>

          {/* Action CTAs: 100px Pill Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button 
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-canvas border border-hairline hover:border-primary/50 text-ink text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-mute" />
                  <span>Copy Card</span>
                </>
              )}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:scale-[0.98] text-canvas text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Breakdown Accordion */}
      <Card>
        <button 
          className="w-full flex items-center justify-between p-5 focus:outline-none cursor-pointer select-none"
          onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
        >
          <div className="flex items-center gap-2 font-semibold text-ink text-sm">
            <Info className="w-4 h-4 text-primary" />
            <span>Calculation Trace</span>
          </div>
          {isBreakdownOpen ? (
            <ChevronUp className="w-4 h-4 text-mute" />
          ) : (
            <ChevronDown className="w-4 h-4 text-mute" />
          )}
        </button>
        
        {isBreakdownOpen && (
          <CardContent className="pt-0 space-y-3.5 text-xs text-mute border-t border-hairline pt-4">
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">1</span>
              <div>
                <span className="text-ink font-medium">Baseline Skier Code:</span>
                <p className="text-mute mt-0.5">Physical dimensions map to <strong className="text-ink font-medium">Code {baselineCode}</strong>.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">2</span>
              <div>
                <span className="text-ink font-medium">Skier Type Modifier:</span>
                <p className="text-mute mt-0.5">Applied shift of <strong className="text-ink font-medium">{skierTypeModifier > 0 ? '+' : ''}{skierTypeModifier} Step{Math.abs(skierTypeModifier) !== 1 ? 's' : ''}</strong>.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">3</span>
              <div>
                <span className="text-ink font-medium">Age Modifier:</span>
                <p className="text-mute mt-0.5">Age shift of <strong className="text-ink font-medium">{ageModifier < 0 ? ageModifier : '0'} Step{Math.abs(ageModifier) !== 1 ? 's' : ''}</strong> → Final <strong className="text-ink font-medium">Code {adjustedCode}</strong>.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">4</span>
              <div>
                <span className="text-ink font-medium">Matrix Intersection:</span>
                <p className="text-mute mt-0.5">Code {adjustedCode} intersected with {bslRangeLabel} yields <strong className="text-ink font-medium">{din.toFixed(2)} DIN</strong>.</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Safety & Warning Alerts */}
      {notes.length > 0 && (
        <div className={cn(
          "p-4 rounded-xl border flex gap-3 text-xs",
          warningLevel === 'caution' ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-200" :
          warningLevel === 'warning' ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-200" :
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-200"
        )}>
          {warningLevel === 'caution' || warningLevel === 'warning' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-400" />
          )}
          <ul className="space-y-1">
            {notes.map((note, i) => <li key={i}>{note}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
