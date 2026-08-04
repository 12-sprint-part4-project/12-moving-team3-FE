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
 * 견적 신청일 등 한국어 긴 날짜 라벨 (Asia/Seoul 캘린더 일자)
 * 예: 2024-06-24T00:00:00.000Z → 2024년 6월 24일
 */
export const formatKoreanDateLabel = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(date);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  if (!year || !month || !day) {
    return '-';
  }

  return `${year}년 ${month}월 ${day}일`;
};

/** date-only(YYYY-MM-DD…) 파싱. 타임존 변환 없이 로컬 캘린더 일자로 검증 */
const parseDateOnlyParts = (
  value: string | null
): { year: number; month: number; day: number; weekdayIndex: number } | null => {
  if (!value) {
    return null;
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return { year, month, day, weekdayIndex: date.getDay() };
};

/**
 * 이사일 한국어 긴 날짜 라벨 (date-only, 타임존 변환 없음)
 * 예: 2024-07-01 → 2024년 07월 01일 (월)
 */
export const formatKoreanMoveDateLabel = (value: string | null): string => {
  const parts = parseDateOnlyParts(value);
  if (!parts) {
    return '-';
  }

  const { year, month, day, weekdayIndex } = parts;
  const weekday = WEEKDAY_LABELS[weekdayIndex];
  return `${year}년 ${pad2(month)}월 ${pad2(day)}일 (${weekday})`;
};

/**
 * 이사일(date-only) 표시 문자열 포맷
 * YYYY-MM-DD 캘린더 날짜는 타임존 변환하지 않음 (일자 밀림 방지)
 */
export const formatMoveDateLabel = (value: string | null): string => {
  const parts = parseDateOnlyParts(value);
  if (!parts) {
    return '-';
  }

  return toDateLabel(parts.year, parts.month, parts.day, parts.weekdayIndex);
};

/** 상대 시간 표시 문자열 포맷 (예: 3분 전, 어제, 2일 전) */
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

  // 달력 기준 어제만 「어제」(24h 경과량만으로는 이틀 전을 잘못 표기할 수 있음)
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const isLocalYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isLocalYesterday) {
    return '어제';
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  // 7일 이상은 로컬 타임존 기준 절대 날짜로 표시
  return formatLocalDateLabel(value);
};
