'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { forwardRef } from 'react';

import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cardHover } from '@/lib/motionVariants';
import {
  formatReviewCreatedDate,
  formatReviewMoveDate,
} from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';

import type { CustomerReviewItem } from '@/types/review';

export interface WrittenReviewCardProps {
  item: CustomerReviewItem;
  onClick: (item: CustomerReviewItem) => void;
  /** 방금 등록한 리뷰 강조 */
  highlighted?: boolean;
  className?: string;
}

/**
 * 내가 작성한 리뷰 카드 (Figma: Card-list/내가 작성한 리뷰).
 * 클릭 시 상세 모달을 연다.
 */
export const WrittenReviewCard = forwardRef<
  HTMLButtonElement,
  WrittenReviewCardProps
>(function WrittenReviewCard(
  { item, onClick, highlighted = false, className },
  ref
) {
  const quote = item.quote;
  const moveTypeUi = quote?.moveType
    ? API_MOVE_TYPE_TO_UI[quote.moveType]
    : null;
  const isDesignated = quote?.isDesignated ?? false;
  const moverName = item.mover?.name?.trim() || '기사';
  const avatarSrc = item.mover?.profileImageUrl ?? undefined;
  const moveDateLabel = formatReviewMoveDate(quote?.moveDate ?? null);
  const priceLabel = formatQuotePriceLabel(quote?.price ?? null);
  const createdLabel = formatReviewMoveDate(
    formatReviewCreatedDate(item.createdAt)
  );
  const safeRating = Math.min(5, Math.max(0, Math.round(item.rating)));
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onClick(item)}
      {...(shouldReduceMotion ? {} : cardHover)}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
      className={cn(
        'flex w-full cursor-pointer flex-col rounded-2xl bg-white text-left shadow-[0.125rem_0.125rem_0.3125rem] shadow-shadow-gray-100/20 transition-[box-shadow,background-color] duration-700 hover:shadow-[0.125rem_0.125rem_0.5rem] hover:shadow-shadow-gray-200/25',
        'gap-2.5 px-3.5 pt-4 pb-2.5',
        'xl:gap-8 xl:rounded-3xl xl:px-6 xl:py-8 xl:shadow-[0.25rem_0.25rem_0.3125rem] xl:shadow-shadow-gray-100/20',
        highlighted && 'bg-blue-50 ring-2 ring-blue-300 ring-offset-2',
        className
      )}
    >
      <div className="flex w-full flex-col gap-2.5 xl:gap-6">
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 xl:gap-3">
            {moveTypeUi ? (
              <>
                <div className="contents xl:hidden">
                  <MoveTypeChip type={moveTypeUi} size="sm" />
                </div>
                <div className="hidden xl:contents">
                  <MoveTypeChip type={moveTypeUi} size="md" />
                </div>
              </>
            ) : null}
            {isDesignated ? (
              <>
                <div className="contents xl:hidden">
                  <MoveTypeChip type="designated" size="sm" />
                </div>
                <div className="hidden xl:contents">
                  <MoveTypeChip type="designated" size="md" />
                </div>
              </>
            ) : null}
          </div>
          <p className="hidden shrink-0 items-center gap-2 text-2lg-regular text-gray-300 xl:flex">
            <span>작성일</span>
            <span>{createdLabel}</span>
          </p>
        </div>

        <div
          className={cn(
            'flex w-full items-start gap-3 rounded-md bg-white py-1',
            'xl:items-center xl:gap-6 xl:border xl:border-line-100 xl:px-[1.125rem] xl:py-4 xl:shadow-[0.25rem_0.25rem_0.5rem] xl:shadow-shadow-gray-100/10'
          )}
        >
          <div className="relative size-[2.875rem] shrink-0 overflow-hidden rounded-full xl:size-24">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt=""
                fill
                sizes="(min-width: 80rem) 96px, 46px"
                className="object-cover"
              />
            ) : (
              <ProfileIcon className="size-full" aria-hidden />
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5 xl:gap-2">
            <p className="text-md-semibold text-black-300 xl:text-2xl-semibold">
              {moverName} 기사님
            </p>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 xl:gap-4">
              <div className="flex items-center gap-1.5 xl:gap-3">
                <span className="text-sm-medium text-gray-300 xl:text-xl-regular xl:text-gray-500">
                  이사일
                </span>
                <span className="text-sm-medium text-black-300 xl:text-xl-medium xl:text-black-400">
                  {moveDateLabel}
                </span>
              </div>
              <span
                aria-hidden
                className="hidden h-3.5 w-px bg-line-200 tablet:block xl:h-4"
              />
              <div className="flex items-center gap-1.5 xl:gap-3">
                <span className="text-sm-medium text-gray-300 xl:text-xl-regular xl:text-gray-500">
                  견적가
                </span>
                <span className="text-sm-medium text-black-300 xl:text-xl-medium xl:text-black-400">
                  {priceLabel}
                </span>
              </div>
            </div>
            <div
              className="hidden items-center xl:flex"
              aria-label={`${safeRating}점`}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon
                  key={index}
                  className={cn(
                    'size-6',
                    index < safeRating ? 'text-yellow-100' : 'text-gray-100'
                  )}
                  aria-hidden
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-line-100 xl:hidden" />

      <p className="line-clamp-2 w-full text-md-regular text-gray-500 xl:line-clamp-2 xl:text-xl-regular">
        {item.content}
      </p>

      <div className="flex w-full justify-end xl:hidden">
        <p className="flex items-center gap-1.5 text-xs-regular text-gray-300">
          <span>작성일</span>
          <span>{createdLabel}</span>
        </p>
      </div>
    </motion.button>
  );
});
