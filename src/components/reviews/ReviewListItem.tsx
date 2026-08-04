'use client';

import StarIcon from '@/assets/icons/star.svg';
import { formatReviewCreatedDate, maskReviewerName } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { ReportAction } from '@/components/reports';

export interface ReviewListItemProps {
  customerName: string;
  createdAt: string;
  rating: number;
  content: string;
  className?: string;
  reviewId: number;
}

/**
 * 리뷰 목록 한 행 (Figma: Card-list-review).
 */
export const ReviewListItem = ({
  customerName,
  createdAt,
  rating,
  content,
  className,
  reviewId,
}: ReviewListItemProps) => {
  const safeRating = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <article
      className={cn(
        'flex w-full flex-col items-start gap-4 border-b border-line-100 py-8',
        className
      )}
    >
      <div className="flex w-full justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-3">
            <p className="text-md-regular text-black-400">
              {maskReviewerName(customerName)}
            </p>
            <span aria-hidden className="h-3 w-px bg-line-200" />
            <p className="text-md-regular text-gray-300">
              {formatReviewCreatedDate(createdAt)}
            </p>
          </div>
          <div className="flex items-start" aria-label={`${safeRating}점`}>
            {Array.from({ length: 5 }, (_, index) => {
              const filled = index < safeRating;
              return (
                <StarIcon
                  key={index}
                  className={cn(
                    'size-5',
                    filled ? 'text-yellow-100' : 'text-gray-100'
                  )}
                  aria-hidden
                />
              );
            })}
          </div>
        </div>
        <ReportAction target="REVIEW" targetId={String(reviewId)} />
      </div>
      <p className="w-full text-md-regular whitespace-pre-wrap text-black-300">
        {content}
      </p>
    </article>
  );
};
