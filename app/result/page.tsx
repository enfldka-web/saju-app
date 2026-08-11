import Link from "next/link";
import type { Metadata } from "next";
import { calculateSaju, getCurrentSewoon, generateSewoonSummary, parseSajuSearchParams } from "@/lib/saju";
import type { ResultSearchParams } from "@/lib/saju";
import { generateFreeSummary } from "@/lib/ai/free-summary";
import { PillarTable } from "@/components/result/pillar-table";
import { OhaengBar } from "@/components/result/ohaeng-bar";
import { YearFortune } from "@/components/result/year-fortune";
import { ReadingUnlock } from "@/components/result/reading-unlock";
import { ShareButton } from "@/components/result/share-button";

function shareCardUrl(searchParams: ResultSearchParams): string {
  const qs = new URLSearchParams();
  for (const key of ["calendar", "year", "month", "day", "hour", "gender", "leap"]) {
    const value = searchParams[key];
    const flat = Array.isArray(value) ? value[0] : value;
    if (flat !== undefined) qs.set(key, flat);
  }
  return `/api/share-card?${qs.toString()}`;
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ResultSearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const parsed = parseSajuSearchParams(params);
  if (!parsed) return {};

  const imageUrl = shareCardUrl(params);
  return {
    openGraph: {
      title: "간지 — 나의 사주 증서",
      description: "정통 만세력 계산과 AI 해석으로 발급받은 나만의 사주 증서예요.",
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: Promise<ResultSearchParams>;
}) {
  const rawParams = await searchParams;
  const parsed = parseSajuSearchParams(rawParams);

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
    <main className="mx-auto w-full max-w-sm px-6 py-8 pb-16 lg:max-w-6xl lg:px-12 lg:py-16">
      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[400px_1fr] lg:items-start lg:gap-14">
        <div className="flex flex-col gap-8 lg:sticky lg:top-14">
          <header className="flex flex-col gap-2">
            <span className="text-xs tracking-[0.2em] text-gold-500 lg:text-sm">干支 · 발급 완료</span>
            <h1 className="font-display text-2xl font-bold text-paper-100 lg:text-4xl">사주 원국 증서</h1>
            <p className="text-sm text-paper-500 lg:text-base">
              {result.chart.resolvedSolar.year}년 {result.chart.resolvedSolar.month}월{" "}
              {result.chart.resolvedSolar.day}일 · {sajuInput.gender === "male" ? "남성" : "여성"}
            </p>
          </header>

          <section className="flex flex-col gap-3">
            <PillarTable year={result.chart.year} month={result.chart.month} day={result.chart.day} time={result.chart.time} />
            <p className="rounded-xl bg-ink-900 px-4 py-3 text-sm leading-relaxed text-paper-100">{summary}</p>
            <ShareButton shareText={summary} imageUrl={shareCardUrl(rawParams)} />
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
        </div>

        <div className="flex flex-col gap-8">
          <ReadingUnlock sajuInput={sajuInput} previewToken={previewToken} />

          <Link href="/" className="text-center text-xs text-paper-500 underline underline-offset-4 lg:text-left">
            다른 생년월일로 다시 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
