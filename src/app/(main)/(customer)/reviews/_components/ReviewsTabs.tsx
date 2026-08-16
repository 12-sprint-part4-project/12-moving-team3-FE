import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';

import { REVIEWS_PAGE_X_PADDING } from './reviewsStyles';

export type ReviewsPageTab = 'writable' | 'written';

/** 작성 가능 / 내가 작성한 리뷰 탭 정의 */
const TABS: QuotesTabItem<ReviewsPageTab>[] = [
  { id: 'writable', label: '작성 가능한 리뷰', href: '/reviews' },
  { id: 'written', label: '내가 작성한 리뷰', href: '/reviews?tab=written' },
];

/** URL `tab` 쿼리 → 탭 id (`written`만 특수, 기본 writable) */
export const parseReviewsTabId = (
  value: string | null | undefined
): ReviewsPageTab => (value === 'written' ? 'written' : 'writable');

export interface ReviewsTabsProps {
  activeTab: ReviewsPageTab;
}

/** `/reviews` 상단 탭바. - 작성 가능 / 내가 작성한 리뷰. */
export const ReviewsTabs = ({ activeTab }: ReviewsTabsProps) => (
  <QuotesTabsShell
    tabs={TABS}
    activeTab={activeTab}
    className={REVIEWS_PAGE_X_PADDING}
    ariaLabel="이사 리뷰 탭"
    tabIdPrefix="reviews-tab"
  />
);
