-- readings.input_hash는 원래 전역 유니크였는데, 이러면 서로 다른 사용자가 같은
-- 생년월일시 조합을 조회할 때 마이페이지 소유권이 충돌한다. 사용자별로 유니크하게 바꾼다.
-- (전역 AI/계산 캐싱은 이번 스프린트 범위 밖 — 별도로 재검토)

alter table public.readings drop constraint if exists readings_input_hash_key;

-- user_id가 null인 행끼리는 SQL 표준상 서로 unique 충돌을 일으키지 않으므로
-- 별도 partial index 없이 그냥 복합 unique 제약으로 충분하다.
alter table public.readings add constraint readings_user_input_hash_key unique (user_id, input_hash);

drop policy if exists "본인 리딩만 수정" on public.readings;
create policy "본인 리딩만 수정" on public.readings
  for update using (auth.uid() = user_id);
