import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/auth/logout-button";
import type { SajuInput } from "@/lib/saju";

function readingHref(input: SajuInput): string {
  const qs = new URLSearchParams({
    calendar: input.calendar,
    year: String(input.year),
    month: String(input.month),
    day: String(input.day),
    gender: input.gender,
  });
  if (input.isLeapMonth) qs.set("leap", "1");
  if (input.hour !== undefined) qs.set("hour", String(input.hour));
  return `/result?${qs.toString()}`;
}

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/my");
  }

  const { data: readings } = await supabase
    .from("readings")
    .select("id, input, interpretation, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-sm px-6 py-8 pb-16 lg:max-w-2xl lg:py-16">
      <header className="flex items-center justify-between pb-8">
        <div className="flex flex-col gap-2">
          <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 마이페이지</span>
          <h1 className="font-display text-2xl font-bold text-paper-100">내 사주 증서</h1>
        </div>
        <LogoutButton />
      </header>

      {!readings || readings.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink-700 bg-ink-900 px-6 py-12 text-center">
          <p className="text-sm text-paper-500">아직 저장된 증서가 없어요.</p>
          <Link href="/" className="text-sm font-medium text-gold-500">
            사주 증서 발급받으러 가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-ink-700 rounded-2xl border border-ink-700 bg-ink-900">
          {readings.map((reading) => {
            const input = reading.input as unknown as SajuInput;
            const unlocked = Boolean(reading.interpretation);
            return (
              <Link
                key={reading.id}
                href={readingHref(input)}
                className="flex items-center justify-between gap-3 px-4 py-4 transition-colors hover:bg-ink-800"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-paper-100">
                    {input.year}년 {input.month}월 {input.day}일 · {input.gender === "male" ? "남성" : "여성"}
                  </span>
                  <span className="text-xs text-paper-500">
                    {new Date(reading.created_at as string).toLocaleDateString("ko-KR")} 발급
                  </span>
                </div>
                <span className={`text-xs ${unlocked ? "text-gold-500" : "text-paper-500"}`}>
                  {unlocked ? "상세 리딩 완료" : "무료 미리보기"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
