'use client';

import ProfileIcon from '@/assets/icons/profile.svg';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cn } from '@/lib/utils';

export interface ReviewMoverSummaryCardProps {
  moverName: string;
  /** 표시용 이사일 (예: '2024. 07. 01') */
  moveDate: string;
  /** 표시용 견적가 (예: '210,000원') */
  quotePrice: string;
  avatarSrc?: string;
  className?: string;
}

/**
 * 리뷰 모달용 기사님 요약 카드 (아바타·이름·이사일·견적가).
 */
export const ReviewMoverSummaryCard = ({
  moverName,
  moveDate,
  quotePrice,
  avatarSrc,
  className = '',
}: ReviewMoverSummaryCardProps) => (
  <div
    className={cn(
      'flex w-full items-center gap-3 rounded-xl border border-line-100 bg-white px-3.5 py-3 shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10 sm:gap-4 sm:rounded-2xl sm:px-[1.125rem] sm:py-6',
      className
    )}
  >
    <div className="size-[2.875rem] shrink-0 overflow-hidden rounded-full sm:size-14">
      {avatarSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- 프로필 CDN 도메인 미확정
        <img src={avatarSrc} alt="" className="size-full object-cover" />
      ) : (
        <ProfileIcon className="size-full" aria-hidden />
      )}
    </div>
    <div className="flex min-w-0 flex-col gap-1.5 sm:gap-4">
      <p className="text-md-semibold text-black-300 sm:text-2xl-semibold">
        {moverName} 기사님
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <InfoField
          label="이사일"
          value={moveDate}
          color="neutral"
          className="gap-1 sm:gap-3"
          labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
          valueClassName="text-md-medium text-black-300 sm:text-2lg-medium"
        />
        <span
          aria-hidden
          className="hidden h-3.5 w-px bg-line-200 sm:block sm:h-4"
        />
        <InfoField
          label="견적가"
          value={quotePrice}
          color="neutral"
          className="gap-1 sm:gap-3"
          labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
          valueClassName="text-md-bold text-black-300 sm:text-2lg-bold"
        />
      </div>
    </div>
  </div>
);
