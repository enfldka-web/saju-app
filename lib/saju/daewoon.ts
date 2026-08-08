import type { EightChar } from "lunar-javascript";
import { ganjiToHangul, wuxingToHangulList, GAN_HANJA_TO_HANGUL, ZHI_HANJA_TO_HANGUL } from "./ganji-maps";
import type { Ohaeng } from "./ganji-maps";
import type { DaewoonInfo, DaewoonEntry, Gender } from "./types";

const WU_XING_GAN_HANJA: Record<string, string> = {
  甲: "木", 乙: "木",
  丙: "火", 丁: "火",
  戊: "土", 己: "土",
  庚: "金", 辛: "金",
  壬: "水", 癸: "水",
};

const WU_XING_ZHI_HANJA: Record<string, string> = {
  寅: "木", 卯: "木",
  巳: "火", 午: "火",
  辰: "土", 戌: "土", 丑: "土", 未: "土",
  申: "金", 酉: "金",
  子: "水", 亥: "水",
};

function ganZhiOhaeng(ganZhiHanja: string): [Ohaeng, Ohaeng] {
  const [gan, zhi] = ganZhiHanja;
  const wuxing = `${WU_XING_GAN_HANJA[gan] ?? ""}${WU_XING_ZHI_HANJA[zhi] ?? ""}`;
  return wuxingToHangulList(wuxing) as [Ohaeng, Ohaeng];
}

/**
 * 대운(大運) 리스트를 계산한다.
 * index 0은 라이브러리 내부적으로 "첫 대운 시작 전" 구간(간지 없음)이라 목록에서 제외한다.
 */
export function computeDaewoon(eightChar: EightChar, gender: Gender, sect: number): DaewoonInfo {
  const genderNum = gender === "male" ? 1 : 0;
  const yun = eightChar.getYun(genderNum, sect);
  const rawList = yun.getDaYun().filter((d) => d.getGanZhi().length === 2);

  const list: DaewoonEntry[] = rawList.map((d, index) => {
    const ganZhiHanja = d.getGanZhi();
    return {
      index,
      startAge: d.getStartAge(),
      endAge: d.getEndAge(),
      startYear: d.getStartYear(),
      endYear: d.getEndYear(),
      ganZhi: { hanja: ganZhiHanja, hangul: ganjiToHangul(ganZhiHanja) },
      ohaeng: ganZhiOhaeng(ganZhiHanja),
    };
  });

  return {
    startAge: list[0]?.startAge ?? 0,
    isForward: yun.isForward(),
    list,
  };
}

// 참고용으로 매핑 테이블도 export (테스트/검증에서 재사용)
export { GAN_HANJA_TO_HANGUL, ZHI_HANJA_TO_HANGUL };
