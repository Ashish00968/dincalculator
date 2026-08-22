import { useState } from 'react';
import { X, Footprints, Ruler, Check, Search } from 'lucide-react';
import { useTranslations } from '../../i18n/utils';
import type { ui } from '../../i18n/ui';

interface BslModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBsl?: (bsl: number) => void;
  lang?: keyof typeof ui;
}

const MONDO_BSL_MAP = [
  { mondo: '22.0 / 22.5', usMen: '4.5 / 5', usWomen: '5.5 / 6', typicalBsl: 265 },
  { mondo: '23.0 / 23.5', usMen: '5.5 / 6', usWomen: '6.5 / 7', typicalBsl: 275 },
  { mondo: '24.0 / 24.5', usMen: '6.5 / 7', usWomen: '7.5 / 8', typicalBsl: 285 },
  { mondo: '25.0 / 25.5', usMen: '7.5 / 8', usWomen: '8.5 / 9', typicalBsl: 295 },
  { mondo: '26.0 / 26.5', usMen: '8.5 / 9', usWomen: '9.5 / 10', typicalBsl: 305 },
  { mondo: '27.0 / 27.5', usMen: '9.5 / 10', usWomen: '10.5 / 11', typicalBsl: 315 },
  { mondo: '28.0 / 28.5', usMen: '10.5 / 11', usWomen: '11.5 / 12', typicalBsl: 325 },
  { mondo: '29.0 / 29.5', usMen: '11.5 / 12', usWomen: '12.5 / 13', typicalBsl: 335 },
  { mondo: '30.0 / 30.5', usMen: '12.5 / 13', usWomen: '—', typicalBsl: 345 },
  { mondo: '31.0 / 31.5', usMen: '13.5 / 14', usWomen: '—', typicalBsl: 355 },
];

export function BslModal({ isOpen, onClose, onSelectBsl, lang = 'en' }: BslModalProps) {
  const t = useTranslations(lang);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredMondo = MONDO_BSL_MAP.filter(
    (item) =>
      item.mondo.includes(searchTerm) ||
      item.usMen.includes(searchTerm) ||
      item.usWomen.includes(searchTerm) ||
      item.typicalBsl.toString().includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-ink border border-hairline rounded-2xl shadow-2xl p-6 sm:p-8 text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-input border border-hairline text-primary shadow-inner">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-primary">
                {t('bsl.title')}
              </h3>
              <p className="text-xs text-mute">
                {t('bsl.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-mute hover:text-primary hover:bg-input rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Boot Diagram */}
        <div className="my-6 p-5 rounded-xl bg-input/60 border border-hairline flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full h-32 flex items-center justify-center">
              <svg
                viewBox="0 0 240 100"
                className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M 50 15 C 60 15, 65 35, 75 45 L 140 45 C 160 45, 195 55, 205 75 L 205 85 L 25 85 L 25 45 C 25 25, 40 15, 50 15 Z" fill="var(--theme-canvas)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <rect x="52" y="25" width="22" height="4" rx="2" fill="var(--theme-input)" />
                <rect x="58" y="37" width="22" height="4" rx="2" fill="var(--theme-input)" />
                <rect x="95" y="55" width="26" height="4" rx="2" fill="var(--theme-input)" />
                <rect x="135" y="58" width="26" height="4" rx="2" fill="var(--theme-input)" />
                <rect x="20" y="80" width="30" height="9" rx="2" fill="var(--theme-ink)" stroke="var(--theme-hairline)" strokeWidth="1" />
                <rect x="175" y="80" width="35" height="9" rx="2" fill="var(--theme-ink)" stroke="var(--theme-hairline)" strokeWidth="1" />
                <circle cx="35" cy="84" r="6" fill="#38BDF8" />
                <text x="35" y="86.5" fontSize="5.5" fontWeight="bold" fill="#000000" textAnchor="middle" fontFamily="monospace">305</text>
              </svg>
            </div>
            <div className="text-center mt-2">
              <span className="caption-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                {t('bsl.lookForNumber')}
              </span>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-2.5 text-xs text-primary/80">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-input border border-hairline text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
              <p><strong className="text-primary">{t('bsl.mondoNotBsl')}</strong> {t('bsl.mondoDesc')}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-input border border-hairline text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
              <p><strong className="text-primary">{t('bsl.checkHeel')}</strong> {t('bsl.heelDesc')}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-input border border-hairline text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
              <p><strong className="text-primary">{t('bsl.measureTip')}</strong> {t('bsl.measureDesc')}</p>
            </div>
          </div>
        </div>

        {/* Mondo Point to Typical BSL Quick Reference Table */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary/90">
              <Ruler className="w-3.5 h-3.5 text-accent" />
              <span>{t('bsl.mondoLookup')}</span>
            </div>
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-mute absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('bsl.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-input border border-hairline rounded-lg pl-8 pr-2.5 py-1 text-xs text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-hairline bg-input/40">
            <table className="w-full text-xs text-left">
              <thead className="caption-mono bg-input border-b border-hairline text-mute">
                <tr>
                  <th className="px-3.5 py-2.5">{t('bsl.mondoSize')}</th>
                  <th className="px-3.5 py-2.5">{t('bsl.usMen')}</th>
                  <th className="px-3.5 py-2.5">{t('bsl.usWomen')}</th>
                  <th className="px-3.5 py-2.5 text-right">{t('bsl.typicalBsl')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline font-mono">
                {filteredMondo.map((row) => (
                  <tr
                    key={row.mondo}
                    onClick={() => {
                      if (onSelectBsl) {
                        onSelectBsl(row.typicalBsl);
                        onClose();
                      }
                    }}
                    className="hover:bg-input/60 cursor-pointer transition-colors group"
                  >
                    <td className="px-3.5 py-2.5 font-medium text-primary">{row.mondo}</td>
                    <td className="px-3.5 py-2.5 text-mute">{row.usMen}</td>
                    <td className="px-3.5 py-2.5 text-mute">{row.usWomen}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-accent group-hover:text-accent/80 flex items-center justify-end gap-1.5">
                      <span>{row.typicalBsl} mm</span>
                      <Check className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-hairline flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-primary text-canvas hover:bg-primary/90 text-xs font-semibold transition-colors cursor-pointer"
          >
            {t('bsl.done')}
          </button>
        </div>
      </div>
    </div>
  );
}
