import Image from 'next/image';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { cn } from '@/lib/utils';
import type { CustomerQuoteMoverViewModel } from '@/types/customerQuote';

export interface MoverQuoteProfileProps {
  mover: CustomerQuoteMoverViewModel;
  className?: string;
}

/** 고객 견적 카드/상세용 기사님 프로필 블록 */
export const MoverQuoteProfile = ({
  mover,
  className = '',
}: MoverQuoteProfileProps) => (
  <div
    className={cn(
      'flex w-full items-start gap-3 rounded-md border border-line-100 bg-white px-3.5 py-4 shadow-request-card-body lg:gap-6 lg:px-[1.125rem] lg:py-4',
      className
    )}
  >
    <div className="relative size-12 shrink-0 overflow-hidden rounded-full lg:size-14">
      {mover.profileImageUrl ? (
        <Image
          src={mover.profileImageUrl}
          alt={`${mover.nickname} 기사님 프로필`}
          fill
          sizes="(min-width: 1024px) 56px, 48px"
          className="object-cover"
        />
      ) : (
        <ProfileIcon className="size-full text-gray-200" aria-hidden />
      )}
    </div>

    <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg-semibold text-black-300 lg:text-2lg-semibold">
          {mover.nickname}
          <span className="ml-1 lg:ml-2">기사님</span>
        </h3>
        <div
          className="flex shrink-0 items-center gap-1"
          aria-label={`찜 ${mover.favoriteCountLabel}`}
        >
          <LikeActiveIcon
            className={cn(
              'size-5 lg:size-6',
              mover.isFavorited ? 'text-blue-400' : 'text-gray-200'
            )}
            aria-hidden
          />
          <span className="text-lg-medium text-blue-400 lg:text-2lg-medium">
            {mover.favoriteCountLabel}
          </span>
        </div>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 lg:gap-x-4">
        <div className="flex items-center gap-0.5 lg:gap-1.5">
          <StarIcon className="size-5 text-yellow-100 lg:size-6" aria-hidden />
          <span className="text-md-medium text-black-300 lg:text-lg-medium">
            {mover.ratingLabel}
          </span>
          <span className="text-md-medium text-gray-300 lg:text-lg-medium">
            {mover.reviewCountLabel}
          </span>
        </div>

        {mover.careerLabel ? (
          <>
            <span aria-hidden className="h-3.5 w-px bg-line-200" />
            <p className="text-md-medium lg:text-lg-medium">
              <span className="text-gray-300">경력 </span>
              <span className="text-black-300">{mover.careerLabel}</span>
            </p>
          </>
        ) : null}

        <span aria-hidden className="h-3.5 w-px bg-line-200" />
        <p className="text-md-medium lg:text-lg-medium">
          <span className="text-black-300">{mover.confirmedCountLabel}</span>
          <span className="text-gray-300"> 확정</span>
        </p>
      </div>
    </div>
  </div>
);
