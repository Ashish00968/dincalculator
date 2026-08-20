import React from 'react';
import { cn } from '../../utils/cn';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function Slider({ className, value, onValueChange, min, max, step = 1, ...props }: SliderProps) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  return (
    <div className="relative w-full h-6 flex items-center group select-none">
      <div className="absolute w-full h-1.5 bg-parchment rounded-full overflow-hidden border border-hairline">
        <div 
          className="h-full bg-primary transition-all duration-75 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className={cn(
          "absolute w-full h-full opacity-0 cursor-pointer z-10",
          className
        )}
        {...props}
      />
    </div>
  );
}
