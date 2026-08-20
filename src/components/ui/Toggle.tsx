import { cn } from '../../utils/cn';

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Toggle({ options, value, onChange, className }: ToggleProps) {
  return (
    <div className={cn("inline-flex p-1 bg-parchment rounded-full border border-hairline", className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 cursor-pointer select-none",
              isSelected 
                ? "bg-canvas text-ink shadow-sm" 
                : "text-mute hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
