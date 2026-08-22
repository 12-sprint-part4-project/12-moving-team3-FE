'use client';

import { useEffect, useState } from 'react';

import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { Button } from '@/components/Button/Button';
import { useControllableValue } from '@/hooks/useControllableValue';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import {
  formatMonthTitle,
  getCalendarGrid,
  isDateDisabled,
  isSameDay,
} from './Calendar.utils';

const WEEKDAY_KEYS = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
] as const;

export interface CalendarProps {
  /** 현재 선택된 날짜 (controlled) */
  value?: Date;
  /** 초기 선택 날짜 (uncontrolled) */
  defaultValue?: Date;
  /** 날짜 선택 시 호출 */
  onValueChange?: (date: Date) => void;
  /** 「선택완료」클릭 시 호출. 선택 날짜가 없으면 버튼 disabled라 호출되지 않음 */
  onConfirm?: (date: Date) => void;
  /**
   * 선택 가능 최소/최대 날짜(경계 포함).
   * 오늘 이전을 막으려면 호출측에서 마운트 후 계산한 Date를 minDate로 전달.
   */
  minDate?: Date;
  maxDate?: Date;
  /** 하단 확인 버튼 라벨 */
  confirmLabel?: string;
  /** 확인 버튼 busy(저장 중 등) */
  confirmDisabled?: boolean;
  className?: string;
}

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

/**
 * 월 이동 + 날짜 선택 + 확인 버튼을 묶은 카드형 날짜 선택.
 * sm 기본 / md+ 스케일. 그리드는 table로 요일·날짜 관계를 시맨틱하게 전달하고,
 * 이전·다음 달 칸은 텍스트만 보여 포커스 혼란을 줄인다.
 */
export const Calendar = ({
  value,
  defaultValue,
  onValueChange,
  onConfirm,
  minDate,
  maxDate,
  confirmLabel,
  confirmDisabled = false,
  className,
}: CalendarProps) => {
  const { t } = useTranslation();
  const resolvedConfirmLabel =
    confirmLabel ?? t('estimateRequest.selectComplete');
  // Date | undefined 전체를 다루는 훅에, 실제 통지는 Date만 넘기도록 좁힌다
  const handleControllableChange = (nextValue: Date | undefined) => {
    if (nextValue) {
      onValueChange?.(nextValue);
    }
  };

  const [selectedDate, setSelectedDate] = useControllableValue<
    Date | undefined
  >(value, defaultValue, handleControllableChange);
  // selectedDate가 없으면 SSR에서 new Date()를 쓰지 않음 — 마운트 후 로컬 오늘로 맞춤
  const [currentMonth, setCurrentMonth] = useState<Date | null>(() =>
    selectedDate ? startOfMonth(selectedDate) : null
  );

  useEffect(() => {
    if (currentMonth == null) {
      setCurrentMonth(startOfMonth(new Date()));
    }
  }, [currentMonth]);

  const weeks = currentMonth
    ? getCalendarGrid(currentMonth.getFullYear(), currentMonth.getMonth())
    : [];

  const handlePrevMonth = () => {
    setCurrentMonth((prev) =>
      prev ? new Date(prev.getFullYear(), prev.getMonth() - 1, 1) : prev
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) =>
      prev ? new Date(prev.getFullYear(), prev.getMonth() + 1, 1) : prev
    );
  };

  const handleConfirm = () => {
    if (!selectedDate) {
      return;
    }
    onConfirm?.(selectedDate);
  };

  const canConfirm = selectedDate != null && !confirmDisabled;

  return (
    <div
      className={cn(
        // sm radius 16 / md 32, chat-panel 톤 그림자
        'flex w-full flex-col items-center gap-4 rounded-2xl bg-white py-3.5 shadow-chat-panel',
        'md:gap-6 md:rounded-[2rem] md:py-6',
        className
      )}
    >
      <div className="flex w-full flex-col items-center gap-0.5 md:gap-2">
        {/* 월 네비게이션 */}
        <div className="flex h-12 w-full items-center justify-between px-3.5 md:h-auto md:px-3.5 md:py-3">
          <button
            type="button"
            aria-label={t('date.prevMonth')}
            disabled={currentMonth == null}
            onClick={handlePrevMonth}
            className="flex size-6 items-center justify-center text-gray-300 md:size-9"
          >
            <ChevronLeftIcon aria-hidden className="size-full" />
          </button>
          <p
            aria-live="polite"
            className="text-lg-semibold text-black-400 md:text-xl-semibold"
          >
            {currentMonth ? formatMonthTitle(currentMonth) : '\u00a0'}
          </p>
          <button
            type="button"
            aria-label={t('date.nextMonth')}
            disabled={currentMonth == null}
            onClick={handleNextMonth}
            className="flex size-6 items-center justify-center text-gray-300 md:size-9"
          >
            <ChevronRightIcon aria-hidden className="size-full" />
          </button>
        </div>

        <table className="w-full max-w-[19.3125rem] border-collapse md:max-w-[40rem]">
          <caption className="sr-only">
            {currentMonth
              ? t('date.selectMonth', { month: formatMonthTitle(currentMonth) })
              : t('date.select')}
          </caption>
          <thead>
            <tr>
              {WEEKDAY_KEYS.map((weekdayKey) => (
                <th
                  key={weekdayKey}
                  scope="col"
                  className="px-1 py-2.5 text-center text-sm-medium text-gray-400 md:size-16 md:px-6 md:py-4 md:text-xl-medium"
                >
                  {t(`date.weekday.${weekdayKey}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map(({ date, isCurrentMonth }) => {
                  const disabled = isDateDisabled(date, minDate, maxDate);
                  const isSelected =
                    isCurrentMonth &&
                    !!selectedDate &&
                    isSameDay(date, selectedDate);

                  // 로컬 연월일로 키 — toISOString UTC 시프트 방지
                  const cellKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

                  return (
                    <td key={cellKey} className="p-0 text-center">
                      {isCurrentMonth ? (
                        <button
                          type="button"
                          disabled={disabled}
                          aria-pressed={isSelected}
                          aria-label={t('date.yearMonthDay', {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                          })}
                          onClick={() => setSelectedDate(date)}
                          className={cn(
                            'mx-auto flex size-10 items-center justify-center rounded-full text-sm-medium transition-colors md:size-16 md:text-xl-medium',
                            isSelected && 'bg-blue-300 text-white',
                            !isSelected &&
                              disabled &&
                              'cursor-not-allowed text-gray-100',
                            !isSelected &&
                              !disabled &&
                              'text-black-400 hover:bg-background-300'
                          )}
                        >
                          {date.getDate()}
                        </button>
                      ) : (
                        <span
                          aria-hidden
                          className="mx-auto flex size-10 items-center justify-center text-sm-medium text-gray-100 md:size-16 md:text-xl-medium"
                        >
                          {date.getDate()}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full max-w-[17.4375rem] px-0 md:max-w-[35rem]">
        <Button
          type="button"
          variant="solid"
          size="sm"
          disabled={!canConfirm}
          aria-busy={confirmDisabled}
          className="md:h-16 md:text-xl-semibold"
          onClick={handleConfirm}
        >
          {resolvedConfirmLabel}
        </Button>
      </div>
    </div>
  );
};
