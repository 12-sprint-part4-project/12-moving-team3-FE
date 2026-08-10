'use client';

import Image from 'next/image';

import ProfileIcon from '@/assets/icons/profile.svg';
import { Button } from '@/components/Button/Button';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';
import type { WritableQuoteItem } from '@/types/review';

export interface WritableReviewCardProps {
  item: WritableQuoteItem;
  onWriteClick: (item: WritableQuoteItem) => void;
  className?: string;
}

/**
 * 작성 가능한 리뷰 카드 (Figma: Card-list/작성 가능한 리뷰).
 */
export const WritableReviewCard = ({
  item,
  onWriteClick,
  className,
}: WritableReviewCardProps) => {
  const moveTypeUi = item.moveType
    ? API_MOVE_TYPE_TO_UI[item.moveType]
    : null;
  const moverName = item.mover?.name?.trim() || '기사';
  const avatarSrc = item.mover?.profileImageUrl ?? undefined;
  const moveDateLabel = formatReviewMoveDate(item.moveDate);
  const priceLabel = formatQuotePriceLabel(item.price);

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-3.5 rounded-2xl bg-white px-5 pt-5 pb-3.5 shadow-[0.125rem_0.125rem_0.3125rem] shadow-shadow-gray-100/20',
        'xl:gap-8 xl:rounded-3xl xl:px-6 xl:py-8',
        className
      )}
    >
      <div className="flex flex-col gap-3.5 xl:gap-6">
        {(moveTypeUi || item.isDesignated) && (
          <div className="flex flex-wrap items-center gap-2 xl:gap-3">
            {moveTypeUi ? (
              <>
                <span className="contents xl:hidden">
                  <MoveTypeChip type={moveTypeUi} size="sm" />
                </span>
                <span className="hidden xl:contents">
                  <MoveTypeChip type={moveTypeUi} size="md" />
                </span>
              </>
            ) : null}
            {item.isDesignated ? (
              <>
                <span className="contents xl:hidden">
                  <MoveTypeChip type="designated" size="sm" />
                </span>
                <span className="hidden xl:contents">
                  <MoveTypeChip type="designated" size="md" />
                </span>
              </>
            ) : null}
          </div>
        )}

        <div
          className={cn(
            'flex w-full items-center gap-4 rounded-md bg-white px-2 py-2.5 shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-100/10',
            'xl:gap-6 xl:border xl:border-line-100 xl:px-[1.125rem] xl:py-4 xl:shadow-[0.25rem_0.25rem_0.5rem] xl:shadow-shadow-gray-100/10'
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

          <div className="flex min-w-0 flex-1 flex-col gap-1.5 xl:gap-4">
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
                className="hidden h-3.5 w-px bg-line-200 sm:block xl:h-4"
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
          </div>
        </div>
      </div>

      <div className="contents xl:hidden">
        <Button
          type="button"
          variant="solid"
          size="sm"
          className="rounded-lg"
          onClick={() => onWriteClick(item)}
        >
          리뷰 작성하기
        </Button>
      </div>
      <div className="hidden xl:contents">
        <Button
          type="button"
          variant="solid"
          size="md"
          className="rounded-2xl"
          onClick={() => onWriteClick(item)}
        >
          리뷰 작성하기
        </Button>
      </div>
    </article>
  );
};
