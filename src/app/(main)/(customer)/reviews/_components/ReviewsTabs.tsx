'use client';

import {
  QuotesTabsShell,
  type QuotesTabItem,
} from '@/components/quotes/QuotesTabsShell';
import { useTranslation } from '@/i18n/useTranslation';

import { REVIEWS_PAGE_X_PADDING } from './reviewsStyles';

import type { ReviewsPageTab } from '../_lib/parseReviewsTabId';

export type { ReviewsPageTab } from '../_lib/parseReviewsTabId';

/** 작성 가능 / 내가 작성한 리뷰 탭 정의 */
const TABS: QuotesTabItem<ReviewsPageTab>[] = [
  { id: 'writable', label: '작성 가능한 리뷰', href: '/reviews' },
  { id: 'written', label: '내가 작성한 리뷰', href: '/reviews?tab=written' },
];

export interface ReviewsTabsProps {
  activeTab: ReviewsPageTab;
}

/** `/reviews` 상단 탭바. - 작성 가능 / 내가 작성한 리뷰. */
export const ReviewsTabs = ({ activeTab }: ReviewsTabsProps) => {
  const { t } = useTranslation();

  return (
    <QuotesTabsShell
      tabs={TABS.map((tab) => ({
        ...tab,
        label: t(`reviews.tab.${tab.id}`),
      }))}
      activeTab={activeTab}
      className={REVIEWS_PAGE_X_PADDING}
      ariaLabel={t('reviews.tabsAria')}
      tabIdPrefix="reviews-tab"
    />
  );
};
