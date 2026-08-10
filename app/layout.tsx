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

export const metadata: Metadata = {
  title: "간지 — 정통 만세력으로 보는 사주",
  description: "정확한 만세력 계산과 AI 해석으로 보는 나의 사주팔자.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${notoSerifKr.variable} ${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center bg-ink-950 text-paper-100">
        {/*
          THESIS: 사주 결과는 신비로운 "점괘"가 아니라 근거 있는 데이터다 — 만세력 표(表)의
          질서를 하이라이트하고, 흔한 보라색 타로 그라데이션·이모지 신비주의를 거부한다.
          OWN-WORLD: 먹색(ink) 배경 + 한지(paper) 전경 + 앤틱 골드 포인트. 헤드라인은
          Noto Serif KR(먹글씨 세리프), 본문/UI는 Pretendard. 오행 5색은 톤다운된
          자연색(소나무/아궁이불/황토/백동/야간남색)으로만 사용, 원색 금지.
          STORY: 입력 즉시 "정통 만세력으로 계산 중"이라는 신뢰를 주고, 사주 원국을
          표(表)처럼 보여준 뒤, 잠긴 카테고리로 호기심을 남긴다.
          FIRST VIEWPORT: 모바일 원스크린 입력 폼 — 상단에 짧은 헤드라인, 중앙에
          양력/음력·생년월일·시간·성별 입력, 하단에 고정된 골드 CTA.
          FORM: 브리프 고정(다크모드+골드+먹색+세리프헤드라인+오행톤다운) — 이 세션은
          카탈로그 컨셉 시드 단계를 생략하고 고정 브리프를 그대로 커밋함(사용자에게 고지).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, and DESIGN.md.
        */}
        {children}
      </body>
    </html>
  );
}
