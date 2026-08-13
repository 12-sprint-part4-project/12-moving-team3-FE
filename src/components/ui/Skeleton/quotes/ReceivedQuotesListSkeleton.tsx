import { cn } from '@/lib/utils';

import { ReceivedQuoteGroupSkeleton } from './ReceivedQuoteGroupSkeleton';

/** 받았던 견적 탭 pending용 — 그룹 섹션 윤곽 */
export const ReceivedQuotesListSkeleton = ({
  className = '',
  groupCount = 1,
}: {
  className?: string;
  groupCount?: number;
}) => (
  <div
    className={cn(
      'mx-auto flex w-full max-w-[87.5rem] flex-col gap-6 md:gap-8 lg:gap-10',
      className
    )}
    role="status"
    aria-busy="true"
    aria-label="목록 불러오는 중"
  >
    {Array.from({ length: groupCount }, (_, index) => (
      <ReceivedQuoteGroupSkeleton key={index} />
    ))}
  </div>
);
