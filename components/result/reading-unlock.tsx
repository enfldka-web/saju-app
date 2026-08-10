"use client";

import { useState } from "react";
import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import type { SajuInput } from "@/lib/saju";
import type { SajuInterpretation } from "@/lib/ai/types";
import { IconLock } from "@/components/ui/icons";
import { CATEGORY_META } from "./category-meta";

const PRICE_KRW = 9900;
const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;

type Status = "locked" | "processing" | "unlocked" | "error";

interface TossErrorLike {
  code?: string;
  message?: string;
}

/**
 * SDK 타입 선언상 successUrl/failUrl이 optional이라 리다이렉트 오버로드(Promise<void>)와
 * 겹쳐 보이지만, 공식 예제대로 successUrl/failUrl을 생략하면 실제로는 Promise 방식으로
 * 동작해 RequestPaymentResult로 resolve된다. 패키지가 이 타입을 export하지 않아 직접 선언한다.
 */
interface RequestPaymentResult {
  paymentKey: string;
  orderId: string;
  amount: { value: number; currency: string };
}

function isUserCancel(error: unknown): boolean {
  const e = error as TossErrorLike;
  return e?.code === "USER_CANCEL" || (typeof e?.message === "string" && e.message.includes("취소"));
}

export function ReadingUnlock({ sajuInput, previewToken }: { sajuInput: SajuInput; previewToken?: string }) {
  const [status, setStatus] = useState<Status>("locked");
  const [interpretation, setInterpretation] = useState<SajuInterpretation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handlePreviewUnlock() {
    setStatus("processing");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/payments/debug-unlock", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: previewToken, sajuInput }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "미리보기 생성에 실패했어요.");
      }
      setInterpretation(data.interpretation);
      setStatus("unlocked");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "미리보기 중 문제가 발생했어요.");
      setStatus("error");
    }
  }

  async function handleUnlock() {
    setStatus("processing");
    setErrorMessage(null);

    try {
      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: ANONYMOUS });

      const orderId = crypto.randomUUID();
      const paymentResult = (await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: PRICE_KRW },
        orderId,
        orderName: "사주 상세 리딩",
        windowTarget: "iframe",
      })) as unknown as RequestPaymentResult;

      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paymentKey: paymentResult.paymentKey,
          orderId: paymentResult.orderId,
          amount: paymentResult.amount.value,
          sajuInput,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "결제 확인에 실패했어요.");
      }

      setInterpretation(data.interpretation);
      setStatus("unlocked");
    } catch (error) {
      if (isUserCancel(error)) {
        setStatus("locked");
        return;
      }
      setErrorMessage(error instanceof Error ? error.message : "결제 중 문제가 발생했어요.");
      setStatus("error");
    }
  }

  if (status === "unlocked" && interpretation) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-paper-100">상세 리딩</h2>
        <div className="flex flex-col divide-y divide-ink-700 rounded-2xl border border-ink-700 bg-ink-900">
          {CATEGORY_META.map(({ key, label }) => {
            const content = interpretation[key as keyof SajuInterpretation];
            return (
              <div key={key} className="flex flex-col gap-1.5 px-4 py-4">
                <span className="text-xs text-gold-500">{label}</span>
                <span className="text-sm font-medium text-paper-100">{content.headline}</span>
                <p className="text-sm leading-relaxed text-paper-500">{content.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-lg font-bold text-paper-100">상세 리딩</h2>
        <span className="text-[11px] text-gold-500">가장 중요한 포인트 1가지는 잠겨있어요</span>
      </div>

      <div className="flex flex-col divide-y divide-ink-700 rounded-2xl border border-ink-700 bg-ink-900">
        {CATEGORY_META.map(({ key, label, teaser }) => (
          <div key={key} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-paper-100">{label}</span>
              <span className="text-xs text-paper-500 blur-[3px] select-none">{teaser}</span>
            </div>
            <IconLock className="h-4 w-4 shrink-0 text-paper-500" />
          </div>
        ))}
      </div>

      {errorMessage && <p className="text-center text-xs text-ohaeng-hwa">{errorMessage}</p>}

      <button
        type="button"
        onClick={handleUnlock}
        disabled={status === "processing"}
        className="w-full rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-70"
      >
        {status === "processing" ? "결제 확인 중..." : `상세 리딩 잠금 해제 · ${PRICE_KRW.toLocaleString()}원`}
      </button>

      {previewToken && (
        <button
          type="button"
          onClick={handlePreviewUnlock}
          disabled={status === "processing"}
          className="w-full rounded-xl border border-ink-600 py-3 text-xs text-paper-500 transition-colors hover:text-paper-100 disabled:opacity-70"
        >
          미리보기 열기 (테스트 전용, 결제 없음)
        </button>
      )}
    </div>
  );
}
