import "server-only";
import { createHash } from "node:crypto";
import type { SajuInput } from "./types";

/** 동일 생년월일시+성별 조합을 식별하는 결정론적 해시 (readings 캐시 키) */
export function hashSajuInput(input: SajuInput): string {
  const normalized = {
    calendar: input.calendar,
    year: input.year,
    month: input.month,
    day: input.day,
    isLeapMonth: Boolean(input.isLeapMonth),
    hour: input.hour ?? null,
    minute: input.minute ?? 0,
    gender: input.gender,
  };
  return createHash("sha256").update(JSON.stringify(normalized)).digest("hex");
}
