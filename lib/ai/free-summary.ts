import type { SajuResult } from "@/lib/saju";

/**
 * 무료 미리보기용 "한 줄 총평"을 생성한다.
 * 지금은 일간(日干, 나를 상징하는 천간)을 기준으로 한 결정론적 템플릿이며,
 * Phase 1의 AI 해석 레이어(lib/ai/interpret.ts, 유료 상세 리딩)가 붙기 전까지의
 * 완결된 무료 기능이다. 두 레이어는 독립적으로 동작하며, 향후 AI가 이 자리를
 * 대체하더라도 계산 엔진(SajuResult)과의 경계는 그대로 유지된다.
 */
const DAY_GAN_SUMMARY: Record<string, string> = {
  갑: "곧게 뻗어가는 나무 같은 사람 — 한번 정한 방향은 잘 굽히지 않아요.",
  을: "바람에 휘어도 꺾이지 않는 유연함이 무기예요.",
  병: "해가 뜨듯 존재만으로 주변을 밝히는 기운이 있어요.",
  정: "은은하지만 꺼지지 않는 촛불 같은 지속력을 지녔어요.",
  무: "산처럼 묵직하게 자리를 지키는 힘이 있어요.",
  기: "기름진 땅처럼 사람과 기회를 품고 키워내요.",
  경: "잘 벼린 칼처럼 결단이 빠르고 분명해요.",
  신: "다듬어진 보석처럼 섬세하고 정교한 감각을 지녔어요.",
  임: "큰 바다처럼 담아내는 그릇이 넓어요.",
  계: "이슬비처럼 조용히 스며들어 결국 적셔내는 사람이에요.",
};

export function generateFreeSummary(result: SajuResult): string {
  const dayGanHangul = result.chart.day.gan.hangul;
  return DAY_GAN_SUMMARY[dayGanHangul] ?? "고유한 기운을 지닌 사주예요.";
}
