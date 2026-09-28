import { useState } from 'react';
import bindings from '../../data/bindings.json';
import { CheckCircle2Icon, AlertTriangleIcon, InfoIcon } from '../ui/Icons';

interface BindingCheckerProps {
  din: number;
}

export function BindingChecker({ din }: BindingCheckerProps) {
  const [selectedModel, setSelectedModel] = useState<string>('');

  const currentBinding = bindings.find(b => `${b.brand} ${b.model}` === selectedModel);

  let status: 'optimal' | 'marginal' | 'incompatible' | 'none' = 'none';
  let message = '';

  if (currentBinding) {
    if (din < currentBinding.dinMin) {
      status = 'incompatible';
      message = `Calculated DIN (${din.toFixed(2)}) is BELOW this binding's minimum setting (${currentBinding.dinMin}). A junior or lighter-release binding is required.`;
    } else if (din > currentBinding.dinMax) {
      status = 'incompatible';
      message = `Calculated DIN (${din.toFixed(2)}) EXCEEDS this binding's maximum setting (${currentBinding.dinMax}). A higher-capacity binding is required.`;
    } else {
      const range = currentBinding.dinMax - currentBinding.dinMin;
      const lowerThird = currentBinding.dinMin + range * 0.2;
      const upperThird = currentBinding.dinMax - range * 0.2;

      if (din >= lowerThird && din <= upperThird) {
        status = 'optimal';
        message = `Optimal match: DIN ${din.toFixed(2)} sits in the sweet spot of the ${currentBinding.dinMin}–${currentBinding.dinMax} scale.`;
      } else {
        status = 'marginal';
        message = `Compatible: DIN ${din.toFixed(2)} is within range (${currentBinding.dinMin}–${currentBinding.dinMax}), but near the edge of the spring tension scale.`;
      }
    }
  }

  return (
    <div className="p-4 rounded-xl bg-parchment border border-hairline space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="binding-model-select" className="text-xs font-semibold text-ink flex items-center gap-1.5">
          <InfoIcon className="w-3.5 h-3.5 text-accent" />
          <span>Binding Scale Compatibility Check</span>
        </label>
        <span className="text-[10px] font-mono text-mute">{bindings.length} Verified Models</span>
      </div>

      <select
        id="binding-model-select"
        value={selectedModel}
        onChange={(e) => setSelectedModel((e.target as HTMLSelectElement).value)}
        className="w-full bg-input border border-hairline rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all font-sans cursor-pointer"
      >
        <option value="">Select your ski binding model...</option>
        {bindings.map((b) => (
          <option key={`${b.brand}-${b.model}`} value={`${b.brand} ${b.model}`}>
            {b.brand} {b.model} (DIN {b.dinMin}–{b.dinMax})
          </option>
        ))}
      </select>

      {status !== 'none' && (
        <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all ${
          status === 'optimal' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : status === 'marginal'
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'
            : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
        }`}>
          {status === 'optimal' ? (
            <CheckCircle2Icon className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
          ) : (
            <AlertTriangleIcon className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
          )}
          <div className="space-y-1">
            <p className="font-medium leading-relaxed">{message}</p>
            {currentBinding && (
              <p className="text-[10px] opacity-75">
                {currentBinding.notes} · <a href={currentBinding.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100">Manufacturer Specs</a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
