'use client';

import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/lib/utils';
import type { ReviewStats } from '@/types/mover';

import {
  ReviewListItem,
  type ReviewListItemData,
} from './ReviewListItem';
import { ReviewRatingChart } from './ReviewRatingChart';

export interface MoverReviewsProps {
  moverId: string;
  reviewStats?: ReviewStats;
  /** 현재 페이지 리뷰 목록 */
  reviews?: ReviewListItemData[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

const EMPTY_RATING_COUNTS = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as const;

/**
 * 기사님 리뷰 영역.
 * Figma 리뷰 섹션 — 제목 · 평점 차트 · 목록 · 페이지네이션.
 */
export const MoverReviews = ({
  moverId: _moverId,
  reviewStats,
  reviews = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
}: MoverReviewsProps) => {
  const totalCount = reviewStats?.totalCount ?? 0;
  const averageRating = reviewStats?.averageRating ?? null;
  const ratingCounts = reviewStats?.ratingCounts ?? EMPTY_RATING_COUNTS;
  const showPagination =
    typeof onPageChange === 'function' && totalPages > 1;

  return (
    <section
      className={cn('flex w-full flex-col gap-8 lg:gap-10', className)}
    >
      <div className="flex w-full flex-col gap-6 lg:gap-8">
        <h2 className="text-lg-semibold text-black-400 lg:text-2xl-bold">
          리뷰 ({totalCount})
        </h2>

        {totalCount > 0 ? (
          <ReviewRatingChart
            averageRating={averageRating}
            totalCount={totalCount}
            ratingCounts={ratingCounts}
          />
        ) : (
          <p className="rounded-[2rem] bg-background-200 px-6 py-10 text-center text-lg-medium text-gray-400 lg:py-12">
            아직 등록된 리뷰가 없어요.
          </p>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="flex w-full flex-col">
          {reviews.map((review) => (
            <ReviewListItem key={review.id} review={review} />
          ))}
        </div>
      ) : null}

      {showPagination ? (
        <div className="flex w-full justify-center pt-2 lg:pt-4">
          <Pagination
            size="lg"
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  );
};
