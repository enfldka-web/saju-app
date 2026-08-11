"use client";

import { useState } from "react";
import { IconShare } from "@/components/ui/icons";

export function ShareButton({ shareText, imageUrl }: { shareText: string; imageUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "간지 — 나의 사주 증서", text: shareText, url });
      } catch {
        // 사용자가 공유를 취소한 경우 — 무시
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(url, "_blank");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 py-2.5 text-sm font-medium text-paper-100 transition-colors hover:border-gold-500 hover:text-gold-500"
      >
        <IconShare className="h-4 w-4" />
        {copied ? "링크가 복사됐어요" : "증서 공유하기"}
      </button>
      <a
        href={imageUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border border-ink-600 px-3 py-2.5 text-xs text-paper-500 transition-colors hover:text-paper-100"
      >
        이미지 보기
      </a>
    </div>
  );
}
