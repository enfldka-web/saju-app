/**
 * 干支(간지)/五行(오행) 한자 → 한글 표기 매핑.
 * lunar-javascript는 결과를 한자(예: "辛酉")로 반환하므로,
 * 한국 사용자에게 보여줄 한글 표기(예: "신유")로 변환하는 데 사용한다.
 */

export const GAN_HANJA_TO_HANGUL: Record<string, string> = {
  甲: "갑",
  乙: "을",
  丙: "병",
  丁: "정",
  戊: "무",
  己: "기",
  庚: "경",
  辛: "신",
  壬: "임",
  癸: "계",
};

export const ZHI_HANJA_TO_HANGUL: Record<string, string> = {
  子: "자",
  丑: "축",
  寅: "인",
  卯: "묘",
  辰: "진",
  巳: "사",
  午: "오",
  未: "미",
  申: "신",
  酉: "유",
  戌: "술",
  亥: "해",
};

export type Ohaeng = "목" | "화" | "토" | "금" | "수";

export const OHAENG_HANJA_TO_HANGUL: Record<string, Ohaeng> = {
  木: "목",
  火: "화",
  土: "토",
  金: "금",
  水: "수",
};

/** 오행별 브랜드 컬러 (톤다운된 버전, 원색 금지 — design 단계에서 최종 조정) */
export const OHAENG_COLOR: Record<Ohaeng, string> = {
  목: "#5B7A5B", // 톤다운 그린
  화: "#B4544A", // 톤다운 레드
  토: "#B08D57", // 황토
  금: "#C9C2B0", // 백금
  수: "#3F5872", // 남색
};

const ZHI_HIDE_GAN_HANJA: Record<string, string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

/** 지지(地支)의 지장간(숨은 천간) 한글 목록을 반환한다. */
export function getJijanggan(zhiHanja: string): string[] {
  const hidden = ZHI_HIDE_GAN_HANJA[zhiHanja] ?? [];
  return hidden.map((gan) => GAN_HANJA_TO_HANGUL[gan] ?? gan);
}

/** 干支 한자 2글자(예: "辛酉")를 한글(예: "신유")로 변환한다. */
export function ganjiToHangul(ganZhi: string): string {
  if (ganZhi.length !== 2) return ganZhi;
  const [gan, zhi] = ganZhi;
  const ganHangul = GAN_HANJA_TO_HANGUL[gan] ?? gan;
  const zhiHangul = ZHI_HANJA_TO_HANGUL[zhi] ?? zhi;
  return `${ganHangul}${zhiHangul}`;
}

/** 五行 한자 문자열(예: "金木")을 한글 오행 배열로 변환한다. */
export function wuxingToHangulList(wuxing: string): Ohaeng[] {
  return Array.from(wuxing).map((ch) => OHAENG_HANJA_TO_HANGUL[ch] ?? (ch as Ohaeng));
}
