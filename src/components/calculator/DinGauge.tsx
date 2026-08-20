

interface DinGaugeProps {
  din: number;
}

// Helper to convert polar coordinates to Cartesian
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 180) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Helper to draw an SVG arc
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export function DinGauge({ din }: DinGaugeProps) {
  const MAX_DIN = 15;
  const clampedDin = Math.min(Math.max(din, 0), MAX_DIN);
  
  const cx = 100;
  const cy = 95;
  const r = 75;

  const dinToAngle = (val: number) => (val / MAX_DIN) * 180;

  // Visual Safety Zones matching ISO torque spectrum
  const zones = [
    { start: 0, end: 3.25, stroke: "#10B981", label: "Beginner" },     // Emerald
    { start: 3.25, end: 7.75, stroke: "#38BDF8", label: "Standard" },   // Glacier Blue
    { start: 7.75, end: 10.75, stroke: "#F59E0B", label: "Advanced" },  // Amber
    { start: 10.75, end: MAX_DIN, stroke: "#F43F5E", label: "Expert" }, // Rose/Red
  ];

  // Ticks every 1 DIN unit
  const ticks = Array.from({ length: 15 }, (_, i) => i + 1);
  const needleAngle = dinToAngle(clampedDin);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 w-full">
      <svg
        className="w-full max-w-[280px] h-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
        viewBox="0 0 200 125"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Track */}
        <path
          d={describeArc(cx, cy, r, 0, 180)}
          stroke="#262626"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Dynamic Colored Safety Zones */}
        {zones.map((zone, i) => (
          <path
            key={i}
            d={describeArc(cx, cy, r, dinToAngle(zone.start), dinToAngle(zone.end))}
            stroke={zone.stroke}
            strokeWidth="10"
            strokeLinecap={i === 0 ? "round" : i === zones.length - 1 ? "round" : "butt"}
            className="opacity-85"
          />
        ))}

        {/* Precision Calibration Ticks */}
        {ticks.map(tick => {
          const angle = dinToAngle(tick);
          const inner = polarToCartesian(cx, cy, r - 10, angle);
          const outer = polarToCartesian(cx, cy, r + 2, angle);
          const isMajor = tick % 3 === 0;
          return (
            <g key={tick}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="#ffffff"
                strokeWidth={isMajor ? "2" : "1"}
                className={isMajor ? "opacity-75" : "opacity-35"}
              />
            </g>
          );
        })}

        {/* Gauge Needle with Smooth Elastic Transition */}
        <g 
          className="transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-[100px_95px]"
          style={{ transform: `rotate(${needleAngle - 90}deg)` }}
        >
          {/* Needle Center Body */}
          <polygon
            points="98,95 102,95 100,18"
            fill="#1d1d1f"
          />
          {/* Central Pivot Hub */}
          <circle cx={cx} cy={cy} r="6" fill="#1d1d1f" />
          <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
        </g>
      </svg>

      {/* Numerical Readout */}
      <div className="flex flex-col items-center mt-2">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-mono font-bold text-ink tracking-tight numeric-readout">
            {din.toFixed(2)}
          </span>
          <span className="text-sm font-mono text-mute font-medium">DIN</span>
        </div>
        <span className="text-[11px] text-mute mt-1 uppercase tracking-widest font-mono">ISO 11088 Torque</span>
      </div>
    </div>
  );
}
