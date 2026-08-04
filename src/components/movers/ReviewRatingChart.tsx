import StarIcon from '@/assets/icons/star.svg';
import { cn } from '@/lib/utils';
import type { ReviewRatingCounts } from '@/types/mover';

export interface ReviewRatingChartProps {
  averageRating: number | null;
  totalCount: number;
  ratingCounts: ReviewRatingCounts;
  className?: string;
}

const RATING_SCORES = [5, 4, 3, 2, 1] as const;

/** 평점 분포 비율(0~1) — totalCount 0이면 0 */
const getRatingRatio = (count: number, totalCount: number): number => {
  if (totalCount <= 0 || count <= 0) {
    return 0;
  }
  return Math.min(1, count / totalCount);
};

/**
 * 리뷰 평점 요약 차트.
 * Figma Component/review-chart — Mobile·Tablet(md) · Desktop(lg).
 */
export const ReviewRatingChart = ({
  averageRating,
  totalCount,
  ratingCounts,
  className = '',
}: ReviewRatingChartProps) => {
  const ratingLabel =
    averageRating === null ? '-' : averageRating.toFixed(1);
  const filledStars =
    averageRating === null
      ? 0
      : Math.min(5, Math.max(0, Math.round(averageRating)));
  const maxCount = Math.max(
    ratingCounts[1],
    ratingCounts[2],
    ratingCounts[3],
    ratingCounts[4],
    ratingCounts[5],
    0
  );

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-[2rem] bg-background-200 px-6 py-8',
        'md:flex-row md:gap-14 md:rounded-none md:bg-transparent md:px-0 md:py-0',
        'lg:gap-[5.1875rem] lg:rounded-[2rem] lg:bg-background-200 lg:px-16 lg:py-10',
        className
      )}
    >
      <div className="flex flex-col items-center gap-[0.9375rem]">
        <div className="flex items-end gap-2">
          <p className="text-3xl-bold text-black-400">{ratingLabel}</p>
          <p className="pb-1 text-2xl-bold text-gray-100 md:pb-2 md:text-2xl-bold lg:pb-1">
            / 5
          </p>
        </div>
        <div
          className="flex items-center"
          role="img"
          aria-label={`평균 별점 ${ratingLabel}점`}
        >
          {Array.from({ length: 5 }, (_, index) => {
            const isFilled = index < filledStars;
            return (
              <StarIcon
                key={index}
                className={cn(
                  'size-6 shrink-0 md:size-6 lg:size-12',
                  isFilled ? 'text-yellow-100' : 'text-gray-100'
                )}
                aria-hidden
              />
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          'flex w-full max-w-[30rem] flex-col gap-3.5',
          'md:w-[20.4375rem] md:max-w-none md:gap-1.5 md:rounded-3xl md:bg-background-200 md:px-[1.125rem] md:py-4',
          'lg:w-auto lg:gap-3.5 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0'
        )}
      >
        {RATING_SCORES.map((score) => {
          const count = ratingCounts[score];
          const ratio = getRatingRatio(count, totalCount);
          const isMajority = maxCount > 0 && count === maxCount;

          return (
            <div
              key={score}
              className="flex w-full items-center gap-4 md:gap-4 lg:gap-[1.875rem]"
            >
              <p
                className={cn(
                  'w-9 shrink-0 text-black-300',
                  isMajority
                    ? 'text-md-bold md:text-md-bold lg:text-xl-bold'
                    : 'text-md-medium md:text-md-medium lg:text-xl-medium'
                )}
              >
                {score}점
              </p>
              <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-[0.9375rem] bg-background-300 md:w-[11.25rem] md:flex-none lg:w-[23.125rem]">
                <div
                  className="absolute inset-y-0 left-0 rounded-[0.9375rem] bg-yellow-100"
                  style={{ width: `${ratio * 100}%` }}
                />
              </div>
              <p
                className={cn(
                  'w-9 shrink-0 text-gray-300 md:w-9 lg:w-11',
                  isMajority
                    ? 'text-md-bold md:text-md-bold lg:text-xl-bold'
                    : 'text-md-medium md:text-md-medium lg:text-xl-medium'
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
