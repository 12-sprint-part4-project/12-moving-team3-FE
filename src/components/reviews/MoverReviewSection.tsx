'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { ReviewListItem } from '@/components/reviews/ReviewListItem';
import { ReviewRatingChart } from '@/components/reviews/ReviewRatingChart';
import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useTranslation } from '@/i18n/useTranslation';
import {
  fadeIn,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type {
  MoverPublicReviewItem,
  ReviewRatingStatistics,
} from '@/types/review';

const EMPTY_RATING_STATISTICS: ReviewRatingStatistics = {
  average: 0,
  five: 0,
  four: 0,
  three: 0,
  two: 0,
  one: 0,
};

export interface MoverReviewSectionProps {
  reviews: MoverPublicReviewItem[];
  ratingStatistics?: ReviewRatingStatistics;
  totalCount: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isPending?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * 기사 상세·마이페이지 공통 리뷰 섹션.
 * 제목 + 통계 차트 + 목록(또는 empty 문구) + 페이지네이션.
 */
export const MoverReviewSection = ({
  reviews,
  ratingStatistics,
  totalCount,
  page,
  totalPages,
  onPageChange,
  isPending = false,
  isFetching = false,
  isError = false,
  onRetry,
  className,
}: MoverReviewSectionProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const isInitialLoading =
    isPending && !ratingStatistics && reviews.length === 0;
  const hasLoadedData = Boolean(ratingStatistics) || reviews.length > 0;
  /** 이전 데이터가 없을 때만 에러 UI가 본문 전체를 대체한다 */
  const isInitialError = isError && !hasLoadedData;
  const isEmpty = !isPending && totalCount === 0;
  const statistics = ratingStatistics ?? EMPTY_RATING_STATISTICS;
  const showListFetching = isFetching && !isPending && reviews.length > 0;
  const shouldAnimateList = !showListFetching;

  return (
    <section className={cn('flex w-full flex-col gap-4 xl:gap-8', className)}>
      <h2 className="text-lg-semibold text-black-400 xl:text-2xl-semibold">
        {t('reviews.sectionTitle', { count: totalCount })}
      </h2>

      {isInitialLoading ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
        >
          <Spinner message={t('reviews.loading')} />
        </motion.div>
      ) : null}

      {isInitialError ? (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="show"
          transition={motionTransition}
          className="flex flex-col items-start gap-3 py-6"
        >
          <p className="text-md-medium text-gray-400">
            {t('reviews.loadError')}
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-md-semibold text-blue-300 underline"
            >
              {t('common.retry')}
            </button>
          ) : null}
        </motion.div>
      ) : null}

      {!isInitialLoading && !isInitialError ? (
        <div className="flex flex-col gap-10">
          {isError ? (
            <div className="flex flex-col items-start gap-3">
              <p className="text-md-medium text-gray-400">
                {t('reviews.loadError')}
              </p>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  className="text-md-semibold text-blue-300 underline"
                >
                  {t('common.retry')}
                </button>
              ) : null}
            </div>
          ) : null}

          <ReviewRatingChart statistics={statistics} />

          {isEmpty ? (
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="show"
              transition={motionTransition}
              className="py-8 text-center text-md-medium text-gray-400"
            >
              {t('reviews.emptyPublic')}
            </motion.p>
          ) : (
            <motion.div
              key={shouldAnimateList ? page : 'mover-reviews'}
              variants={shouldAnimateList ? listStagger : undefined}
              initial={shouldAnimateList ? 'hidden' : false}
              animate={shouldAnimateList ? 'show' : undefined}
              className="flex flex-col"
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  variants={fadeUp}
                  transition={motionTransition}
                >
                  <ReviewListItem
                    customerName={review.customer.nickname}
                    createdAt={review.createdAt}
                    rating={review.rating}
                    content={review.content}
                    reviewId={review.id}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="show"
            transition={motionTransition}
            className="flex justify-center pt-2"
          >
            <Pagination
              size="sm"
              page={page}
              totalPages={Math.max(1, totalPages)}
              onPageChange={onPageChange}
            />
          </motion.div>
        </div>
      ) : null}
    </section>
  );
};
