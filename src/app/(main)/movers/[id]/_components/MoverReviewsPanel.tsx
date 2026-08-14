'use client';

import { MoverReviewSection } from '@/components/reviews/MoverReviewSection';
import { useMoverReviews } from '@/hooks/useMoverReviews';
import { cn } from '@/lib/utils';

export interface MoverReviewsPanelProps {
  moverId: string;
  className?: string;
}

/** `/movers/[id]` 리뷰 패널. Query·통계·목록·페이지네이션. */
export const MoverReviewsPanel = ({
  moverId,
  className,
}: MoverReviewsPanelProps) => {
  const {
    reviews,
    ratingStatistics,
    pagination,
    page,
    totalPages,
    setPage,
    isPending,
    isFetching,
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
      isFetching={isFetching}
      isError={isError}
      onRetry={() => {
        void refetch();
      }}
    />
  );
};
