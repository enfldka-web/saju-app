import { Solar } from "lunar-javascript";
import { buildPillar } from "./calculate";
import type { Ohaeng } from "./ganji-maps";
import type { Pillar } from "./types";

/** 오행 상생(내가 생하는 대상) 매핑 */
const GENERATES: Record<Ohaeng, Ohaeng> = { 목: "화", 화: "토", 토: "금", 금: "수", 수: "목" };
/** 오행 상극(내가 극하는 대상) 매핑 */
const CONTROLS: Record<Ohaeng, Ohaeng> = { 목: "토", 토: "수", 수: "화", 화: "금", 금: "목" };

export type SewoonRelationship = "비화" | "인성" | "식상" | "재성" | "관성";

export function getElementRelationship(dayMaster: Ohaeng, other: Ohaeng): SewoonRelationship {
  if (dayMaster === other) return "비화";
  if (GENERATES[other] === dayMaster) return "인성";
  if (GENERATES[dayMaster] === other) return "식상";
  if (CONTROLS[dayMaster] === other) return "재성";
  return "관성";
}

const RELATIONSHIP_TEMPLATE: Record<SewoonRelationship, (year: number, ganji: string) => string> = {
  비화: (year, ganji) =>
    `${year}년 ${ganji}년은 일간과 같은 기운이 겹치는 해예요. 지금 하던 방향을 그대로 밀고 나가면 힘이 실리지만, 고집이 세지기 쉬우니 주변 의견에 귀 기울이는 균형이 필요해요.`,
  인성: (year, ganji) =>
    `${year}년 ${ganji}년은 나를 채워주는 기운이 들어오는 해예요. 배움, 휴식, 주변의 도움이 자연스럽게 따라붙는 시기라 무리하게 애쓰기보다 흐름에 올라타는 편이 유리해요.`,
  식상: (year, ganji) =>
    `${year}년 ${ganji}년은 내 안의 에너지를 밖으로 표현하고 쓰는 흐름이에요. 새로운 시도나 관계 확장에는 좋지만, 체력과 자원 관리를 신경 써야 지치지 않아요.`,
  재성: (year, ganji) =>
    `${year}년 ${ganji}년은 밖으로 나가 성과를 만들어내는 기운이 강한 해예요. 재물이나 성과를 향한 추진력이 붙지만, 그만큼 관리와 절제가 함께 필요한 시기예요.`,
  관성: (year, ganji) =>
    `${year}년 ${ganji}년은 규율과 책임이 무거워지는 기운이 들어오는 해예요. 부담스럽게 느껴질 수 있지만, 이 압박을 잘 통과하면 다음 단계로 올라서는 발판이 되는 시기예요.`,
};

/** 오늘(또는 지정한 날짜) 기준 세운(歲運) — 그 해를 대표하는 연주를 계산한다. 결정론적, 라이브러리 계산 그대로. */
export function getCurrentSewoon(referenceDate: Date = new Date()): { year: number; pillar: Pillar } {
  const solar = Solar.fromYmdHms(
    referenceDate.getFullYear(),
    referenceDate.getMonth() + 1,
    referenceDate.getDate(),
    12,
    0,
    0
  );
  const eightChar = solar.getLunar().getEightChar();
  return {
    year: referenceDate.getFullYear(),
    pillar: buildPillar(eightChar.getYear(), eightChar.getYearWuXing()),
  };
}

/**
 * 일간과 세운의 오행 관계(십신 계열: 비화/인성/식상/재성/관성)를 근거로 한
 * 결정론적 총평 문장을 만든다. AI 호출 없이 무료로 제공 가능.
 */
export function generateSewoonSummary(dayMasterElement: Ohaeng, sewoon: { year: number; pillar: Pillar }): string {
  const yearElement = sewoon.pillar.ohaeng[0];
  const relationship = getElementRelationship(dayMasterElement, yearElement);
  return RELATIONSHIP_TEMPLATE[relationship](sewoon.year, sewoon.pillar.hangul);
}

/**
 * 특정 연도의 12개월 월주를 계산한다. 각 월 15일 정오를 샘플 시점으로 사용해
 * 절기 경계(월 초 며칠) 근처의 오차를 피한다 — 실제 명리 월주 계산과 동일한
 * 라이브러리를 그대로 재사용한다.
 */
export function getMonthPillarsForYear(year: number): Array<{ month: number; pillar: Pillar }> {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    const solar = Solar.fromYmdHms(year, month, 15, 12, 0, 0);
    const eightChar = solar.getLunar().getEightChar();
    months.push({ month, pillar: buildPillar(eightChar.getMonth(), eightChar.getMonthWuXing()) });
  }
  return months;
}
