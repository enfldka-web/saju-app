"use client";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  name: string;
}

export function Segmented<T extends string>({ options, value, onChange, name }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" className="grid grid-cols-2 gap-1.5 rounded-xl bg-ink-900 p-1.5 ring-1 ring-ink-700">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            name={name}
            onClick={() => onChange(option.value)}
            className={`rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ${
              active
                ? "bg-gold-500 text-ink-950"
                : "text-paper-500 hover:text-paper-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
