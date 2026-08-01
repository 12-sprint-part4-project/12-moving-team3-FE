/** 캘린더 날짜 그리드 한 칸 — 이전/다음 달 칸은 흐리게·선택 불가 */
export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
}

/** 일~토 (한국 캘린더 관례: 일요일 시작) */
export const WEEKDAY_LABELS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
] as const;

const WEEK_LENGTH = 7;
const TOTAL_CELLS = 6 * WEEK_LENGTH;

/** 시/분/초를 0으로 맞춰 날짜만 비교 */
const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * year/month(0-indexed)를 6행×7열(일~토) 고정 그리드로 채운다.
 * 앞·뒤는 이전/다음 달 날짜로 패딩한다.
 */
export const getCalendarGrid = (
  year: number,
  month: number
): CalendarCell[][] => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }

  for (let day = 1; cells.length < TOTAL_CELLS; day += 1) {
    cells.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += WEEK_LENGTH) {
    weeks.push(cells.slice(i, i + WEEK_LENGTH));
  }
  return weeks;
};

/** "YYYY. MM" 월 타이틀 (예: '2024. 07') */
export const formatMonthTitle = (date: Date): string =>
  `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}`;

/** 로컬 연월일 → 'YYYY-MM-DD' (UTC 시프트 없이 API body용) */
export const formatDateOnly = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** 'YYYY-MM-DD' → 로컬 Date (Date.parse UTC 시프트 방지) */
export const parseDateOnly = (dateOnly: string): Date => {
  const [year, month, day] = dateOnly.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** 연/월/일만 같은지 비교 (시간 무시) */
export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** minDate/maxDate 범위(날짜 단위, 경계 포함) 밖이면 true */
export const isDateDisabled = (
  date: Date,
  minDate?: Date,
  maxDate?: Date
): boolean => {
  const target = startOfDay(date).getTime();
  if (minDate && target < startOfDay(minDate).getTime()) {
    return true;
  }
  if (maxDate && target > startOfDay(maxDate).getTime()) {
    return true;
  }
  return false;
};
