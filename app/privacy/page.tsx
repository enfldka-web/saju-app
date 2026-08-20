import Link from "next/link";

export const metadata = {
  title: "개인정보처리방침 — 간지",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12 pb-20 lg:py-16">
      <header className="flex flex-col gap-2 pb-8">
        <span className="text-xs tracking-[0.2em] text-gold-500">干支 · 개인정보처리방침</span>
        <h1 className="font-display text-2xl font-bold text-paper-100">개인정보처리방침</h1>
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

        <Section title="1. 수집하는 개인정보 항목">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>사주 계산을 위한 입력 정보: 생년월일, 출생 시간(선택), 성별</li>
            <li>카카오 로그인 이용 시: 닉네임, 프로필 이미지, 카카오 계정 이메일</li>
            <li>결제 시: 주문번호, 결제 승인번호, 결제 금액 — 카드번호 등 민감한 결제 정보는 토스페이먼츠가 직접 처리하며 당사는 저장하지 않습니다</li>
            <li>자동 수집 정보: 접속 로그, 로그인 세션 쿠키, 기기·브라우저 정보</li>
          </ul>
        </Section>

        <Section title="2. 개인정보의 수집 및 이용 목적">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>사주 계산 결과 및 AI 해석 콘텐츠 제공</li>
            <li>결제 처리, 결제 내역 관리 및 사업자 정산</li>
            <li>카카오 로그인을 통한 회원 인증 및 재조회(마이페이지) 서비스 제공</li>
            <li>부정 이용 방지 및 서비스 품질 개선</li>
          </ul>
        </Section>

        <Section title="3. 개인정보의 보유 및 이용 기간">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>회원 정보: 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 지체 없이 파기합니다</li>
            <li>대금결제 및 재화 공급에 관한 기록: 5년 (전자상거래법)</li>
            <li>계약 또는 청약철회에 관한 기록: 5년 (전자상거래법)</li>
            <li>소비자 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
          </ul>
        </Section>

        <Section title="4. 개인정보의 제3자 제공 및 처리위탁">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>카카오(주) — 소셜 로그인 인증</li>
            <li>Supabase, Inc. — 회원 인증 및 데이터베이스 호스팅</li>
            <li>토스페이먼츠(주) — 결제 처리</li>
            <li>Anthropic PBC — 계산된 사주 원국 데이터를 바탕으로 한 AI 해석 텍스트 생성(생년월일시 원본이 아닌 계산 결과를 전달)</li>
          </ul>
        </Section>

        <Section title="5. 이용자의 권리">
          <p>
            이용자는 언제든지 자신의 개인정보 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래 연락처로 요청해주시면 지체 없이
            조치합니다.
          </p>
        </Section>

        <Section title="6. 만 14세 미만 아동 및 미성년자 보호">
          <p>
            본 서비스는 만 14세 미만 아동의 회원가입 및 결제를 받지 않습니다. 만 19세 미만 미성년자가 법정대리인의 동의 없이 결제한 경우,
            본인 또는 법정대리인은 결제를 취소할 수 있습니다.
          </p>
        </Section>

        <Section title="7. AI 생성 콘텐츠에 관한 고지">
          <p>
            사주 원국(사주팔자, 오행 분포)은 검증된 결정론적 만세력 계산 엔진으로 산출됩니다. 카테고리별 상세 해석 텍스트는 Anthropic의
            AI 모델이 계산 결과를 바탕으로 생성하며, 참고용 콘텐츠로 법률·의료·재무에 관한 전문적인 자문을 대체하지 않습니다.
          </p>
        </Section>

        <Section title="8. 개인정보 보호책임자">
          <p>
            이메일: <a href="mailto:enfldka@gmail.com" className="text-gold-500 underline underline-offset-4">enfldka@gmail.com</a>
          </p>
        </Section>

        <Section title="9. 개인정보처리방침의 변경">
          <p>본 방침이 변경되는 경우 서비스 내 공지를 통해 사전에 고지합니다.</p>
        </Section>
      </div>

      <Link href="/" className="mt-10 inline-block text-xs text-paper-500 underline underline-offset-4">
        홈으로 돌아가기
      </Link>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2 border-t border-ink-700 pt-6">
      <h2 className="font-display text-base font-bold text-paper-100">{title}</h2>
      {children}
    </section>
  );
}
