import Link from "next/link";
import { KakaoLoginButton } from "@/components/auth/login-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col gap-2">
        <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 간편 로그인</span>
        <h1 className="font-display text-2xl font-bold text-paper-100">저장된 증서를 다시 보기</h1>
        <p className="text-sm text-paper-500">
          로그인하면 발급받은 사주 증서를 다시 조회할 수 있어요
        </p>
      </div>

      {error && <p className="text-xs text-ohaeng-hwa">로그인에 실패했어요. 다시 시도해주세요.</p>}

      <div className="w-full">
        <KakaoLoginButton next={next} />
      </div>

      <Link href="/" className="text-xs text-paper-500 underline underline-offset-4">
        로그인 없이 계속하기
      </Link>
    </main>
  );
}
