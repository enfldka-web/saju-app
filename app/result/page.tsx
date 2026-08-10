import Link from "next/link";
import { calculateSaju, getCurrentSewoon, generateSewoonSummary } from "@/lib/saju";
import type { CalendarType, Gender } from "@/lib/saju";
import { generateFreeSummary } from "@/lib/ai/free-summary";
import { PillarTable } from "@/components/result/pillar-table";
import { OhaengBar } from "@/components/result/ohaeng-bar";
import { YearFortune } from "@/components/result/year-fortune";
import { ReadingUnlock } from "@/components/result/reading-unlock";

function parseSearchParams(params: Record<string, string | string[] | undefined>) {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const calendar = get("calendar") === "lunar" ? "lunar" : "solar";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const gender: Gender = get("gender") === "male" ? "male" : "female";
  const leap = get("leap") === "1";
  const hourRaw = get("hour");
  const hour = hourRaw === undefined ? undefined : Number(hourRaw);
  const previewToken = get("preview");

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return {
    input: {
      calendar: calendar as CalendarType,
      year,
      month,
      day,
      isLeapMonth: leap,
      hour,
      minute: 0,
      gender,
    },
    previewToken,
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parsed = parseSearchParams(await searchParams);

  if (!parsed) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-paper-500">생년월일 정보가 없어요.</p>
        <Link href="/" className="text-sm font-medium text-gold-500">
          다시 입력하러 가기
        </Link>
      </main>
    );
  }

  const { input: sajuInput, previewToken } = parsed;

  let result;
  try {
    result = calculateSaju(sajuInput);
  } catch {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-paper-500">입력하신 날짜를 계산할 수 없어요.</p>
        <Link href="/" className="text-sm font-medium text-gold-500">
          다시 입력하러 가기
        </Link>
      </main>
    );
  }

  const summary = generateFreeSummary(result);
  const sewoon = getCurrentSewoon();
  const yearSummary = generateSewoonSummary(result.chart.day.ohaeng[0], sewoon);

  return (
    <main className="mx-auto flex w-full max-w-sm flex-col gap-8 px-6 py-8 pb-16">
      <header className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 발급 완료</span>
        <h1 className="font-display text-2xl font-bold text-paper-100">사주 원국 증서</h1>
        <p className="text-sm text-paper-500">
          {result.chart.resolvedSolar.year}년 {result.chart.resolvedSolar.month}월{" "}
          {result.chart.resolvedSolar.day}일 · {sajuInput.gender === "male" ? "남성" : "여성"}
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <PillarTable year={result.chart.year} month={result.chart.month} day={result.chart.day} time={result.chart.time} />
        <p className="rounded-xl bg-ink-900 px-4 py-3 text-sm leading-relaxed text-paper-100">{summary}</p>
      </section>

      <YearFortune
        year={sewoon.year}
        ganjiHangul={sewoon.pillar.hangul}
        ganjiHanja={sewoon.pillar.hanja}
        summary={yearSummary}
      />

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-paper-100">오행 분포</h2>
        <OhaengBar distribution={result.ohaengDistribution} />
      </section>

      <ReadingUnlock sajuInput={sajuInput} previewToken={previewToken} />

      <Link href="/" className="text-center text-xs text-paper-500 underline underline-offset-4">
        다른 생년월일로 다시 보기
      </Link>
    </main>
  );
}
