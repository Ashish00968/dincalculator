import { useState } from 'react';
import { cn } from '../../utils/cn';
import { ISO_11088_MATRIX, SKIER_CODES, BSL_RANGES } from '../../engine/din-engine';
import type { DinResult } from '../../engine/types';
import { Toggle } from '../ui/Toggle';
import { Table } from 'lucide-react';

interface MatrixTableProps {
  result: DinResult | null;
}

const ROW_LABELS = [
  { code: 'A', weightKg: '10–13', weightLbs: '22–29', heightCm: '—', heightFt: '—' },
  { code: 'B', weightKg: '14–17', weightLbs: '30–38', heightCm: '—', heightFt: '—' },
  { code: 'C', weightKg: '18–21', weightLbs: '39–47', heightCm: '—', heightFt: '—' },
  { code: 'D', weightKg: '22–25', weightLbs: '48–56', heightCm: '—', heightFt: '—' },
  { code: 'E', weightKg: '26–30', weightLbs: '57–66', heightCm: '—', heightFt: '—' },
  { code: 'F', weightKg: '31–35', weightLbs: '67–78', heightCm: '—', heightFt: '—' },
  { code: 'G', weightKg: '36–41', weightLbs: '79–91', heightCm: '—', heightFt: '—' },
  { code: 'H', weightKg: '42–48', weightLbs: '92–107', heightCm: '≤ 148', heightFt: '≤ 4\'10"' },
  { code: 'I', weightKg: '49–57', weightLbs: '108–125', heightCm: '149–157', heightFt: '4\'11"–5\'1"' },
  { code: 'J', weightKg: '58–66', weightLbs: '126–147', heightCm: '158–166', heightFt: '5\'2"–5\'5"' },
  { code: 'K', weightKg: '67–78', weightLbs: '148–174', heightCm: '167–178', heightFt: '5\'6"–5\'10"' },
  { code: 'L', weightKg: '79–94', weightLbs: '175–209', heightCm: '179–194', heightFt: '5\'11"–6\'4"' },
  { code: 'M', weightKg: '≥ 95', weightLbs: '≥ 210', heightCm: '≥ 195', heightFt: '≥ 6\'5"' },
  { code: 'N', weightKg: '—', weightLbs: '—', heightCm: '—', heightFt: '—' },
  { code: 'O', weightKg: '—', weightLbs: '—', heightCm: '—', heightFt: '—' },
  { code: 'P', weightKg: '—', weightLbs: '—', heightCm: '—', heightFt: '—' },
];

type RowViewMode = 'code' | 'weight_kg' | 'weight_lbs' | 'height_cm' | 'height_ft';

export function MatrixTable({ result }: MatrixTableProps) {
  const [viewMode, setViewMode] = useState<RowViewMode>('code');

  const activeRowIndex = result ? SKIER_CODES.indexOf(result.adjustedCode as any) : -1;
  const activeColIndex = result ? BSL_RANGES.findIndex(r => r.label === result.bslRangeLabel) : -1;

  const renderRowHeader = (labelObj: typeof ROW_LABELS[0]) => {
    switch (viewMode) {
      case 'weight_kg': return `${labelObj.weightKg} kg`;
      case 'weight_lbs': return `${labelObj.weightLbs} lbs`;
      case 'height_cm': return `${labelObj.heightCm} cm`;
      case 'height_ft': return labelObj.heightFt;
      default: return `Code ${labelObj.code}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Table Top Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-accent" />
            <h3 className="text-lg font-semibold text-primary">ISO 11088 Reference Matrix</h3>
          </div>
          <p className="text-xs text-mute mt-0.5">
            Crosshair maps current adjusted skier code and BSL bracket onto standard lookup table.
          </p>
        </div>

        <Toggle
          value={viewMode}
          onChange={(v) => setViewMode(v as RowViewMode)}
          options={[
            { value: 'code', label: 'Code' },
            { value: 'weight_kg', label: 'Wt (kg)' },
            { value: 'weight_lbs', label: 'Wt (lbs)' },
            { value: 'height_cm', label: 'Ht (cm)' },
            { value: 'height_ft', label: 'Ht (ft)' },
          ]}
        />
      </div>

      {/* Matrix Surface */}
      <div className="rounded-2xl card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead className="caption-mono text-mute bg-input border-b border-hairline sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-4 py-3 sticky left-0 bg-input border-r border-hairline z-20 w-36">
                  {viewMode === 'code' ? 'Skier Code' : 'Physical Bracket'}
                </th>
                {BSL_RANGES.map((range, i) => (
                  <th 
                    key={range.label} 
                    scope="col" 
                    className={cn(
                      "px-3.5 py-3 text-center transition-colors font-mono",
                      activeColIndex === i ? "bg-accent/15 text-accent font-bold border-x border-accent/30" : "text-mute"
                    )}
                  >
                    {range.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {ISO_11088_MATRIX.map((row, rowIndex) => {
                const isRowActive = rowIndex === activeRowIndex;
                const labelObj = ROW_LABELS[rowIndex];

                return (
                  <tr 
                    key={rowIndex} 
                    className={cn(
                      "transition-colors",
                      isRowActive ? "bg-accent/10" : "hover:bg-input/60"
                    )}
                  >
                    <th 
                      scope="row" 
                      className={cn(
                        "px-4 py-2.5 font-medium whitespace-nowrap sticky left-0 bg-ink border-r border-hairline z-10 font-mono text-xs transition-colors",
                        isRowActive ? "text-accent border-l-2 border-l-accent" : "text-primary border-l-2 border-l-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {viewMode !== 'code' && (
                          <span className="inline-flex w-4 h-4 items-center justify-center rounded bg-canvas text-[10px] text-mute font-mono">
                            {labelObj.code}
                          </span>
                        )}
                        <span>{renderRowHeader(labelObj)}</span>
                      </div>
                    </th>
                    {row.map((cellValue, colIndex) => {
                      const isColActive = colIndex === activeColIndex;
                      const isCellActive = isRowActive && isColActive;
                      
                      return (
                        <td 
                          key={colIndex} 
                          className={cn(
                            "px-3 py-2.5 text-center font-mono transition-all text-xs",
                            isCellActive && "bg-primary text-canvas font-bold shadow-[0_0_15px_var(--theme-accent)] rounded scale-105 z-10 relative",
                            !isCellActive && isRowActive && "text-accent font-medium",
                            !isCellActive && isColActive && "bg-accent/5 text-accent font-medium border-x border-accent/20",
                            !isCellActive && !isRowActive && !isColActive && "text-mute"
                          )}
                          title={cellValue === null ? "Blank cell: ISO nearest-neighbor rule applies." : ""}
                        >
                          {cellValue === null ? (
                            <span className="text-mute opacity-50">—</span>
                          ) : (
                            cellValue.toFixed(2)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px] text-mute text-right font-mono">
        Official reference: ISO 11088:2018 Table 2 (Indicator settings by Skier Code and BSL)
      </p>
    </div>
  );
}
