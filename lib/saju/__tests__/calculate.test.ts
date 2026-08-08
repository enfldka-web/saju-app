import { describe, expect, it } from "vitest";
import { calculateSaju } from "../calculate";
import { computeOhaengDistribution } from "../ohaeng";

describe("calculateSaju - 결정론성", () => {
  it("동일 입력에는 항상 동일 출력을 반환한다", () => {
    const input = {
      calendar: "solar" as const,
      year: 1990,
      month: 6,
      day: 15,
      hour: 10,
      minute: 30,
      gender: "female" as const,
    };
    const result1 = calculateSaju(input);
    const result2 = calculateSaju(input);
    expect(result1.chart).toEqual(result2.chart);
    expect(result1.ohaengDistribution).toEqual(result2.ohaengDistribution);
    expect(result1.daewoon).toEqual(result2.daewoon);
  });
});

describe("calculateSaju - 스펙 샘플: 1981-02-11 19:30 양력 남성", () => {
  const result = calculateSaju({
    calendar: "solar",
    year: 1981,
    month: 2,
    day: 11,
    hour: 19,
    minute: 30,
    gender: "male",
  });

  it("4주 8자가 정확히 계산된다 (lunar-javascript 원본값 기준)", () => {
    expect(result.chart.year.hangul).toBe("신유");
    expect(result.chart.month.hangul).toBe("경인");
    expect(result.chart.day.hangul).toBe("경신");
    expect(result.chart.time?.hangul).toBe("병술");
  });

  it("오행 분포 합계가 8이다 (4주 x 2글자)", () => {
    const total = Object.values(result.ohaengDistribution).reduce((a, b) => a + b, 0);
    expect(total).toBe(8);
  });

  it("대운 리스트가 생성되고 순행/역행 여부가 있다", () => {
    expect(result.daewoon).not.toBeNull();
    expect(result.daewoon!.list.length).toBeGreaterThan(0);
    expect(typeof result.daewoon!.isForward).toBe("boolean");
    // 대운 간지는 모두 2글자 한자를 한글로 변환한 결과여야 한다
    for (const entry of result.daewoon!.list) {
      expect(entry.ganZhi.hangul).toHaveLength(2);
    }
  });
});

describe("calculateSaju - 출생시간 미상", () => {
  it("시주는 null이고 오행 분포는 3주(6글자) 기준으로 계산된다", () => {
    const result = calculateSaju({
      calendar: "solar",
      year: 1995,
      month: 3,
      day: 3,
      gender: "female",
    });
    expect(result.chart.time).toBeNull();
    const total = Object.values(result.ohaengDistribution).reduce((a, b) => a + b, 0);
    expect(total).toBe(6);
  });
});

describe("calculateSaju - 윤달(음력) 처리", () => {
  it("2023년 윤2월 15일은 양력 2023-04-05로 변환된다", () => {
    const result = calculateSaju({
      calendar: "lunar",
      year: 2023,
      month: 2,
      day: 15,
      isLeapMonth: true,
      hour: 12,
      gender: "male",
    });
    expect(result.chart.resolvedSolar).toEqual({ year: 2023, month: 4, day: 5, hour: 12, minute: 0 });
  });

  it("같은 2023년 2월 15일이라도 윤달 여부에 따라 다른 양력 날짜로 변환된다", () => {
    const normal = calculateSaju({
      calendar: "lunar",
      year: 2023,
      month: 2,
      day: 15,
      isLeapMonth: false,
      hour: 12,
      gender: "male",
    });
    const leap = calculateSaju({
      calendar: "lunar",
      year: 2023,
      month: 2,
      day: 15,
      isLeapMonth: true,
      hour: 12,
      gender: "male",
    });
    expect(normal.chart.resolvedSolar).not.toEqual(leap.chart.resolvedSolar);
    expect(normal.chart.day.hangul).not.toBe(leap.chart.day.hangul);
  });
});

describe("calculateSaju - 자시(子時) 경계 처리 ★검증 필요", () => {
  // 2024-03-15 23:30 출생, jasiRule에 따라 일주가 달라지는지 확인.
  // "next-day": 23시부터 다음날로 취급 -> 2024-03-16 00:30 출생과 같은 일주가 나와야 함
  // "traditional": 23~24시는 당일(3/15) 일주를 유지해야 함
  const base = { calendar: "solar" as const, year: 2024, month: 3, day: 15, hour: 23, minute: 30, gender: "male" as const };

  it("next-day 규칙: 23:30 출생은 다음날 00:30 출생과 같은 일주를 가진다", () => {
    const late = calculateSaju({ ...base, jasiRule: "next-day" });
    const nextDay = calculateSaju({ ...base, day: 16, hour: 0, minute: 30, jasiRule: "next-day" });
    expect(late.chart.day.hangul).toBe(nextDay.chart.day.hangul);
  });

  it("traditional 규칙: 23:30 출생은 당일(3/15) 정오 출생과 같은 일주를 가진다", () => {
    const late = calculateSaju({ ...base, jasiRule: "traditional" });
    const noon = calculateSaju({ ...base, hour: 12, minute: 0, jasiRule: "traditional" });
    expect(late.chart.day.hangul).toBe(noon.chart.day.hangul);
  });

  it("두 규칙은 23:30 경계에서 서로 다른 일주를 낼 수 있다", () => {
    const nextDayRule = calculateSaju({ ...base, jasiRule: "next-day" });
    const traditionalRule = calculateSaju({ ...base, jasiRule: "traditional" });
    expect(nextDayRule.chart.day.hangul).not.toBe(traditionalRule.chart.day.hangul);
  });
});

describe("calculateSaju - 성별에 따른 대운 순행/역행", () => {
  it("같은 생년월일이라도 성별에 따라 대운 순행 방향이 다를 수 있다", () => {
    const male = calculateSaju({ calendar: "solar", year: 1990, month: 6, day: 15, hour: 10, gender: "male" });
    const female = calculateSaju({ calendar: "solar", year: 1990, month: 6, day: 15, hour: 10, gender: "female" });
    expect(male.daewoon!.isForward).not.toBe(female.daewoon!.isForward);
  });
});

describe("calculateSaju - 입력 검증", () => {
  it("범위를 벗어난 월은 에러를 던진다", () => {
    expect(() =>
      calculateSaju({ calendar: "solar", year: 2000, month: 13, day: 1, gender: "male" })
    ).toThrow(RangeError);
  });

  it("범위를 벗어난 시는 에러를 던진다", () => {
    expect(() =>
      calculateSaju({ calendar: "solar", year: 2000, month: 1, day: 1, hour: 25, gender: "male" })
    ).toThrow(RangeError);
  });
});

describe("computeOhaengDistribution", () => {
  it("존재하는 모든 오행 키를 포함한다", () => {
    const result = calculateSaju({ calendar: "solar", year: 2000, month: 1, day: 1, hour: 0, gender: "male" });
    const dist = computeOhaengDistribution(result.chart);
    expect(Object.keys(dist).sort()).toEqual(["금", "목", "수", "토", "화"].sort());
  });
});
