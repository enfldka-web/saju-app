import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateSaju, sajuInputSchema } from "@/lib/saju";
import { generateInterpretation } from "@/lib/ai/interpret";

const requestSchema = z.object({
  token: z.string(),
  sajuInput: sajuInputSchema,
});

/**
 * 결제 없이 상세 리딩을 미리 볼 수 있는 테스트 전용 라우트.
 * DEBUG_UNLOCK_TOKEN 환경변수가 설정돼 있지 않으면 항상 비활성화된다
 * (즉, 이 변수를 등록하지 않는 한 배포 환경에서 이 라우트는 존재하지 않는 것과 같다).
 * 정식 오픈 전에는 이 라우트와 DEBUG_UNLOCK_TOKEN을 반드시 제거할 것.
 */
export async function POST(request: Request) {
  const debugToken = process.env.DEBUG_UNLOCK_TOKEN;
  if (!debugToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (parsed.data.token !== debugToken) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let sajuResult;
  try {
    sajuResult = calculateSaju(parsed.data.sajuInput);
  } catch (e) {
    const message = e instanceof Error ? e.message : "계산할 수 없는 날짜입니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const interpretation = await generateInterpretation(sajuResult);
    return NextResponse.json({ chart: sajuResult.chart, interpretation });
  } catch (e) {
    // 이 라우트는 이미 비밀 토큰으로 잠겨있으므로 진단을 위해 실제 에러를 그대로 노출한다.
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `AI 해석 생성에 실패했어요: ${message}` }, { status: 502 });
  }
}
