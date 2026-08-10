export function daysInSolarMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatHourLabel(hour: number): string {
  const period = hour < 12 ? "오전" : "오후";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${period} ${twelveHour}시`;
}

export const CURRENT_YEAR = new Date().getFullYear();
export const MIN_BIRTH_YEAR = 1930;
