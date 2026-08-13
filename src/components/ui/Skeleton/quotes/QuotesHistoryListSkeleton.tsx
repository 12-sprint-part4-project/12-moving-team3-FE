import { cn } from '@/lib/utils';

import { LIST_SKELETON_COUNT } from './constants';
import { HistoryQuoteCardSkeleton } from './HistoryQuoteCardSkeleton';

/** 이용 내역 목록 카드 그리드 스켈레톤 */
export const QuotesHistoryListSkeleton = ({
  className = '',
  count = LIST_SKELETON_COUNT,
}: {
  className?: string;
  count?: number;
}) => (
  <div
    className={cn(className)}
    role="status"
    aria-busy="true"
    aria-label="이용 내역 불러오는 중"
  >
    <ul className="m-0 grid w-full list-none grid-cols-1 gap-6 p-0 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-12">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <HistoryQuoteCardSkeleton />
        </li>
      ))}
    </ul>
  </div>
);
