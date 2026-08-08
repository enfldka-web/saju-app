/**
 * lunar-javascript는 TypeScript 타입 정의를 제공하지 않으므로,
 * 이 프로젝트에서 실제로 사용하는 API 표면만 최소한으로 선언한다.
 */
declare module "lunar-javascript" {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getLunar(): Lunar;
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    toString(): string;
  }

  export class Lunar {
    /** month가 음수이면 윤달을 의미한다 (예: -2 = 윤2월) */
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Lunar;
    getSolar(): Solar;
    getEightChar(): EightChar;
    toString(): string;
  }

  export class DaYun {
    getIndex(): number;
    getStartAge(): number;
    getEndAge(): number;
    getStartYear(): number;
    getEndYear(): number;
    /** 대운 간지(한자). 첫 항목(0)은 첫 대운 이전 구간이라 빈 문자열일 수 있다 */
    getGanZhi(): string;
  }

  export class Yun {
    getStartYear(): number;
    getStartMonth(): number;
    getStartDay(): number;
    getStartHour(): number;
    isForward(): boolean;
    getDaYun(): DaYun[];
  }

  export class EightChar {
    setSect(sect: number): void;
    getYear(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getYearWuXing(): string;
    getMonth(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getMonthWuXing(): string;
    getDay(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getDayWuXing(): string;
    getTime(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getTimeWuXing(): string;
    /** gender: 1=남자, 0=여자 */
    getYun(gender: number, sect?: number): Yun;
  }
}
