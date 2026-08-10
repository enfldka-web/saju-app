"use client";

import type { SelectHTMLAttributes } from "react";
import { IconChevronDown } from "./icons";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function SelectField({ label, className, ...props }: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-paper-500">{label}</span>
      <span className="relative block">
        <select
          {...props}
          className={`w-full appearance-none rounded-xl border border-ink-600 bg-ink-900 px-3.5 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-gold-500 disabled:opacity-40 ${className ?? ""}`}
        >
          {props.children}
        </select>
        <IconChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-500" />
      </span>
    </label>
  );
}
