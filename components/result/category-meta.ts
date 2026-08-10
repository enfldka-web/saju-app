import type { Ohaeng } from "@/lib/saju";

export const CATEGORY_META = [
  { key: "career", label: "커리어", teaser: "지금 흐름이 이직에 유리한 시기인지", color: "수" as Ohaeng },
  { key: "wealth", label: "재물", teaser: "돈이 들어오고 나가는 패턴의 열쇠", color: "토" as Ohaeng },
  { key: "love", label: "연애 · 인간관계", teaser: "올해 인연의 방향을 가르는 한 글자", color: "화" as Ohaeng },
  { key: "health", label: "건강", teaser: "체질상 가장 신경 써야 할 부분", color: "목" as Ohaeng },
] as const;
