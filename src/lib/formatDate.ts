import { i18n } from '@/i18n/i18n';
import { getActiveLanguage, toBcp47Locale } from '@/lib/formatLocale';

import type { SupportedLanguage } from '@/i18n/config';

const pad2 = (value: number): string => String(value).padStart(2, '0');

const getLocale = (): SupportedLanguage => getActiveLanguage();

const getBcp47 = (): string => toBcp47Locale(getLocale());

const toDateLabel = (
  year: number,
  month: number,
  day: number,
  weekdayIndex: number,
  language: SupportedLanguage = getLocale()
): string => {
  const date = new Date(year, month - 1, day);
  const weekday = new Intl.DateTimeFormat(getBcp47(), {
    weekday: 'short',
  }).format(date);

  if (language === 'ko') {
    return `${year}. ${pad2(month)}. ${pad2(day)}(${weekday})`;
  }

  return new Intl.DateTimeFormat(getBcp47(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
};

/**
 * UTC ISO datetime → 브라우저 로컬 타임존 날짜 라벨
 */
export const formatLocalDateLabel = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return toDateLabel(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getDay()
  );
};

/**
 * 견적 요청일 짧은 표시 문자열
 */
export const formatShortDateLabel = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const language = getLocale();
  if (language === 'ko') {
    const year = String(date.getFullYear()).slice(-2);
    return `${year}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
  }

  return new Intl.DateTimeFormat(getBcp47(), {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/** 커뮤니티 게시글 메타 날짜 */
export const formatDotDateLabel = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const language = getLocale();
  if (language === 'ko') {
    return `${date.getFullYear()}.${pad2(date.getMonth() + 1)}.${pad2(date.getDate())}`;
  }

  return new Intl.DateTimeFormat(getBcp47(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

/**
 * 견적 신청일 등 긴 날짜 라벨 (Asia/Seoul 캘린더 일자)
 */
export const formatKoreanDateLabel = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const language = getLocale();
  if (language === 'ko') {
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
  }

  return new Intl.DateTimeFormat(getBcp47(), {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
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
 * 이사일 긴 날짜 라벨 (date-only, 타임존 변환 없음)
 */
export const formatKoreanMoveDateLabel = (value: string | null): string => {
  const parts = parseDateOnlyParts(value);
  if (!parts) {
    return '-';
  }

  const { year, month, day, weekdayIndex } = parts;
  const language = getLocale();

  if (language === 'ko') {
    const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'] as const;
    const weekday = weekdayLabels[weekdayIndex];
    return `${year}년 ${pad2(month)}월 ${pad2(day)}일 (${weekday})`;
  }

  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat(getBcp47(), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
};

/**
 * 이사일(date-only) 표시 문자열 포맷
 */
export const formatMoveDateLabel = (value: string | null): string => {
  const parts = parseDateOnlyParts(value);
  if (!parts) {
    return '-';
  }

  return toDateLabel(
    parts.year,
    parts.month,
    parts.day,
    parts.weekdayIndex
  );
};

/**
 * 채팅 메시지 시각 (로컬 타임존)
 */
export const formatChatMessageTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const language = getLocale();
  return new Intl.DateTimeFormat(getBcp47(), {
    hour: 'numeric',
    minute: '2-digit',
    hour12: language === 'en',
  }).format(date);
};

/** 로컬 캘린더 일자가 같은지 비교 */
export const isSameLocalCalendarDay = (a: string, b: string): boolean => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
    return false;
  }

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

/** 로컬 시각의 연·월·일·시·분이 같은지 비교 (초는 무시) */
export const isSameLocalMinute = (a: string, b: string): boolean => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  if (Number.isNaN(dateA.getTime()) || Number.isNaN(dateB.getTime())) {
    return false;
  }

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate() &&
    dateA.getHours() === dateB.getHours() &&
    dateA.getMinutes() === dateB.getMinutes()
  );
};

const formatRelativeWithIntl = (
  diffValue: number,
  unit: Intl.RelativeTimeFormatUnit
) =>
  new Intl.RelativeTimeFormat(getBcp47(), { numeric: 'auto' }).format(
    -diffValue,
    unit
  );

/**
 * 채팅 날짜 구분선 라벨 (로컬 캘린더 기준)
 */
export const formatChatDateSeparator = (
  value: string,
  now: Date = new Date()
): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.round(
    (todayStart.getTime() - targetStart.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return i18n.t('date.today');
  }
  if (diffDays === 1) {
    return i18n.t('date.yesterday');
  }
  if (diffDays === 2) {
    return i18n.t('date.dayBeforeYesterday');
  }

  const language = getLocale();
  if (language === 'ko') {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if (date.getFullYear() === now.getFullYear()) {
      return `${month}월 ${day}일`;
    }

    return `${date.getFullYear()}년 ${month}월 ${day}일`;
  }

  return new Intl.DateTimeFormat(getBcp47(), {
    year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

/** 상대 시간 표시 문자열 포맷 */
export const formatRelativeTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) {
    return i18n.t('date.justNow');
  }
  if (diffMinutes < 60) {
    return formatRelativeWithIntl(diffMinutes, 'minute');
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return formatRelativeWithIntl(diffHours, 'hour');
  }

  const diffDays = Math.floor(diffHours / 24);

  const now = new Date();
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );
  const isLocalYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isLocalYesterday) {
    return i18n.t('date.yesterday');
  }
  if (diffDays < 7) {
    return formatRelativeWithIntl(diffDays, 'day');
  }

  return formatLocalDateLabel(value);
};

type RelativeReceiptKind = 'read' | 'sent';

const RELATIVE_RECEIPT_TEXT: Record<
  RelativeReceiptKind,
  {
    justNow: string;
    minutes: (n: number) => string;
    hours: (n: number) => string;
    days: (n: number) => string;
    weeks: (n: number) => string;
    fallback: string;
  }
> = {
  read: {
    justNow: '방금 읽음',
    minutes: (n) => `${n}분 전 읽음`,
    hours: (n) => `${n}시간 전 읽음`,
    days: (n) => `${n}일 전 읽음`,
    weeks: (n) => `${n}주 전 읽음`,
    fallback: '읽음',
  },
  sent: {
    justNow: '방금 보냄',
    minutes: (n) => `${n}분 전 보냄`,
    hours: (n) => `${n}시간 전 보냄`,
    days: (n) => `${n}일 전 보냄`,
    weeks: (n) => `${n}주 전 보냄`,
    fallback: '전송됨',
  },
};

const formatRelativeReceiptLabel = (
  value: string | null | undefined,
  kind: RelativeReceiptKind
): string => {
  const labels = RELATIVE_RECEIPT_TEXT[kind];

  if (!value) {
    return labels.fallback;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return labels.fallback;
  }

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) {
    return labels.justNow;
  }
  if (diffMinutes < 60) {
    return labels.minutes(diffMinutes);
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return labels.hours(diffHours);
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return labels.days(diffDays);
  }

  if (diffDays < 30) {
    return labels.weeks(Math.floor(diffDays / 7));
  }

  return labels.fallback;
};

export const formatPartnerReadReceiptLabel = (
  readAt: string | null | undefined
): string => formatRelativeReceiptLabel(readAt, 'read');

export const formatMyMessageSentLabel = (createdAt: string): string =>
  formatRelativeReceiptLabel(createdAt, 'sent');
