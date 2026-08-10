interface YearFortuneProps {
  year: number;
  ganjiHangul: string;
  ganjiHanja: string;
  summary: string;
}

export function YearFortune({ year, ganjiHangul, ganjiHanja, summary }: YearFortuneProps) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-paper-100">{year}년 총운</h2>
        <span className="rounded-full border border-ink-600 px-2.5 py-1 text-[11px] text-gold-500">
          세운 {ganjiHangul}({ganjiHanja})
        </span>
      </div>
      <p className="rounded-xl bg-ink-900 px-4 py-3 text-sm leading-relaxed text-paper-100">{summary}</p>
    </section>
  );
}
