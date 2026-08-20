import Link from "next/link";

export const metadata = {
  title: "이용약관 — 간지",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 pb-20 lg:py-16">
      <header className="flex flex-col gap-2 pb-8">
        <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 이용약관</span>
        <h1 className="font-display text-2xl font-bold text-paper-100">이용약관</h1>
        <p className="text-xs text-paper-500">시행일 2026년 8월 18일</p>
      </header>

      <div className="flex flex-col gap-8 text-sm leading-relaxed text-paper-300">
        <section className="rounded-2xl border border-ink-700 bg-ink-900 p-5 text-xs leading-relaxed text-paper-500">
          <p className="mb-2 font-semibold text-paper-300">사업자 정보</p>
          <ul className="flex flex-col gap-1">
            <li>상호: 마메드네</li>
            <li>대표자: 김진석</li>
            <li>사업장 소재지: 서울특별시 노원구 동일로215길 48</li>
            <li>사업자등록번호: 809-11-03069</li>
            <li>통신판매업 신고번호: 확인 중 — 확인되는 대로 갱신합니다</li>
          </ul>
        </section>

        <Article title="제1조 (목적)">
          <p>
            이 약관은 마메드네(이하 &ldquo;회사&rdquo;)가 제공하는 &ldquo;간지&rdquo; 사주 계산 및 AI 해석 서비스(이하 &ldquo;서비스&rdquo;)의 이용조건 및
            절차, 이용자와 회사의 권리·의무·책임사항을 정함을 목적으로 합니다.
          </p>
        </Article>

        <Article title="제2조 (서비스의 내용)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>무료 미리보기: 사주 원국(사주팔자), 오행 분포, 올해 총운 요약</li>
            <li>유료 상세 리딩: 커리어·재물·연애·건강 4개 카테고리의 AI 해석 및 월별 운세 (1회 19,900원, 단건 결제)</li>
            <li>회사는 월간 구독 등 정기결제 상품을 운영하지 않습니다.</li>
          </ul>
        </Article>

        <Article title="제3조 (회원가입 및 비회원 이용)">
          <p>
            카카오 계정으로 간편 로그인 시 결과 재조회(마이페이지) 기능을 이용할 수 있습니다. 로그인 없이도 유료 리딩 결제 및 이용이
            가능합니다.
          </p>
        </Article>

        <Article title="제4조 (결제)">
          <p>
            유료 리딩의 가격은 결제 화면에 표시된 금액(부가가치세 포함)을 따르며, 결제는 토스페이먼츠가 제공하는 신용·체크카드 등의
            수단으로 진행됩니다.
          </p>
        </Article>

        <Article title="제5조 (청약철회 및 환불)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              본 서비스는 결제 승인과 동시에 AI 해석 콘텐츠 제공이 즉시 개시됩니다. 「전자상거래 등에서의 소비자보호에 관한 법률」
              제17조에 따라, 이용자가 콘텐츠 제공 개시에 명시적으로 동의한 경우 제공이 개시된 부분에 대해서는 청약철회가 제한됩니다.
            </li>
            <li>결제 오류, 중복 결제 등 회사의 귀책사유로 콘텐츠가 정상 제공되지 않은 경우 전액 환불합니다.</li>
            <li>환불 문의는 제9조의 연락처로 접수합니다.</li>
          </ul>
        </Article>

        <Article title="제6조 (미성년자 결제)">
          <p>
            만 19세 미만 미성년자는 법정대리인의 동의를 받아 서비스를 이용해야 합니다. 법정대리인의 동의 없이 이루어진 결제는 본인 또는
            법정대리인이 취소할 수 있습니다.
          </p>
        </Article>

        <Article title="제7조 (콘텐츠의 성격 및 면책)">
          <p>
            본 서비스가 제공하는 사주·운세 콘텐츠는 오락 및 참고 목적으로 제공되며, 법률·의료·재무·투자에 관한 전문적인 자문을 대체하지
            않습니다. 회사는 콘텐츠에 따른 특정 결과나 사건의 발생을 보장하지 않으며, 이를 근거로 한 이용자의 의사결정에 대해 책임을 지지
            않습니다. 사주 원국(계산 결과)은 결정론적 만세력 엔진으로 산출되며, 카테고리별 해석 텍스트는 AI가 생성합니다.
          </p>
        </Article>

        <Article title="제8조 (금지행위)">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>타인의 개인정보를 무단으로 이용해 서비스에 입력하는 행위</li>
            <li>서비스 결과물을 상업적으로 재판매하거나 회사의 사전 동의 없이 대량 복제·배포하는 행위</li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
          </ul>
        </Article>

        <Article title="제9조 (문의)">
          <p>
            이메일: <a href="mailto:enfldka@gmail.com" className="text-gold-500 underline underline-offset-4">enfldka@gmail.com</a>
          </p>
        </Article>

        <Article title="제10조 (약관의 변경)">
          <p>회사는 관련 법령에 따라 약관을 개정할 수 있으며, 개정 시 서비스 내 공지를 통해 사전에 고지합니다.</p>
        </Article>
      </div>

      <Link href="/" className="mt-10 inline-block text-xs text-paper-500 underline underline-offset-4">
        홈으로 돌아가기
      </Link>
    </main>
  );
}

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-ink-700 pt-6">
      <h2 className="font-display text-base font-bold text-paper-100">{title}</h2>
      {children}
    </section>
  );
}
