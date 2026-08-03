'use client';

import { cn } from '@/lib/utils';
import type { ReviewStats } from '@/types/review';

export interface MoverReviewsProps {
  moverId: string;
  reviewStats?: ReviewStats;
  className?: string;
}

/**
 * 기사님 상세 리뷰 영역.
 * 제목만 표시 — chart / 리스트 / pagination / empty 는 이후 구현.
 */
export const MoverReviews = ({
  moverId: _moverId,
  reviewStats,
  className,
}: MoverReviewsProps) => {
  const totalCount = reviewStats?.totalCount ?? 0;

  return (
    <section
      className={cn('flex w-full flex-col gap-4 lg:gap-8', className)}
    >
      <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
        리뷰 ({totalCount})
      </h2>
      {/* TODO: 리뷰 차트 (reviewStats.averageRating, ratingCounts) */}
      {/* TODO: 리뷰 목록 카드 + 페이지네이션 (moverId로 조회) */}
      {/* TODO: 리뷰 0건 empty 상태 */}
    </section>
  );
};
