'use client';

import { MoverReviewSection } from '@/components/reviews/MoverReviewSection';
import { useMoverReviews } from '@/hooks/useMoverReviews';
import { cn } from '@/lib/utils';

export interface MoverReviewsProps {
  moverId: string;
  className?: string;
}

/**
 * 기사님 상세 공개 리뷰 영역.
 * GET /api/movers/:id/reviews — 통계·목록·페이지네이션.
 */
export const MoverReviews = ({ moverId, className }: MoverReviewsProps) => {
  const {
    reviews,
    ratingStatistics,
    pagination,
    page,
    totalPages,
    setPage,
    isPending,
    isError,
    refetch,
  } = useMoverReviews(moverId);

  return (
    <MoverReviewSection
      className={cn(className)}
      reviews={reviews}
      ratingStatistics={ratingStatistics}
      totalCount={pagination?.totalCount ?? 0}
      page={page}
      totalPages={totalPages}
      onPageChange={setPage}
      isPending={isPending}
      isError={isError}
      onRetry={() => {
        void refetch();
      }}
    />
  );
};
