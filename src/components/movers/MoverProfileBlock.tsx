'use client';

import Image from 'next/image';
import Link from 'next/link';

import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { FavoriteButton } from '@/components/Favorite';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { MoverCardModel } from '@/types/mover';
import type { MouseEvent } from 'react';

export interface MoverProfileBlockProps {
  mover: MoverCardModel;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isFavoritePending?: boolean;
  /** true면 닉네임 상세 링크 비활성 */
  disableNavigation?: boolean;
  className?: string;
}

/**
 * 견적 카드/상세용 기사님 프로필 블록
 */
export const MoverProfileBlock = ({
  mover,
  onFavoriteClick,
  isFavoritePending = false,
  disableNavigation = true,
  className = '',
}: MoverProfileBlockProps) => {
  const { t } = useTranslation();
  const ratingLabel =
    mover.averageRating === null ? '-' : mover.averageRating.toFixed(1);
  const careerLabel =
    mover.career === null
      ? null
      : t('movers.careerYears', { count: mover.career });
  const confirmedLabel =
    mover.confirmedCount === null
      ? '-'
      : t('movers.confirmedCount', { count: mover.confirmedCount });
  const profileAlt = t('movers.profileAlt', { name: mover.name });

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onFavoriteClick?.(mover.moverId, !mover.isFavorited);
  };

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-md border border-line-100 bg-white px-3.5 py-4 shadow-request-card-body lg:gap-6 lg:px-4.5 lg:py-4',
        className
      )}
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-full lg:size-14">
        {mover.profileImageUrl ? (
          <Image
            src={mover.profileImageUrl}
            alt={profileAlt}
            fill
            sizes="(min-width: 64rem) 56px, 48px"
            className="object-cover"
          />
        ) : (
          <ProfileIcon className="size-full text-gray-200" aria-hidden />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
        <div className="flex items-start justify-between gap-2">
          {disableNavigation ? (
            <p className="text-lg-semibold text-black-300 lg:text-2lg-semibold">
              {mover.name}
              <span className="ml-1 lg:ml-2">기사님</span>
            </p>
          ) : (
            <Link
              href={`/movers/${mover.moverId}`}
              className="text-lg-semibold text-black-300 lg:text-2lg-semibold"
            >
              {mover.name}
              <span className="ml-1 lg:ml-2">기사님</span>
            </Link>
          )}

          <FavoriteButton
            variant="count"
            isFavorited={mover.isFavorited}
            favoritedCount={mover.favoritedCount}
            isPending={isFavoritePending}
            onClick={handleFavoriteClick}
            className="text-lg-medium lg:text-2lg-medium"
            iconClassName="size-5 lg:size-6"
            countClassName="text-blue-400"
          />
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-md-medium lg:gap-x-4 lg:text-lg-medium">
          <span className="inline-flex items-center gap-0.5 lg:gap-1.5">
            <StarIcon
              className="size-5 shrink-0 text-yellow-100 lg:size-6"
              aria-hidden
            />
            <span className="text-black-300">{ratingLabel}</span>
            <span className="text-gray-300">
              ({mover.reviewCount.toLocaleString('ko-KR')})
            </span>
          </span>

          {careerLabel ? (
            <>
              <span aria-hidden className="h-3.5 w-px bg-line-200" />
              <span className="inline-flex items-center gap-1.5">
                <span className="text-gray-300">경력</span>
                <span className="text-black-300">{careerLabel}</span>
              </span>
            </>
          ) : null}

          <span aria-hidden className="h-3.5 w-px bg-line-200" />
          <span className="inline-flex items-center gap-1.5">
            <span className="text-black-300">{confirmedLabel}</span>
            <span className="text-gray-300">확정</span>
          </span>
        </div>
      </div>
    </div>
  );
};
