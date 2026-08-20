import { cn } from '@/lib/utils';

import { MOVERS_LIST_SKELETON_COUNT } from './constants';
import { MoverCardSkeleton } from './MoverCardSkeleton';

export interface MoversListSkeletonProps {
  className?: string;
}

/** `/movers` 목록 카드 스켈레톤 */
export const MoversListSkeleton = ({
  className = '',
}: MoversListSkeletonProps) => (
  <div
    className={cn(className)}
    role="status"
    aria-busy="true"
    aria-label="기사님 목록 불러오는 중"
  >
    <ul className="m-0 flex list-none flex-col gap-6 p-0 xl:gap-12">
      {Array.from({ length: MOVERS_LIST_SKELETON_COUNT }, (_, index) => (
        <li key={index}>
          <MoverCardSkeleton />
        </li>
      ))}
    </ul>
  </div>
);
