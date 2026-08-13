import { cn } from '@/lib/utils';

import { PendingRequestSubHeaderSkeleton } from './PendingRequestSubHeaderSkeleton';
import { QuotesListSkeleton } from './QuotesListSkeleton';
import { QuotesTabsSkeleton } from './QuotesTabsSkeleton';

export interface QuotesPageContentSkeletonProps {
  className?: string;
  tabsClassName?: string;
  contentClassName?: string;
  /** false면 탭 스켈레톤 없이 목록만 */
  withTabs?: boolean;
  /** 고객 대기 중 견적 SubHeader 스켈레톤 */
  withSubHeader?: boolean;
}

/**
 * 목록 본문 스켈레톤 — Suspense fallback용
 */
export const QuotesPageContentSkeleton = ({
  className,
  tabsClassName,
  contentClassName,
  withTabs = true,
  withSubHeader = false,
}: QuotesPageContentSkeletonProps) => (
  <div className="flex min-h-0 w-full flex-1 flex-col overflow-x-hidden">
    {withTabs ? (
      <QuotesTabsSkeleton className={cn(className, tabsClassName)} />
    ) : null}
    <div className="min-h-0 w-full flex-1 bg-background-200">
      {withSubHeader ? <PendingRequestSubHeaderSkeleton /> : null}
      <div
        className={cn(
          'mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10',
          className,
          contentClassName
        )}
      >
        <QuotesListSkeleton />
      </div>
    </div>
  </div>
);
