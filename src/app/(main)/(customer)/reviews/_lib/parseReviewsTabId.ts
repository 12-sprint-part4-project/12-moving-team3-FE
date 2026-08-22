export type ReviewsPageTab = 'writable' | 'written';

/** URL `tab` 쿼리 → 탭 id (`written`만 특수, 기본 writable) */
export const parseReviewsTabId = (
  value: string | null | undefined
): ReviewsPageTab => (value === 'written' ? 'written' : 'writable');
