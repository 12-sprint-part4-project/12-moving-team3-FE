import StarIcon from '@/assets/icons/star.svg';
import { cn } from '@/lib/utils';

export interface ReviewListItemData {
  id: string;
  reviewerName: string;
  createdAt: string;
  rating: number;
  content: string;
}

export interface ReviewListItemProps {
  review: ReviewListItemData;
  className?: string;
}

const MAX_STARS = 5;

/**
 * 리뷰 목록 카드 한 행.
 * Figma Card-list-review lg.
 */
export const ReviewListItem = ({
  review,
  className = '',
}: ReviewListItemProps) => {
  const safeRating = Math.min(
    MAX_STARS,
    Math.max(0, Math.round(review.rating))
  );

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-4 border-b border-line-100 py-6 lg:gap-6 lg:py-8',
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3.5">
          <p className="text-2lg-regular text-black-400">
            {review.reviewerName}
          </p>
          <span aria-hidden className="h-3.5 w-px bg-line-200" />
          <p className="text-2lg-regular text-gray-300">{review.createdAt}</p>
        </div>
        <div
          className="flex items-center"
          role="img"
          aria-label={`${safeRating}점`}
        >
          {Array.from({ length: MAX_STARS }, (_, index) => {
            const isFilled = index < safeRating;
            return (
              <StarIcon
                key={index}
                className={cn(
                  'size-5 shrink-0',
                  isFilled ? 'text-yellow-100' : 'text-gray-100'
                )}
                aria-hidden
              />
            );
          })}
        </div>
      </div>
      <p className="text-2lg-regular whitespace-pre-wrap text-black-300">
        {review.content}
      </p>
    </article>
  );
};
