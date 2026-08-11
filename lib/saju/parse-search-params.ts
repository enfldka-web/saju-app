import type { CalendarType, Gender, SajuInput } from "./types";

export type ResultSearchParams = Record<string, string | string[] | undefined>;

/** /result, /api/share-card 등에서 공유하는 쿼리 파라미터 → SajuInput 파싱 로직 */
export function parseSajuSearchParams(params: ResultSearchParams): { input: SajuInput; previewToken?: string } | null {
  const get = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const calendar = get("calendar") === "lunar" ? "lunar" : "solar";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const gender: Gender = get("gender") === "male" ? "male" : "female";
  const leap = get("leap") === "1";
  const hourRaw = get("hour");
  const hour = hourRaw === undefined ? undefined : Number(hourRaw);
  const previewToken = get("preview");

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return {
    input: {
      calendar: calendar as CalendarType,
      year,
      month,
      day,
      isLeapMonth: leap,
      hour,
      minute: 0,
      gender,
    },
    previewToken,
  };
}
