# saju-app

한국형 사주 리딩 웹앱 (가제). 정확한 만세력 계산 + AI 해석 + 결제까지 이어지는 유료 사주 서비스.

## 스택

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (Auth/Postgres/Storage)
- 토스페이먼츠 (결제)
- [lunar-javascript](https://github.com/6tail/lunar-javascript) (만세력 계산 — 계산 엔진은 이 라이브러리에 위임하고, 이 저장소는 결과 가공/해석/UI만 담당)
- Anthropic API (`claude-sonnet-5`, AI 해석 생성)

## 아키텍처 원칙

- **계산과 해석 분리**: `lib/saju/*`는 순수 함수로만 구성된 결정론적 계산 엔진(같은 입력=같은 출력). AI는 이 계산 결과를 해석하는 역할만 하고, 사주 계산 자체를 하지 않는다.
- 계산 엔진 검증 기록은 [`docs/SAJU_VALIDATION.md`](./docs/SAJU_VALIDATION.md) 참고.

## 개발

```bash
npm run dev        # 개발 서버
npm test           # 계산 엔진 단위 테스트 (vitest)
npm run lint        # eslint
```

## 폴더 구조

```
app/            # Next.js App Router (라우트 + API)
lib/saju/       # 사주 계산 엔진 (순수 함수, 단위 테스트 포함)
lib/ai/         # AI 해석 프롬프트/생성 (계산 엔진과 분리)
lib/payments/   # 토스페이먼츠 연동
lib/supabase/   # Supabase 클라이언트/타입
components/     # UI 컴포넌트
supabase/       # DB 마이그레이션
docs/           # 검증 기록 등 프로젝트 문서
```
