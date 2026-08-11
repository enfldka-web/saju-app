import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** 카카오 로그인 OAuth 콜백 — 코드를 세션으로 교환하고 프로필을 만든다. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/my";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id }, { onConflict: "id" });
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=1`);
}
