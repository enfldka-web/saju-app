import type { SajuChart, OhaengDistribution } from "./types";
import type { Ohaeng } from "./ganji-maps";

/**
 * 사주 원국(연/월/일/시주)의 오행 분포를 계산한다.
 * 각 기둥의 천간 오행 + 지지 오행을 모두 카운트한다 (시주 미상이면 3주 6글자만 카운트).
 */
export function computeOhaengDistribution(chart: SajuChart): OhaengDistribution {
  const distribution: OhaengDistribution = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };

  const pillars = [chart.year, chart.month, chart.day, chart.time].filter(
    (p): p is NonNullable<typeof p> => p !== null
  );

  for (const pillar of pillars) {
    for (const element of pillar.ohaeng) {
      distribution[element as Ohaeng] += 1;
    }
  }

  return distribution;
}
