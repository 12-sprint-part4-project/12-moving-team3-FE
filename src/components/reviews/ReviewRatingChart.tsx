'use client';

import { motion, useReducedMotion } from 'framer-motion';

import StarIcon from '@/assets/icons/star.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { getMotionTransition } from '@/lib/motionVariants';
import {
  getReviewScoreBreakdown,
  getReviewStatsTotalCount,
} from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';

import type { ReviewRatingStatistics } from '@/types/review';

export interface ReviewRatingChartProps {
  statistics: ReviewRatingStatistics;
  className?: string;
}

/**
 * 리뷰 별점 통계 차트 (Figma: Component/review-chart).
 * - mobile/tablet: 점수 + 분포 박스(회색 카드)
 * - desktop(xl): 전체를 하나의 회색 라운드 카드로 감쌈
 */
export const ReviewRatingChart = ({
  statistics,
  className,
}: ReviewRatingChartProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const barTransition = getMotionTransition(shouldReduceMotion, {
    duration: 0.45,
    ease: 'easeOut',
  });
  const breakdown = getReviewScoreBreakdown(statistics);
  const total = getReviewStatsTotalCount(statistics);
  const filledStars = Math.min(5, Math.max(0, Math.round(statistics.average)));
  const averageLabel = Number.isFinite(statistics.average)
    ? statistics.average.toFixed(1)
    : '0.0';

  return (
    <div
      className={cn(
        'flex w-full min-w-0 flex-col items-center gap-10',
        'tablet:flex-row tablet:items-center tablet:justify-center tablet:gap-14',
        'xl:gap-[5.1875rem] xl:rounded-[2rem] xl:bg-background-200 xl:px-16 xl:py-10',
        className
      )}
    >
      {/* 평균 점수 */}
      <div className="flex shrink-0 flex-col items-center gap-[0.9375rem]">
        <div className="flex items-end gap-2">
          <p
            className={cn(
              'leading-none font-bold text-black-400',
              'text-[2.5rem] xl:text-[4rem]'
            )}
          >
            {averageLabel}
          </p>
          <div className="flex items-center py-2 xl:py-2.5">
            <p
              className={cn(
                'leading-none font-bold text-gray-100',
                'text-2xl-bold xl:text-[2.375rem]'
              )}
            >
              / 5
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0 xl:gap-px" aria-hidden>
          {Array.from({ length: 5 }, (_, index) => {
            const filled = index < filledStars;
            return (
              <StarIcon
                key={index}
                className={cn(
                  'size-6 xl:size-12',
                  filled ? 'text-yellow-100' : 'text-gray-100'
                )}
              />
            );
          })}
        </div>
        <span className="sr-only">
          {t('reviews.averageRatingSr', { rating: averageLabel })}
        </span>
      </div>

      {/* 점수 분포 — mobile/tablet만 별도 회색 카드, desktop은 바깥 카드에 포함
          좁은 폭에서는 고정 너비 대신 max-w만 써서 바가 줄어들도록 함 */}
      <div
        className={cn(
          'flex w-full max-w-[20.4375rem] min-w-0 flex-col items-stretch justify-center gap-1.5 rounded-3xl bg-background-200 px-[1.125rem] py-4',
          'tablet:min-w-0 tablet:flex-1',
          'xl:max-w-[30.625rem] xl:gap-3.5 xl:rounded-none xl:bg-transparent xl:p-0'
        )}
      >
        {breakdown.map(({ score, count, isMajority }) => {
          const ratio = total > 0 ? count / total : 0;
          const widthPercent =
            count > 0 ? Math.min(100, Math.max(ratio * 100, 3.8)) : 0;

          return (
            <div
              key={score}
              className={cn(
                'flex w-full min-w-0 items-center gap-4',
                'xl:gap-[1.875rem]'
              )}
            >
              <p
                className={cn(
                  'w-9 shrink-0 text-black-300',
                  isMajority
                    ? 'text-md-bold xl:text-xl-bold'
                    : 'text-md-medium xl:text-xl-medium'
                )}
              >
                {t('reviews.scorePoints', { score })}
              </p>
              <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-[0.9375rem] bg-background-300 xl:max-w-[23.125rem]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-[0.9375rem] bg-yellow-100"
                  initial={shouldReduceMotion ? false : { width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={barTransition}
                />
              </div>
              <p
                className={cn(
                  'w-9 shrink-0 text-gray-300 xl:w-11',
                  isMajority
                    ? 'text-md-bold xl:text-xl-bold'
                    : 'text-md-medium xl:text-xl-medium'
                )}
              >
                {count}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
