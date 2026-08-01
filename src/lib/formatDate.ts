const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const pad2 = (value: number): string => String(value).padStart(2, '0');

const toDateLabel = (
  year: number,
  month: number,
  day: number,
  weekdayIndex: number
): string => {
  const weekday = WEEKDAY_LABELS[weekdayIndex];
  return `${year}. ${pad2(month)}. ${pad2(day)}(${weekday})`;
};

/**
 * UTC ISO datetime → 브라우저 로컬 타임존 날짜 라벨
 * 예: 2026-07-29T15:00:00.000Z → 한국에서 2026. 07. 30(목)
 */
export const formatLocalDateLabel = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  // getFullYear/getMonth/getDate/getDay 는 브라우저 로컬 타임존 기준
  return toDateLabel(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getDay()
  );
};

/**
 * 견적 요청일 짧은 표시 문자열
 * 예: 2024-08-26T00:00:00.000Z → 24.08.26
 */
export const formatShortDateLabel = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = String(date.getFullYear()).slice(-2);
  return `${year}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
};

/**
 * 이사일(date-only) 표시 문자열 포맷
 * YYYY-MM-DD 캘린더 날짜는 타임존 변환하지 않음 (일자 밀림 방지)
 */
export const formatMoveDateLabel = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) {
    return '-';
  }

  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return toDateLabel(year, month, day, date.getDay());
};

/** 상대 시간 표시 문자열 포맷 (예: 3분 전, 2일 전) */
export const formatRelativeTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) {
    return '방금 전';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  // 7일 이상은 로컬 타임존 기준 절대 날짜로 표시
  return formatLocalDateLabel(value);
};
