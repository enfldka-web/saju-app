-- Phase 1 스키마: readings(계산+해석 캐시), payments(결제 로그), users는 Supabase Auth 내장 테이블(auth.users) 활용

create extension if not exists "pgcrypto";

-- 회원 프로필 (auth.users 1:1 확장, 간편 로그인용 최소 정보만 저장)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "본인 프로필만 조회" on public.profiles
  for select using (auth.uid() = id);

create policy "본인 프로필만 수정" on public.profiles
  for update using (auth.uid() = id);

-- 사주 리딩 캐시: 동일 생년월일시+성별 조합은 재계산하지 않고 재사용
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  -- 입력값을 정규화해 해시로 캐시 키 생성 (예: sha256(JSON.stringify(normalizedInput)))
  input_hash text not null unique,
  input jsonb not null,
  -- 계산 엔진 결과 (SajuResult) — 결정론적이므로 그대로 캐싱
  chart jsonb not null,
  -- AI가 생성한 카테고리별 해석 (커리어/재물/연애/건강 + 한줄총평). 결제 전에는 비어있을 수 있음
  interpretation jsonb,
  -- 이 reading을 처음 만든 사용자 (비회원이면 null)
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists readings_user_id_idx on public.readings(user_id);

alter table public.readings enable row level security;

-- 무료 원국/오행까지는 누구나 조회 가능 (결과 페이지 공유 링크 대응)
create policy "누구나 조회 가능" on public.readings
  for select using (true);

create policy "인증 없이도 생성 가능" on public.readings
  for insert with check (true);

-- 결제 로그: 사업자 정산용, 누가/언제/무엇을/얼마에
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid references public.readings(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  -- 비회원 결제 대응: 재조회용 연락처(전화번호) 별도 저장 가능
  guest_phone text,
  product_type text not null check (product_type in ('single_reading', 'monthly_subscription')),
  amount integer not null,
  currency text not null default 'KRW',
  status text not null check (status in ('pending', 'succeeded', 'failed', 'canceled')),
  -- 토스페이먼츠 식별자
  toss_payment_key text,
  toss_order_id text not null unique,
  raw_response jsonb,
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_reading_id_idx on public.payments(reading_id);

alter table public.payments enable row level security;

create policy "본인 결제 내역만 조회" on public.payments
  for select using (auth.uid() = user_id);
