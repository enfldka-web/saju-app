import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateSaju, sajuInputSchema } from "@/lib/saju";
import { hashSajuInput } from "@/lib/saju/input-hash";
import { generateInterpretation } from "@/lib/ai/interpret";
import type { SajuInterpretation } from "@/lib/ai/types";
import { confirmTossPayment, TossConfirmError, SINGLE_READING_PRICE_KRW } from "@/lib/payments/toss";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import type { SajuResult } from "@/lib/saju";

const requestSchema = z.object({
  paymentKey: z.string().min(1),
  orderId: z.string().min(1),
  amount: z.number().int(),
  sajuInput: sajuInputSchema,
});

async function logPayment(params: {
  orderId: string;
  paymentKey: string | null;
  amount: number;
  status: "succeeded" | "failed";
  rawResponse?: unknown;
}) {
  try {
    const supabase = createAdminClient();
    await supabase.from("payments").insert({
      toss_order_id: params.orderId,
      toss_payment_key: params.paymentKey,
      amount: params.amount,
      product_type: "single_reading",
      status: params.status,
      raw_response: params.rawResponse ?? null,
    });
  } catch (e) {
    // Supabase 미연결 등으로 로깅이 실패해도 결제/해석 응답 자체는 막지 않는다.
    console.error("결제 로그 저장 실패:", e);
  }
}

/** 로그인한 사용자가 결제한 경우, 마이페이지에서 상세 리딩까지 다시 볼 수 있도록 저장한다. */
async function saveUnlockedReading(sajuInput: z.infer<typeof sajuInputSchema>, sajuResult: SajuResult, interpretation: SajuInterpretation) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("readings").upsert(
      {
        input_hash: hashSajuInput(sajuInput),
        input: sajuInput,
        chart: sajuResult.chart,
        interpretation,
        user_id: user.id,
      },
      { onConflict: "user_id,input_hash" }
    );
  } catch (e) {
    console.error("리딩 저장 실패:", e);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { paymentKey, orderId, amount, sajuInput } = parsed.data;

  if (amount !== SINGLE_READING_PRICE_KRW) {
    return NextResponse.json({ error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
  }

  let sajuResult;
  try {
    sajuResult = calculateSaju(sajuInput);
  } catch (e) {
    const message = e instanceof Error ? e.message : "계산할 수 없는 날짜입니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let confirmed;
  try {
    confirmed = await confirmTossPayment({ paymentKey, orderId, amount });
  } catch (e) {
    const message = e instanceof TossConfirmError ? e.message : "결제 승인에 실패했습니다.";
    await logPayment({ orderId, paymentKey, amount, status: "failed" });
    return NextResponse.json({ error: message }, { status: 402 });
  }

  await logPayment({ orderId, paymentKey, amount, status: "succeeded", rawResponse: confirmed });

  try {
    const interpretation = await generateInterpretation(sajuResult);
    await saveUnlockedReading(sajuInput, sajuResult, interpretation);
    return NextResponse.json({ chart: sajuResult.chart, interpretation });
  } catch {
    return NextResponse.json(
      { error: "결제는 완료됐지만 해석 생성에 실패했어요. 잠시 후 다시 시도해주시거나 문의해주세요." },
      { status: 500 }
    );
  }
}
