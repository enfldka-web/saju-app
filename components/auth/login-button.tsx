"use client";

import { createClient } from "@/lib/supabase/client";

export function KakaoLoginButton({ next = "/my" }: { next?: string }) {
  async function handleLogin() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo,
        // 개인 개발자 카카오 앱은 비즈니스 인증 없이는 이메일 동의항목을 못 받는다.
        // 이메일 없이 닉네임/프로필 사진만 요청하도록 스코프를 명시적으로 좁힌다.
        scopes: "profile_nickname profile_image",
      },
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
