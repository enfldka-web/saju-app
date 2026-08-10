import type { SajuResult } from "@/lib/saju";
import { getCurrentSewoon, getMonthPillarsForYear } from "@/lib/saju";

/**
 * AI 프롬프트에 주입할 구조화된 원국 데이터를 만든다.
 * 계산은 이미 끝난 값을 그대로 문자열화할 뿐, 여기서 어떤 사주 계산도 하지 않는다.
 */
export function serializeChartForPrompt(result: SajuResult): string {
  const { chart, ohaengDistribution, daewoon, input } = result;

  const pillarLine = (label: string, pillar: typeof chart.year | null) =>
    pillar
      ? `${label}: ${pillar.hangul}(${pillar.hanja}) — 천간 ${pillar.gan.hangul}(${pillar.ohaeng[0]}), 지지 ${pillar.zhi.hangul}(${pillar.ohaeng[1]}), 지장간 ${pillar.jijanggan.join("·") || "없음"}`
      : `${label}: 정보 없음(출생시간 미상)`;

  const daewoonLines = daewoon
    ? daewoon.list
        .slice(0, 8)
        .map((d) => `${d.startAge}~${d.endAge}세(${d.startYear}~${d.endYear}년): ${d.ganZhi.hangul}(${d.ganZhi.hanja})`)
        .join("\n")
    : "정보 없음";

  return [
    `성별: ${input.gender === "male" ? "남성" : "여성"}`,
    pillarLine("연주", chart.year),
    pillarLine("월주", chart.month),
    pillarLine("일주(본인)", chart.day),
    pillarLine("시주", chart.time),
    `오행 분포: 목 ${ohaengDistribution.목} · 화 ${ohaengDistribution.화} · 토 ${ohaengDistribution.토} · 금 ${ohaengDistribution.금} · 수 ${ohaengDistribution.수}`,
    `대운 (${daewoon?.isForward ? "순행" : "역행"}, ${daewoon?.startAge ?? "?"}세부터):`,
    daewoonLines,
  ].join("\n");
}

/** 올해 세운 + 12개월 월주를 프롬프트용 텍스트로 직렬화한다. 계산은 lib/saju/sewoon.ts가 전담. */
export function serializeCurrentYearForPrompt(): string {
  const sewoon = getCurrentSewoon();
  const months = getMonthPillarsForYear(sewoon.year);

  const monthLines = months
    .map((m) => `${m.month}월: ${m.pillar.hangul}(${m.pillar.hanja}) — 오행 ${m.pillar.ohaeng.join("")}`)
    .join("\n");

  return [
    `[올해(${sewoon.year}년) 세운]`,
    `세운: ${sewoon.pillar.hangul}(${sewoon.pillar.hanja}) — 오행 ${sewoon.pillar.ohaeng.join("")}`,
    `[${sewoon.year}년 1~12월 월주]`,
    monthLines,
  ].join("\n");
}
