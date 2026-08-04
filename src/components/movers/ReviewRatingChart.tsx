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
 * Figma Component/review-chart lg — 평균 점수 + 점수별 분포 바.
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
        'flex w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-background-200 px-6 py-8 md:px-10 lg:px-16 lg:py-10',
        className
      )}
    >
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row lg:justify-center lg:gap-[5.1875rem]">
        <div className="flex flex-col items-center gap-[0.9375rem]">
          <div className="flex items-end gap-2">
            <p className="text-3xl-bold text-black-400">{ratingLabel}</p>
            <p className="pb-1 text-2xl-bold text-gray-100">/ 5</p>
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
                    'size-10 shrink-0 lg:size-12',
                    isFilled ? 'text-yellow-100' : 'text-gray-100'
                  )}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>

        <div className="flex w-full max-w-[30rem] flex-col gap-3.5 lg:w-auto lg:max-w-none">
          {RATING_SCORES.map((score) => {
            const count = ratingCounts[score];
            const ratio = getRatingRatio(count, totalCount);
            const isMajority = maxCount > 0 && count === maxCount;

            return (
              <div
                key={score}
                className="flex w-full items-center gap-4 lg:gap-[1.875rem]"
              >
                <p
                  className={cn(
                    'w-9 shrink-0 text-black-300',
                    isMajority ? 'text-xl-bold' : 'text-xl-medium'
                  )}
                >
                  {score}점
                </p>
                <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-[0.9375rem] bg-background-300 lg:w-[23.125rem] lg:flex-none">
                  <div
                    className="absolute inset-y-0 left-0 rounded-[0.9375rem] bg-yellow-100"
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
                <p
                  className={cn(
                    'w-11 shrink-0 text-gray-300',
                    isMajority ? 'text-xl-bold' : 'text-xl-medium'
                  )}
                >
                  {count}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
