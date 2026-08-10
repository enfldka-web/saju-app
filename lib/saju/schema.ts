import { z } from "zod";

/** API 요청 바디로 들어오는 사주 입력값 검증 스키마 (SajuInput과 대응) */
export const sajuInputSchema = z.object({
  calendar: z.enum(["solar", "lunar"]),
  year: z.number().int(),
  month: z.number().int(),
  day: z.number().int(),
  isLeapMonth: z.boolean().optional(),
  hour: z.number().int().optional(),
  minute: z.number().int().optional(),
  gender: z.enum(["male", "female"]),
});
