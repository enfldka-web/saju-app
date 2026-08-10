export interface CategoryInterpretation {
  headline: string;
  body: string;
}

export interface SajuInterpretation {
  career: CategoryInterpretation;
  wealth: CategoryInterpretation;
  love: CategoryInterpretation;
  health: CategoryInterpretation;
}

export const INTERPRETATION_CATEGORIES = ["career", "wealth", "love", "health"] as const;
