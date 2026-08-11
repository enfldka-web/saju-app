"use client";

import { createClient } from "@/lib/supabase/client";

export function KakaoLoginButton({ next = "/my" }: { next?: string }) {
  async function handleLogin() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo },
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="w-full rounded-xl bg-[#FEE500] py-3.5 text-sm font-semibold text-[#191600] transition-opacity hover:opacity-90"
    >
      카카오로 3초 만에 시작하기
    </button>
  );
}
