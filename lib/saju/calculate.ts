import { Lunar, Solar } from "lunar-javascript";
import { ganjiToHangul, wuxingToHangulList, getJijanggan, GAN_HANJA_TO_HANGUL, ZHI_HANJA_TO_HANGUL } from "./ganji-maps";
import type { Ohaeng } from "./ganji-maps";
import { computeOhaengDistribution } from "./ohaeng";
import { computeDaewoon } from "./daewoon";
import type { Pillar, SajuChart, SajuInput, SajuResult } from "./types";

/** jasiRule -> lunar-javascript의 EightChar sect 파라미터 매핑
 *  - "next-day": 23시부터 다음날 자시로 취급 (조자시/야자시 구분 없음) -> sect 1
 *  - "traditional": 23~24시는 당일 일주 유지 -> sect 2
 *  (실측 검증: docs/SAJU_VALIDATION.md 참고)
 */
const JASI_RULE_TO_SECT: Record<NonNullable<SajuInput["jasiRule"]>, number> = {
  "next-day": 1,
  traditional: 2,
};

function validateInput(input: SajuInput): void {
  if (input.year < 1900 || input.year > 2100) {
    throw new RangeError(`지원하지 않는 연도입니다: ${input.year} (1900~2100)`);
  }
  if (input.month < 1 || input.month > 12) {
    throw new RangeError(`유효하지 않은 월입니다: ${input.month}`);
  }
  if (input.day < 1 || input.day > 31) {
    throw new RangeError(`유효하지 않은 일입니다: ${input.day}`);
  }
  if (input.hour !== undefined && (input.hour < 0 || input.hour > 23)) {
    throw new RangeError(`유효하지 않은 시입니다: ${input.hour}`);
  }
  if (input.minute !== undefined && (input.minute < 0 || input.minute > 59)) {
    throw new RangeError(`유효하지 않은 분입니다: ${input.minute}`);
  }
}

export function buildPillar(ganZhiHanja: string, wuxingHanja: string): Pillar {
  const ganHanja = ganZhiHanja[0];
  const zhiHanja = ganZhiHanja[1];
  return {
    hanja: ganZhiHanja,
    hangul: ganjiToHangul(ganZhiHanja),
    gan: { hanja: ganHanja, hangul: GAN_HANJA_TO_HANGUL[ganHanja] ?? ganHanja },
    zhi: { hanja: zhiHanja, hangul: ZHI_HANJA_TO_HANGUL[zhiHanja] ?? zhiHanja },
    ohaeng: wuxingToHangulList(wuxingHanja) as [Ohaeng, Ohaeng],
    jijanggan: getJijanggan(zhiHanja),
  };
}

/**
 * 사주 원국을 계산한다. 순수 함수 — 동일 입력에는 항상 동일 출력을 반환한다.
 * 계산은 전적으로 lunar-javascript(만세력 라이브러리)에 위임하고,
 * 이 함수는 결과를 한글 표기로 가공/구조화하는 역할만 한다.
 */
export function calculateSaju(input: SajuInput): SajuResult {
  validateInput(input);

  const jasiRule = input.jasiRule ?? "next-day";
  const sect = JASI_RULE_TO_SECT[jasiRule];

  // 시간 미상이면 정오(12:00)로 계산 — 일주 경계(자시 부근)에서 벗어나 있어
  // 연/월/일주 계산에는 영향이 없고, 시주만 결과에서 제외한다.
  const hour = input.hour ?? 12;
  const minute = input.minute ?? 0;

  const solar =
    input.calendar === "solar"
      ? Solar.fromYmdHms(input.year, input.month, input.day, hour, minute, 0)
      : Lunar.fromYmdHms(
          input.year,
          input.isLeapMonth ? -input.month : input.month,
          input.day,
          hour,
          minute,
          0
        ).getSolar();

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();
  eightChar.setSect(sect);

  const chart: SajuChart = {
    year: buildPillar(eightChar.getYear(), eightChar.getYearWuXing()),
    month: buildPillar(eightChar.getMonth(), eightChar.getMonthWuXing()),
    day: buildPillar(eightChar.getDay(), eightChar.getDayWuXing()),
    time: input.hour === undefined ? null : buildPillar(eightChar.getTime(), eightChar.getTimeWuXing()),
    resolvedSolar: {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      hour,
      minute,
    },
  };

  const ohaengDistribution = computeOhaengDistribution(chart);
  const daewoon = computeDaewoon(eightChar, input.gender, sect);

  return { input, chart, ohaengDistribution, daewoon };
}
