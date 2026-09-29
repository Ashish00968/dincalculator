import { useState } from 'react';
import type { DinResult, DinNote } from '../../engine/types';
import { Card, CardContent } from '../ui/Card';
import { DinGauge } from './DinGauge';
import { BindingChecker } from './BindingChecker';
import { 
  InfoIcon as Info, 
  AlertTriangleIcon as AlertTriangle, 
  CheckCircle2Icon as CheckCircle2, 
  CopyIcon as Copy, 
  PrinterIcon as Printer, 
  ChevronDownIcon as ChevronDown, 
  ChevronUpIcon as ChevronUp, 
  CheckIcon as Check,
  ArrowRightIcon as ArrowRight,
  Share2Icon as Share2
} from '../ui/Icons';
import { cn } from '../../utils/cn';
import { useTranslations } from '../../i18n/utils';
import type { ui } from '../../i18n/ui';

interface ResultDisplayProps {
  result: DinResult | null;
  isExample?: boolean;
  lang?: keyof typeof ui;
}

function renderNote(note: DinNote, t: ReturnType<typeof useTranslations>): string {
  const template = t(note.key as any) as string;
  if (!note.params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(note.params![k] ?? ''));
}

export function ResultDisplay({ result, isExample = false, lang = 'en' }: ResultDisplayProps) {
  const t = useTranslations(lang);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!result) {
    return (
      <Card className="h-full flex flex-col items-center justify-center min-h-[420px] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-input border border-hairline flex items-center justify-center text-mute mb-4 shadow-inner">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-primary mb-1">{t('result.awaitingProfile')}</h3>
        <p className="text-xs text-mute max-w-xs leading-relaxed">
          {t('result.awaitingDesc')}
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
Standard: ISO 11088:2023 (Edition 7)
Note: Bindings must be calibrated and tested by a trained ski technician.
Calculated at: https://dincalculatorpro.com`;

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setToastMessage(t('result.toastCopied') || 'Settings card copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 2500);
    } catch {
      setCopied(true);
      setToastMessage(t('result.toastCopied') || 'Settings card copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://dincalculatorpro.com';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'My DIN Setting (ISO 11088)',
          text: `My recommended DIN setting is ${din.toFixed(2)} (Code ${adjustedCode}) for boot sole length ${bslRangeLabel}.`,
          url: shareUrl,
        });
        setToastMessage(t('result.toastLinkCopied') || 'Shared successfully!');
        setTimeout(() => setToastMessage(null), 2500);
        return;
      } catch {
        // Fallback to copy link
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToastMessage(t('result.toastLinkCopied') || 'Link copied to clipboard!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage(t('result.toastLinkCopied') || 'Link copied to clipboard!');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const stepWord = (n: number) => Math.abs(n) !== 1 ? t('result.steps') : t('result.step');

  return (
    <div id="calculator-result" className="space-y-6">
      {/* Screen Reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Recommended DIN setting is {din.toFixed(2)}, Final Skier Code {adjustedCode}, Boot Sole Length bracket {bslRangeLabel}.
      </div>

      {/* Featured Primary Result Card */}
      <Card className="relative overflow-hidden border-hairline bg-canvas">
        <CardContent className="pt-6 pb-6 space-y-6">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <span className="text-sm font-semibold text-ink flex items-center gap-1.5">
              <span>{t('calc.results')}</span>
            </span>
            <span className="text-[11px] font-mono text-mute">ISO 11088:2023</span>
          </div>

          {/* Item 4: Sensible example profile hint */}
          {isExample && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-ink/80">
              <span className="text-amber-500 text-sm shrink-0">💡</span>
              <span className="leading-relaxed">
                {t('result.exampleBanner') || 'Standard example profile loaded (75 kg · 175 cm · 30 yrs · Type II · 305 mm). Adjust parameters to calculate your personal setting.'}
              </span>
            </div>
          )}

          <DinGauge din={din} />

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-hairline">
            <div className="p-3 rounded-xl bg-parchment border border-hairline text-center">
              <span className="text-xs text-mute block mb-1">{t('result.finalCode')}</span>
              <span className="text-base font-semibold text-ink font-mono">Code {adjustedCode}</span>
            </div>
            <div className="p-3 rounded-xl bg-parchment border border-hairline text-center">
              <span className="text-xs text-mute block mb-1">{t('result.bslBracket')}</span>
              <span className="text-base font-semibold text-ink font-mono">{bslRangeLabel}</span>
            </div>
          </div>

          {/* Binding Scale Check */}
          <BindingChecker din={din} />

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-canvas border border-hairline hover:border-primary/50 text-ink text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">{t('result.copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-mute" />
                  <span>{t('result.copyCard')}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-canvas border border-hairline hover:border-primary/50 text-ink text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-mute" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary hover:scale-[0.98] text-canvas text-xs sm:text-sm font-medium rounded-full transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('result.printSheet')}</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Item 8: Action Confirmation Toast */}
      {toastMessage && (
        <div 
          role="status" 
          aria-live="polite" 
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-ink text-canvas shadow-2xl border border-hairline transition-all duration-200"
        >
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Step-by-Step Breakdown Accordion */}
      <Card>
        <button
          type="button"
          aria-expanded={isBreakdownOpen}
          aria-controls="din-calc-trace-details"
          className="w-full flex items-center justify-between p-5 focus:outline-none cursor-pointer select-none"
          onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
        >
          <div className="flex items-center gap-2 font-semibold text-ink text-sm">
            <Info className="w-4 h-4 text-primary" />
            <span>{t('result.calcTrace')}</span>
          </div>
          {isBreakdownOpen ? (
            <ChevronUp className="w-4 h-4 text-mute" />
          ) : (
            <ChevronDown className="w-4 h-4 text-mute" />
          )}
        </button>

        {isBreakdownOpen && (
          <CardContent id="din-calc-trace-details" className="pt-0 space-y-5 text-xs text-mute border-t border-hairline pt-4">
            {/* Visual Stepper with connected nodes */}
            <div className="bg-canvas/60 rounded-xl p-3 border border-hairline">
              <div className="text-[11px] font-mono uppercase tracking-wider text-mute mb-2.5 flex items-center justify-between">
                <span>Calculation Stepper</span>
                <span className="text-primary font-semibold">ISO 11088:2023</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 items-center">
                {/* Node 1: Baseline Code */}
                <div className="sm:col-span-2 p-2.5 rounded-lg bg-parchment border border-hairline text-center">
                  <div className="text-[10px] font-mono text-mute">01. Baseline</div>
                  <div className="font-mono text-sm font-bold text-ink mt-0.5">Code {baselineCode}</div>
                  <div className="text-[10px] text-mute truncate mt-0.5">Height & Weight</div>
                </div>

                {/* Arrow 1 */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center py-1 sm:py-0">
                  <span className="text-[10px] font-mono font-semibold text-primary">
                    {skierTypeModifier > 0 ? `+${skierTypeModifier}` : skierTypeModifier} Type
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-mute hidden sm:block mt-0.5" />
                  <ChevronDown className="w-3.5 h-3.5 text-mute sm:hidden" />
                </div>

                {/* Node 2: Adjusted Code */}
                <div className="sm:col-span-2 p-2.5 rounded-lg bg-parchment border border-hairline text-center">
                  <div className="text-[10px] font-mono text-mute">02. Adjusted</div>
                  <div className="font-mono text-sm font-bold text-ink mt-0.5">Code {adjustedCode}</div>
                  <div className="text-[10px] text-mute truncate mt-0.5">{ageModifier !== 0 ? `Age ${ageModifier}` : 'Standard age'}</div>
                </div>

                {/* Arrow 2 */}
                <div className="sm:col-span-1 flex flex-col items-center justify-center py-1 sm:py-0">
                  <span className="text-[10px] font-mono font-semibold text-primary truncate max-w-[80px]">
                    BSL
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-mute hidden sm:block mt-0.5" />
                  <ChevronDown className="w-3.5 h-3.5 text-mute sm:hidden" />
                </div>

                {/* Node 3: Target DIN */}
                <div className="sm:col-span-1 p-2.5 rounded-lg bg-parchment border-2 border-primary text-center">
                  <div className="text-[10px] font-mono text-ink font-semibold">03. Result</div>
                  <div className="font-mono text-sm font-extrabold text-primary mt-0.5">{din.toFixed(2)}</div>
                  <div className="text-[9px] font-mono text-ink uppercase font-semibold">DIN</div>
                </div>
              </div>
            </div>

            {/* Detailed Trace List */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">1</span>
                <div>
                  <span className="text-ink font-medium">{t('result.baselineCode')}</span>
                  <p className="text-mute mt-0.5">{t('result.baselineDesc')} <strong className="text-ink font-medium">Code {baselineCode}</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">2</span>
                <div>
                  <span className="text-ink font-medium">{t('result.skierTypeModifier')}</span>
                  <p className="text-mute mt-0.5">{t('result.skierTypeDesc')} <strong className="text-ink font-medium">{skierTypeModifier > 0 ? '+' : ''}{skierTypeModifier} {stepWord(skierTypeModifier)}</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">3</span>
                <div>
                  <span className="text-ink font-medium">{t('result.ageModifier')}</span>
                  <p className="text-mute mt-0.5">{t('result.ageDesc')} <strong className="text-ink font-medium">{ageModifier < 0 ? ageModifier : '0'} {stepWord(ageModifier)}</strong> → {t('result.finalCode2')} <strong className="text-ink font-medium">Code {adjustedCode}</strong>.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-parchment border border-hairline text-ink flex items-center justify-center shrink-0 font-mono text-[10px]">4</span>
                <div>
                  <span className="text-ink font-medium">{t('result.matrixIntersection')}</span>
                  <p className="text-mute mt-0.5">Code {adjustedCode} {t('result.matrixDesc')} {bslRangeLabel} {t('result.matrixYields')} <strong className="text-ink font-medium">{din.toFixed(2)} DIN</strong>.</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Safety & Warning Alerts */}
      {notes.length > 0 && (
        <div className={cn(
          "p-4 rounded-xl border flex gap-3 text-xs",
          warningLevel === 'caution' ? "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200" :
          warningLevel === 'warning' ? "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-200" :
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
        )}>
          {warningLevel === 'caution' || warningLevel === 'warning' ? (
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500 dark:text-amber-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-400" />
          )}
          <ul className="space-y-1">
            {notes.map((note, i) => <li key={i}>{renderNote(note, t)}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
