"use client";

import { useState } from "react";
import { IconLock } from "@/components/ui/icons";

const CATEGORIES = [
  { key: "career", label: "커리어", teaser: "지금 흐름이 이직에 유리한 시기인지" },
  { key: "wealth", label: "재물", teaser: "돈이 들어오고 나가는 패턴의 열쇠" },
  { key: "love", label: "연애 · 인간관계", teaser: "올해 인연의 방향을 가르는 한 글자" },
  { key: "health", label: "건강", teaser: "체질상 가장 신경 써야 할 부분" },
] as const;

export function LockedCategories() {
  const [checkoutState, setCheckoutState] = useState<"idle" | "soon">("idle");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold text-paper-100">상세 리딩</h2>
        <span className="text-[11px] text-gold-500">가장 중요한 포인트 1가지는 잠겨있어요</span>
      </div>

      <div className="flex flex-col divide-y divide-ink-700 rounded-2xl border border-ink-700 bg-ink-900">
        {CATEGORIES.map((category) => (
          <div key={category.key} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-paper-100">{category.label}</span>
              <span className="text-xs text-paper-500 blur-[3px] select-none">{category.teaser}</span>
            </div>
            <IconLock className="h-4 w-4 shrink-0 text-paper-500" />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCheckoutState("soon")}
        disabled={checkoutState === "soon"}
        className="w-full rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-70"
      >
        {checkoutState === "idle" ? "상세 리딩 잠금 해제 · 9,900원" : "결제 연동 준비 중이에요, 곧 만나요"}
      </button>
    </div>
  );
}
