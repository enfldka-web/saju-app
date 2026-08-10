import type { OhaengDistribution } from "@/lib/saju";
import { OHAENG_COLOR_VAR, OHAENG_LABEL_HANJA } from "./ohaeng-colors";

const ORDER = ["목", "화", "토", "금", "수"] as const;

export function OhaengBar({ distribution }: { distribution: OhaengDistribution }) {
  const total = ORDER.reduce((sum, key) => sum + distribution[key], 0) || 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-800">
        {ORDER.map((key) => {
          const share = distribution[key] / total;
          if (share === 0) return null;
          return (
            <div
              key={key}
              style={{ width: `${share * 100}%`, background: `var(${OHAENG_COLOR_VAR[key]})` }}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {ORDER.map((key) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium text-ink-950"
              style={{ background: `var(${OHAENG_COLOR_VAR[key]})` }}
            >
              {OHAENG_LABEL_HANJA[key]}
            </span>
            <span className="text-[11px] text-paper-500">{key}</span>
            <span className="text-xs font-semibold text-paper-100">{distribution[key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
