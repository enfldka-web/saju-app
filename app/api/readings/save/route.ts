import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateSaju, sajuInputSchema } from "@/lib/saju";
import { hashSajuInput } from "@/lib/saju/input-hash";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({ sajuInput: sajuInputSchema });

/** 로그인한 사용자가 결과 화면을 볼 때, 나중에 마이페이지에서 다시 볼 수 있도록 저장한다. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ saved: false, reason: "로그인 상태가 아니에요." });
  }

  const body = await request.json();
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  let result;
  try {
    result = calculateSaju(parsed.data.sajuInput);
  } catch (e) {
    const message = e instanceof Error ? e.message : "계산할 수 없는 날짜입니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const inputHash = hashSajuInput(parsed.data.sajuInput);

  const { error } = await supabase
    .from("readings")
    .upsert(
      {
        input_hash: inputHash,
        input: parsed.data.sajuInput,
        chart: result.chart,
        user_id: user.id,
      },
      { onConflict: "user_id,input_hash", ignoreDuplicates: false }
    );

  if (error) {
    return NextResponse.json({ saved: false, error: error.message });
  }

  return NextResponse.json({ saved: true });
}
