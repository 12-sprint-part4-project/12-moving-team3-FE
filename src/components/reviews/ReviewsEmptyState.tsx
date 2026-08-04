import Image from 'next/image';

import { cn } from '@/lib/utils';

export interface ReviewsEmptyStateProps {
  message?: string;
  className?: string;
}

/** 리뷰 목록 empty (Figma: img/Component/empty) */
export const ReviewsEmptyState = ({
  message = '작성 가능한 리뷰가 없어요',
  className,
}: ReviewsEmptyStateProps) => (
  <div
    className={cn(
      'flex w-full flex-col items-center justify-center gap-6 py-16 xl:py-20',
      className
    )}
  >
    <Image
      src="/images/empty.svg"
      alt=""
      width={110}
      height={82}
      className="h-[5.125rem] w-[6.875rem]"
    />
    <p className="text-center text-lg-regular text-gray-400">{message}</p>
  </div>
);
