'use client';

import Image from 'next/image';

import ProfileIcon from '@/assets/icons/profile.svg';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { useTranslation } from '@/i18n/useTranslation';
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
}: ReviewMoverSummaryCardProps) => {
  const { t } = useTranslation();

  return (
  <div
    className={cn(
      'flex w-full items-center gap-3 rounded-xl border border-line-100 bg-white px-3.5 py-3 shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10 tablet:gap-4 tablet:rounded-2xl tablet:px-[1.125rem] tablet:py-6',
      className
    )}
  >
    <div className="relative size-[2.875rem] shrink-0 overflow-hidden rounded-full tablet:size-14">
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt=""
          fill
          sizes="(min-width: 46.5rem) 56px, 46px"
          className="object-cover"
        />
      ) : (
        <ProfileIcon className="size-full" aria-hidden />
      )}
    </div>
    <div className="flex min-w-0 flex-col gap-1.5 tablet:gap-4">
      <p className="text-md-semibold text-black-300 tablet:text-2xl-semibold">
        {t('reviews.moverWithSuffix', { name: moverName })}
      </p>
      <div className="flex flex-wrap items-center gap-2 tablet:gap-4">
        <InfoField
          label={t('quotes.moveDate')}
          value={moveDate}
          color="neutral"
          className="gap-1 tablet:gap-3"
          labelClassName="px-1.5 py-0.5 text-md-medium tablet:py-1 tablet:text-2lg-regular"
          valueClassName="text-md-medium text-black-300 tablet:text-2lg-medium"
        />
        <span
          aria-hidden
          className="hidden h-3.5 w-px bg-line-200 tablet:block tablet:h-4"
        />
        <InfoField
          label={t('quotes.priceAmount')}
          value={quotePrice}
          color="neutral"
          className="gap-1 tablet:gap-3"
          labelClassName="px-1.5 py-0.5 text-md-medium tablet:py-1 tablet:text-2lg-regular"
        />
      </div>
    </div>
  </div>
  );
};
