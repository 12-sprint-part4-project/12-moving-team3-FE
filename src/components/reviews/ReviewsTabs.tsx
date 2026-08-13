import {
  QuotesTabsShell,
  resolveQuotesTabParam,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

export type ReviewsPageTab = 'writable' | 'written';

export { resolveQuotesTabParam as resolveReviewsTabParam };

/** URL tab 쿼리 → 탭 id */
export const parseReviewsTabId = (
  value: string | null | undefined
): ReviewsPageTab => (value === 'written' ? 'written' : 'writable');

/** URL highlight 쿼리 → 방금 등록한 리뷰 id */
export const parseHighlightReviewId = (
  value: string | null | undefined
): number | null => {
  if (!value) {
    return null;
  }
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

/** 등록 직후 카드 강조 유지 시간(ms) */
export const REVIEW_HIGHLIGHT_DURATION_MS = 1000;

/** 좌우 패딩 */
export const REVIEWS_PAGE_X_PADDING =
  'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

const TABS: QuotesTabItem<ReviewsPageTab>[] = [
  { id: 'writable', label: '작성 가능한 리뷰', href: '/reviews' },
  { id: 'written', label: '내가 작성한 리뷰', href: '/reviews?tab=written' },
];

export interface ReviewsTabsProps {
  activeTab: ReviewsPageTab;
}

/** 이사 리뷰 페이지 탭 — URL searchParams.tab 기준 Link 내비게이션 */
export const ReviewsTabs = ({ activeTab }: ReviewsTabsProps) => (
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={REVIEWS_PAGE_X_PADDING}
    ariaLabel="이사 리뷰 탭"
    tabIdPrefix="reviews-tab"
  />
);
