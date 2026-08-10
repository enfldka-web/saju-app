import type { Pillar } from "@/lib/saju";
import { OHAENG_COLOR_VAR } from "./ohaeng-colors";

const COLUMN_LABELS = ["년주", "월주", "일주", "시주"] as const;

function PillarCell({ label, pillar }: { label: string; pillar: Pillar | null }) {
  return (
    <div className="flex flex-col items-center gap-2 px-1 py-3">
      <span className="text-[10px] tracking-[0.1em] text-parchment-ink-soft">{label}</span>
      {pillar ? (
        <>
          <div className="flex flex-col items-center gap-2 font-display text-xl leading-none text-parchment-ink sm:text-2xl">
            <span>{pillar.gan.hanja}</span>
            <span>{pillar.zhi.hanja}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: `var(${OHAENG_COLOR_VAR[pillar.ohaeng[0]]})` }}
            />
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: `var(${OHAENG_COLOR_VAR[pillar.ohaeng[1]]})` }}
            />
          </div>
          <span className="text-[10px] text-parchment-ink-soft">
            {pillar.gan.hangul}
            {pillar.zhi.hangul}
          </span>
        </>
      ) : (
        <span className="py-6 text-[11px] text-parchment-ink-soft">미상</span>
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
    <div className="relative rounded-sm bg-parchment-100 p-5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.5)] sm:p-6">
      <div className="pointer-events-none absolute inset-[7px] border border-parchment-rule" />

      <div className="text-center">
        <p className="font-display text-sm font-bold tracking-[0.3em] text-parchment-ink">四 柱 命 式</p>
        <p className="mt-1 text-[9px] tracking-[0.15em] text-parchment-ink-soft">SAJU ORIGINAL CHART</p>
      </div>

      <div className="mt-4 grid grid-cols-4 divide-x divide-parchment-rule border-t border-parchment-rule">
        {pillars.map((pillar, i) => (
          <PillarCell key={COLUMN_LABELS[i]} label={COLUMN_LABELS[i]} pillar={pillar} />
        ))}
      </div>

      <div className="absolute -bottom-4 -right-3 flex h-[70px] w-[70px] rotate-[-9deg] items-center justify-center rounded-full border-2 border-parchment-100/70 bg-seal text-center shadow-[0_6px_16px_rgba(0,0,0,0.35)]">
        <span className="font-display text-[11px] font-bold leading-tight text-parchment-100">
          {day.hanja}
          <br />
          日主
        </span>
      </div>
    </div>
  );
}
