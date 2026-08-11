import { SajuInputForm } from "@/components/saju-form/saju-input-form";

export default function Home() {
  return (
    <main className="flex w-full flex-col lg:min-h-dvh lg:flex-row">
      <section className="relative hidden overflow-hidden border-ink-700 px-16 py-20 lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:border-r">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-gold-600/20"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full border border-gold-600/25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-1/2 flex h-[190px] w-[190px] -translate-y-1/2 rotate-[-9deg] items-center justify-center rounded-full bg-seal/90 shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          <span className="font-display text-3xl font-bold text-parchment-100">干支</span>
        </div>

        <span className="text-sm tracking-[0.2em] text-gold-500">干支 · 증서 발급 신청</span>
        <h1 className="mt-4 max-w-md font-display text-5xl leading-[1.25] font-bold text-paper-100">
          나만의 사주 증서,
          <br />
          지금 발급합니다
        </h1>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-paper-500">
          정통 만세력 계산으로 작성된 사주 원국 증서를 무료로 확인하세요. 결제 없이 오행 분포와 올해 총운까지 바로 볼 수 있어요.
        </p>
      </section>

      <section className="mx-auto flex h-dvh w-full max-w-sm flex-col px-6 py-8 md:h-auto md:min-h-dvh md:justify-center md:py-20 lg:w-1/2 lg:max-w-lg lg:justify-center lg:px-16 lg:py-20">
        <header className="flex flex-col gap-3 pb-8 lg:hidden">
          <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 증서 발급 신청</span>
          <h1 className="font-display text-3xl leading-[1.3] font-bold text-paper-100">
            나만의 사주 증서,
            <br />
            지금 발급합니다
          </h1>
          <p className="text-sm text-paper-500">
            정통 만세력 계산으로 작성된 사주 원국 증서를 무료로 확인하세요
          </p>
        </header>

        <div className="flex-1 md:flex-none">
          <SajuInputForm />
        </div>
      </section>
    </main>
  );
}
