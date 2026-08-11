import type { Metadata } from "next";
import { Noto_Serif_KR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});

const pretendard = localFont({
  variable: "--font-pretendard",
  src: "./fonts/PretendardVariable.woff2",
  weight: "45 920",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "간지 — 나의 사주 증서",
  description: "정확한 만세력 계산과 AI 해석으로 발급하는 나만의 사주 증서.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center bg-ink-950 text-paper-100">
        {/*
          THESIS: 사주는 "점괘"가 아니라 나에게 발급된 공식 증서다 — 사주 원국을 실제
          증서/문서처럼 제시해 신뢰감을 주고, 흔한 보라색 타로 그라데이션·이모지
          신비주의를 거부한다.
          OWN-WORLD: 마호가니 원장(元帳) 배경 + 양피지 증서 카드 + 주홍 인장(印章).
          헤드라인은 Noto Serif KR, 본문/UI는 Pretendard. 인장의 주홍색은 도장 그래픽
          한 곳에만 쓰고 나머지는 놋쇠(brass) 포인트로 절제. 오행 5색은 톤다운된
          자연색만 사용, 원색 금지.
          STORY: 입력 즉시 "정통 만세력으로 증서를 발급하는 중"이라는 신뢰를 주고,
          사주 원국을 실제 증서 카드로 제시한 뒤, 인장이 찍힌 잠긴 항목으로 호기심을 남긴다.
          FIRST VIEWPORT: 모바일 원스크린 입력 폼 — 증서 발급 신청서를 작성하는 톤.
          FORM: 사용자가 3개 컨셉(천문도/인장증서/달항아리) 중 인장·증서형을 직접 선택
          — 이 세션은 카탈로그 컨셉 시드 단계 대신 실제 스크린샷 3종 비교로 방향을 확정함.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
