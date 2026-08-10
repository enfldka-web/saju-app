import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateSaju } from "@/lib/saju";
import { generateInterpretation } from "@/lib/ai/interpret";

const requestSchema = z.object({
  calendar: z.enum(["solar", "lunar"]),
  year: z.number().int(),
  month: z.number().int(),
  day: z.number().int(),
  isLeapMonth: z.boolean().optional(),
  hour: z.number().int().optional(),
  minute: z.number().int().optional(),
  gender: z.enum(["male", "female"]),
});

/**
 * 결제 완료 후에만 호출되어야 하는 유료 해석 API.
 * 결제 검증(task #8)이 붙기 전까지는 인증되지 않은 호출로부터 보호되지 않으므로,
 * 이 라우트를 UI에 연결하는 것은 결제 플로우와 함께 진행한다.
 */
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다.", details: parsed.error.flatten() }, { status: 400 });
  }

  let result;
  try {
    result = calculateSaju(parsed.data);
  } catch (e) {
    const message = e instanceof Error ? e.message : "계산할 수 없는 날짜입니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const interpretation = await generateInterpretation(result);
    return NextResponse.json({ chart: result.chart, interpretation });
  } catch {
    return NextResponse.json({ error: "AI 해석 생성에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 502 });
  }
}
