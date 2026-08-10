import type { Pillar } from "@/lib/saju";
import { OHAENG_COLOR_VAR } from "./ohaeng-colors";

const COLUMN_LABELS = ["년주", "월주", "일주", "시주"] as const;

function PillarCell({ label, pillar, emphasize }: { label: string; pillar: Pillar | null; emphasize?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-3 py-4 ${emphasize ? "bg-gold-500/[0.06]" : ""}`}>
      <span className="text-[11px] text-paper-500">{label}</span>
      {pillar ? (
        <>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-2xl text-paper-100">{pillar.gan.hanja}</span>
            <span className="text-[11px] text-paper-500">{pillar.gan.hangul}</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: `var(${OHAENG_COLOR_VAR[pillar.ohaeng[0]]})` }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-display text-2xl text-paper-100">{pillar.zhi.hanja}</span>
            <span className="text-[11px] text-paper-500">{pillar.zhi.hangul}</span>
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: `var(${OHAENG_COLOR_VAR[pillar.ohaeng[1]]})` }}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center py-6">
          <span className="text-xs text-paper-500">시간 미상</span>
        </div>
      )}
    </div>
  );
}

export function PillarTable({
  year,
  month,
  day,
  time,
}: {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  time: Pillar | null;
}) {
  const pillars = [year, month, day, time];

  return (
    <div className="grid grid-cols-4 divide-x divide-ink-700 rounded-2xl border border-ink-700 bg-ink-900">
      {pillars.map((pillar, i) => (
        <PillarCell key={COLUMN_LABELS[i]} label={COLUMN_LABELS[i]} pillar={pillar} emphasize={i === 2} />
      ))}
    </div>
  );
}
