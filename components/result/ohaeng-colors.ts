import type { Ohaeng } from "@/lib/saju";

/** app/globals.css의 --ohaeng-* 커스텀 프로퍼티 이름 매핑 (인라인 style에서 var()로 참조) */
export const OHAENG_COLOR_VAR: Record<Ohaeng, string> = {
  목: "--ohaeng-mok",
  화: "--ohaeng-hwa",
  토: "--ohaeng-to",
  금: "--ohaeng-geum",
  수: "--ohaeng-su",
};

export const OHAENG_LABEL_HANJA: Record<Ohaeng, string> = {
  목: "木",
  화: "火",
  토: "土",
  금: "金",
  수: "水",
};
