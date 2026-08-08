import type { Ohaeng } from "./ganji-maps";

export type CalendarType = "solar" | "lunar";
export type Gender = "male" | "female";

/** 자시(23:00~01:00) 처리 방식. 두 관행이 모두 실사용되므로 선택 가능하게 둔다.
 *  - "next-day": 23:00부터 다음날로 취급 (조자시/야자시 구분 없음, 다수 모던 만세력 앱의 기본값)
 *  - "traditional": 23:00~24:00은 당일 일주 유지, 00:00 이후에만 다음날로 취급
 */
export type JasiRule = "next-day" | "traditional";

export interface SajuInput {
  /** 달력 종류 (양력/음력) */
  calendar: CalendarType;
  year: number;
  month: number;
  day: number;
  /** 음력 윤달 여부 (calendar === "lunar"일 때만 유효) */
  isLeapMonth?: boolean;
  /** 시(0-23). 출생시간을 모르면 undefined — 시주 없이 3주만 계산 */
  hour?: number;
  minute?: number;
  gender: Gender;
  jasiRule?: JasiRule;
}

/** 하나의 기둥(주, 柱) — 천간+지지 조합 */
export interface Pillar {
  /** 한자 원문, 예: "辛酉" */
  hanja: string;
  /** 한글 표기, 예: "신유" */
  hangul: string;
  gan: { hanja: string; hangul: string };
  zhi: { hanja: string; hangul: string };
  /** 이 기둥의 오행 (천간 오행, 지지 오행) */
  ohaeng: [Ohaeng, Ohaeng];
  /** 지지의 지장간(숨은 천간), 한글 */
  jijanggan: string[];
}

export interface SajuChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  /** 출생시간 미상이면 null */
  time: Pillar | null;
  /** 계산에 사용된 실제 양력 생년월일시 (검증/디버깅용) */
  resolvedSolar: { year: number; month: number; day: number; hour: number; minute: number };
}

export interface OhaengDistribution {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface DaewoonEntry {
  /** 몇 번째 대운인지 (0부터) */
  index: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  ganZhi: { hanja: string; hangul: string };
  ohaeng: [Ohaeng, Ohaeng];
}

export interface DaewoonInfo {
  /** 대운수 (첫 대운이 시작되는 나이) */
  startAge: number;
  /** 순행 여부 (양남음녀=순행, 음남양녀=역행) */
  isForward: boolean;
  list: DaewoonEntry[];
}

export interface SajuResult {
  input: SajuInput;
  chart: SajuChart;
  ohaengDistribution: OhaengDistribution;
  daewoon: DaewoonInfo | null;
}
