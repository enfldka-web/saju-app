export interface MonthlyNote {
  month: number;
  note: string;
}

export interface CategoryInterpretation {
  headline: string;
  /** 지금 이 시기의 기운/흐름 — 대운·연도 등 구체적 시기 언급 포함 */
  currentFlow: string;
  /** 실전 조언 */
  advice: string;
  /** 특히 신경 써야 할 구체적 시기 */
  timing: string;
  /** 올해 1~12월 월별 한 줄 운세 */
  monthly: MonthlyNote[];
}

export interface SajuInterpretation {
  career: CategoryInterpretation;
  wealth: CategoryInterpretation;
  love: CategoryInterpretation;
  health: CategoryInterpretation;
}

export const INTERPRETATION_CATEGORIES = ["career", "wealth", "love", "health"] as const;
