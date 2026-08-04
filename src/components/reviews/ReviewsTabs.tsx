'use client';

import { cn } from '@/lib/utils';

export type ReviewsPageTab = 'writable' | 'written';

export interface ReviewsTabsProps {
  activeTab: ReviewsPageTab;
  onTabChange: (tab: ReviewsPageTab) => void;
  className?: string;
}

const TABS: { id: ReviewsPageTab; label: string }[] = [
  { id: 'writable', label: '작성 가능한 리뷰' },
  { id: 'written', label: '내가 작성한 리뷰' },
];

/** 이사 리뷰 페이지 탭 (Figma desktop tab bar) */
export const ReviewsTabs = ({
  activeTab,
  onTabChange,
  className,
}: ReviewsTabsProps) => (
  <div
    className={cn(
      'flex w-full items-stretch border-b border-line-100 bg-white',
      className
    )}
  >
    <div
      className={cn(
        'mx-auto flex w-full max-w-[1920px] gap-10',
        'px-6 md:px-[4.5rem] xl:px-[16.25rem]'
      )}
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={isActive}
            className={cn(
              'relative py-4 text-lg-semibold transition-colors xl:py-8 xl:text-2xl-semibold',
              isActive ? 'text-black-400' : 'text-gray-300'
            )}
          >
            {tab.label}
            {isActive ? (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-0.5 bg-black-400 xl:h-1"
              />
            ) : null}
          </button>
        );
      })}
    </div>
  </div>
);
