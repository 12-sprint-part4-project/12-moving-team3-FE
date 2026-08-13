import { cn } from '@/lib/utils';

import { HISTORY_PAGE_X_PADDING } from './constants';
import { QuotesHistoryListSkeleton } from './QuotesHistoryListSkeleton';

/** 이용 내역 본문 영역 스켈레톤 */
export interface QuotesHistoryPageSkeletonProps {
  className?: string;
  pageXPadding?: string;
}

export const QuotesHistoryPageSkeleton = ({
  className,
  pageXPadding = HISTORY_PAGE_X_PADDING,
}: QuotesHistoryPageSkeletonProps) => (
  <div className={cn('min-h-0 w-full flex-1 bg-background-200', className)}>
    <div
      className={cn(
        'mx-auto w-full max-w-[1920px] py-6 md:py-8 lg:py-10',
        pageXPadding
      )}
    >
      <QuotesHistoryListSkeleton />
    </div>
  </div>
);
