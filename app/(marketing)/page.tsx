import { SajuInputForm } from "@/components/saju-form/saju-input-form";

export default function Home() {
  return (
    <main className="mx-auto flex h-dvh w-full max-w-sm flex-col px-6 py-8 md:h-auto md:min-h-dvh md:justify-center md:py-20">
      <header className="flex flex-col gap-3 pb-8">
        <span className="text-xs tracking-[0.2em] text-gold-500">干支</span>
        <h1 className="font-display text-3xl leading-[1.3] font-bold text-paper-100">
          태어난 순간의 우주,
          <br />
          간지로 읽습니다
        </h1>
        <p className="text-sm text-paper-500">
          정통 만세력 계산으로 뽑은 사주 원국을 무료로 확인하세요
        </p>
      </header>

      <div className="flex-1 md:flex-none">
        <SajuInputForm />
      </div>
    </main>
  );
}
