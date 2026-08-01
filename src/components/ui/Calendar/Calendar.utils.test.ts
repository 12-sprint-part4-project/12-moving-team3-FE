import { describe, expect, it } from 'vitest';

import {
  formatDateOnly,
  getCalendarGrid,
  isDateDisabled,
  parseDateOnly,
} from './Calendar.utils';

/** 로컬 연월일로 Date 생성 — 테스트에서 UTC 시프트 방지 */
const localDate = (year: number, monthIndex: number, day: number) =>
  new Date(year, monthIndex, day);

describe('getCalendarGrid', () => {
  it('1일이 일요일이면 앞 패딩 없이 해당 월 1일로 시작한다', () => {
    // 2023-01-01 = 일요일
    const weeks = getCalendarGrid(2023, 0);

    expect(weeks).toHaveLength(6);
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[0][0]).toEqual({
      date: localDate(2023, 0, 1),
      isCurrentMonth: true,
    });
  });

  it('1일이 토요일이면 앞쪽에 이전 달 날짜 6칸을 패딩한다', () => {
    // 2022-01-01 = 토요일
    const weeks = getCalendarGrid(2022, 0);
    const firstWeek = weeks[0];

    expect(firstWeek[0]).toEqual({
      date: localDate(2021, 11, 26),
      isCurrentMonth: false,
    });
    expect(firstWeek[5]).toEqual({
      date: localDate(2021, 11, 31),
      isCurrentMonth: false,
    });
    expect(firstWeek[6]).toEqual({
      date: localDate(2022, 0, 1),
      isCurrentMonth: true,
    });
  });

  it('12월 그리드가 다음 해 1월로 이어진다', () => {
    const weeks = getCalendarGrid(2024, 11);
    const flat = weeks.flat();
    const decemberCells = flat.filter((cell) => cell.isCurrentMonth);
    const januaryCells = flat.filter(
      (cell) => !cell.isCurrentMonth && cell.date.getMonth() === 0
    );

    expect(decemberCells).toHaveLength(31);
    expect(decemberCells[0]?.date).toEqual(localDate(2024, 11, 1));
    expect(decemberCells.at(-1)?.date).toEqual(localDate(2024, 11, 31));
    expect(januaryCells.length).toBeGreaterThan(0);
    expect(januaryCells[0]?.date.getFullYear()).toBe(2025);
    expect(januaryCells[0]?.date.getDate()).toBe(1);
  });
});

describe('isDateDisabled', () => {
  const minDate = localDate(2024, 6, 10);
  const maxDate = localDate(2024, 6, 20);

  it('minDate/maxDate 경계일은 선택 가능하다', () => {
    expect(isDateDisabled(localDate(2024, 6, 10), minDate, maxDate)).toBe(
      false
    );
    expect(isDateDisabled(localDate(2024, 6, 20), minDate, maxDate)).toBe(
      false
    );
  });

  it('minDate 이전·maxDate 이후는 비활성이다', () => {
    expect(isDateDisabled(localDate(2024, 6, 9), minDate, maxDate)).toBe(true);
    expect(isDateDisabled(localDate(2024, 6, 21), minDate, maxDate)).toBe(
      true
    );
  });

  it('시간 값이 달라도 날짜 단위로만 비교한다', () => {
    const midday = new Date(2024, 6, 10, 15, 30, 0);
    expect(isDateDisabled(midday, minDate, maxDate)).toBe(false);
  });

  it('범위가 없으면 비활성되지 않는다', () => {
    expect(isDateDisabled(localDate(2024, 0, 1))).toBe(false);
  });
});

describe('formatDateOnly / parseDateOnly', () => {
  it('로컬 Date를 YYYY-MM-DD로 포맷한다', () => {
    expect(formatDateOnly(localDate(2024, 0, 5))).toBe('2024-01-05');
    expect(formatDateOnly(localDate(2024, 11, 31))).toBe('2024-12-31');
  });

  it('YYYY-MM-DD를 로컬 Date로 파싱한다', () => {
    expect(parseDateOnly('2024-07-15')).toEqual(localDate(2024, 6, 15));
  });

  it('format → parse 왕복 시 연월일이 보존된다', () => {
    const original = localDate(2024, 2, 9);
    const roundTripped = parseDateOnly(formatDateOnly(original));

    expect(roundTripped.getFullYear()).toBe(original.getFullYear());
    expect(roundTripped.getMonth()).toBe(original.getMonth());
    expect(roundTripped.getDate()).toBe(original.getDate());
  });

  it('parse → format 왕복 시 문자열이 보존된다', () => {
    expect(formatDateOnly(parseDateOnly('2023-12-01'))).toBe('2023-12-01');
  });
});
