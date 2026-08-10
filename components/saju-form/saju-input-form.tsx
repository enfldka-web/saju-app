"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calculateSaju } from "@/lib/saju";
import type { CalendarType, Gender } from "@/lib/saju";
import { Segmented } from "@/components/ui/segmented";
import { SelectField } from "@/components/ui/select-field";
import { IconArrowRight } from "@/components/ui/icons";
import { CURRENT_YEAR, MIN_BIRTH_YEAR, daysInSolarMonth, formatHourLabel } from "./date-utils";

const YEARS = Array.from({ length: CURRENT_YEAR - MIN_BIRTH_YEAR + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function SajuInputForm() {
  const router = useRouter();
  const [calendar, setCalendar] = useState<CalendarType>("solar");
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [year, setYear] = useState(1995);
  const [month, setMonth] = useState(6);
  const [day, setDay] = useState(15);
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [hour, setHour] = useState(12);
  const [gender, setGender] = useState<Gender>("female");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dayOptions = useMemo(() => {
    const max = calendar === "solar" ? daysInSolarMonth(year, month) : 30;
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [calendar, year, month]);

  function handleCalendarChange(next: CalendarType) {
    setCalendar(next);
    if (next === "solar") setIsLeapMonth(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const input = {
      calendar,
      year,
      month,
      day,
      isLeapMonth: calendar === "lunar" ? isLeapMonth : undefined,
      hour: timeUnknown ? undefined : hour,
      minute: 0,
      gender,
    };

    try {
      calculateSaju(input);
    } catch {
      setError(
        calendar === "lunar"
          ? "해당 음력 날짜가 존재하지 않아요. 윤달 여부를 다시 확인해주세요."
          : "입력하신 날짜를 다시 확인해주세요."
      );
      return;
    }

    setSubmitting(true);
    const params = new URLSearchParams({
      calendar,
      year: String(year),
      month: String(month),
      day: String(day),
      gender,
    });
    if (calendar === "lunar" && isLeapMonth) params.set("leap", "1");
    if (!timeUnknown) params.set("hour", String(hour));
    router.push(`/result?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between gap-6 md:h-auto md:gap-10">
      <div className="flex flex-col gap-5">
        <Segmented
          name="calendar"
          value={calendar}
          onChange={handleCalendarChange}
          options={[
            { value: "solar", label: "양력" },
            { value: "lunar", label: "음력" },
          ]}
        />

        <div className="grid grid-cols-3 gap-2.5">
          <SelectField
            label="년"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="월"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </SelectField>
          <SelectField
            label="일"
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </SelectField>
        </div>

        {calendar === "lunar" && (
          <label className="flex items-center gap-2 text-sm text-paper-500">
            <input
              type="checkbox"
              checked={isLeapMonth}
              onChange={(e) => setIsLeapMonth(e.target.checked)}
              className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-500"
            />
            윤달이에요
          </label>
        )}

        <div className="flex flex-col gap-2">
          <SelectField
            label="태어난 시간"
            value={hour}
            disabled={timeUnknown}
            onChange={(e) => setHour(Number(e.target.value))}
          >
            {HOURS.map((h) => (
              <option key={h} value={h}>
                {formatHourLabel(h)}
              </option>
            ))}
          </SelectField>
          <label className="flex items-center gap-2 text-sm text-paper-500">
            <input
              type="checkbox"
              checked={timeUnknown}
              onChange={(e) => setTimeUnknown(e.target.checked)}
              className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-gold-500"
            />
            태어난 시간을 몰라요
          </label>
        </div>

        <Segmented
          name="gender"
          value={gender}
          onChange={setGender}
          options={[
            { value: "female", label: "여성" },
            { value: "male", label: "남성" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        {error && <p className="text-center text-xs text-ohaeng-hwa">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          무료로 사주 확인하기
          <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <p className="text-center text-[11px] text-paper-500">
          결제 없이 사주 원국과 오행 분포를 바로 확인할 수 있어요
        </p>
      </div>
    </form>
  );
}
