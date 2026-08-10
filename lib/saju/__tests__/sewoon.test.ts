import { describe, expect, it } from "vitest";
import { getCurrentSewoon, generateSewoonSummary, getMonthPillarsForYear, getElementRelationship } from "../sewoon";

describe("getElementRelationship", () => {
  it("같은 오행이면 비화", () => {
    expect(getElementRelationship("목", "목")).toBe("비화");
  });
  it("나를 생하는 오행이면 인성", () => {
    expect(getElementRelationship("화", "목")).toBe("인성"); // 목생화
  });
  it("내가 생하는 오행이면 식상", () => {
    expect(getElementRelationship("목", "화")).toBe("식상"); // 목생화
  });
  it("내가 극하는 오행이면 재성", () => {
    expect(getElementRelationship("목", "토")).toBe("재성"); // 목극토
  });
  it("나를 극하는 오행이면 관성", () => {
    expect(getElementRelationship("토", "목")).toBe("관성"); // 목극토
  });
});

describe("getCurrentSewoon", () => {
  it("특정 날짜 기준으로 결정론적인 연주를 반환한다", () => {
    const date = new Date(2026, 7, 10); // 2026-08-10
    const a = getCurrentSewoon(date);
    const b = getCurrentSewoon(date);
    expect(a).toEqual(b);
    expect(a.pillar.hangul).toHaveLength(2);
  });
});

describe("generateSewoonSummary", () => {
  it("일간 오행과 세운 오행 관계에 따라 문장을 생성한다", () => {
    const sewoon = getCurrentSewoon(new Date(2026, 7, 10));
    const summary = generateSewoonSummary("금", sewoon);
    expect(summary).toContain(String(sewoon.year));
    expect(summary.length).toBeGreaterThan(20);
  });
});

describe("getMonthPillarsForYear", () => {
  it("12개월치 월주를 반환한다", () => {
    const months = getMonthPillarsForYear(2026);
    expect(months).toHaveLength(12);
    expect(months.map((m) => m.month)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    for (const m of months) {
      expect(m.pillar.hangul).toHaveLength(2);
    }
  });

  it("결정론적이다 (같은 연도는 항상 같은 월주)", () => {
    const a = getMonthPillarsForYear(2026);
    const b = getMonthPillarsForYear(2026);
    expect(a).toEqual(b);
  });
});
