'use client';

import { Tab } from '@/components/ui/Tab/Tab';
import { cn } from '@/lib/utils';

export type ReviewsPageTab = 'writable' | 'written';

export interface ReviewsTabsProps {
  activeTab: ReviewsPageTab;
  onTabChange: (tab: ReviewsPageTab) => void;
  className?: string;
}

/** 내 견적 관리와 동일한 페이지 좌우 패딩 */
export const REVIEWS_PAGE_X_PADDING =
  'px-6 md:px-18 lg:px-10 xl:px-16 min-[90rem]:px-65';

const TABS: { id: ReviewsPageTab; label: string }[] = [
  { id: 'writable', label: '작성 가능한 리뷰' },
  { id: 'written', label: '내가 작성한 리뷰' },
];

/** 이사 리뷰 페이지 탭 — 내 견적 관리(Tab depth)와 동일 패턴 */
export const ReviewsTabs = ({
  activeTab,
  onTabChange,
  className,
}: ReviewsTabsProps) => (
  <div
    className={cn(
      'shrink-0 border-b border-line-100 bg-white pt-4 shadow-page-title',
      REVIEWS_PAGE_X_PADDING,
      className
    )}
  >
    <div
      role="tablist"
      aria-label="이사 리뷰 탭"
      className="flex items-start gap-6 lg:gap-8"
    >
      {TABS.map((tab) => (
        <Tab
          key={tab.id}
          variant="depth"
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
          id={`reviews-tab-${tab.id}`}
          aria-controls={`reviews-panel-${tab.id}`}
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  </div>
);
