"use client";

import { useEffect, useState } from "react";
import type { SajuInput } from "@/lib/saju";

export function SaveReadingOnMount({ sajuInput }: { sajuInput: SajuInput }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/readings/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sajuInput }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.saved) setSaved(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!saved) return null;
  return <span className="text-[11px] text-gold-500">마이페이지에 저장됐어요</span>;
}
