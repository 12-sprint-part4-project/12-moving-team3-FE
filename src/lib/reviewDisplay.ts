import type { ReviewRatingStatistics } from '@/types/review';

/** ISO datetime → YYYY-MM-DD (로컬) */
export const formatReviewCreatedDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** YYYY-MM-DD → 2024. 07. 01 (리뷰 카드·모달용, 요일 없음) */
export const formatReviewMoveDate = (value: string | null): string => {
  if (!value) {
    return '-';
  }

  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split('-');
  if (!year || !month || !day) {
    return '-';
  }

  return `${year}. ${month}. ${day}`;
};

const SCORE_KEYS = [
  { score: 5, key: 'five' },
  { score: 4, key: 'four' },
  { score: 3, key: 'three' },
  { score: 2, key: 'two' },
  { score: 1, key: 'one' },
] as const;

export interface ReviewScoreBreakdownItem {
  score: 1 | 2 | 3 | 4 | 5;
  count: number;
  isMajority: boolean;
}

/** 5점→1점 분포 + 최다 점수 강조 */
export const getReviewScoreBreakdown = (
  stats: ReviewRatingStatistics
): ReviewScoreBreakdownItem[] => {
  const items = SCORE_KEYS.map(({ score, key }) => ({
    score,
    count: stats[key],
  }));
  const maxCount = Math.max(...items.map((item) => item.count), 0);

  return items.map((item) => ({
    ...item,
    isMajority: maxCount > 0 && item.count === maxCount,
  }));
};

export const getReviewStatsTotalCount = (
  stats: ReviewRatingStatistics
): number =>
  stats.five + stats.four + stats.three + stats.two + stats.one;
