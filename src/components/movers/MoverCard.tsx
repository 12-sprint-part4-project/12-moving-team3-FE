'use client';

import { useRouter } from 'next/navigation';
import type { KeyboardEvent, MouseEvent } from 'react';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import StarIcon from '@/assets/icons/star.svg';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';

import { cn } from '@/lib/utils';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';
import type { ApiMoveType, MoverCardModel } from '@/types/mover';

export type MoverCardSize = 'lg' | 'sm';

export interface MoverCardProps {
  mover: MoverCardModel;
  size?: MoverCardSize;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  /** true면 상세 이동 비활성 (이미 상세 페이지일 때) */
  disableNavigation?: boolean;
  className?: string;
}

/**
 * 기사님 목록 카드 (Figma Card-list/기사님 찾기).
 * 클릭 시 `/movers/:id` 로 이동 (disableNavigation 제외).
 */
export const MoverCard = ({
  mover,
  size = 'lg',
  onFavoriteClick,
  disableNavigation = false,
  className = '',
}: MoverCardProps) => {
  const router = useRouter();
  const isCompact = size === 'sm';
  const ratingLabel =
    mover.averageRating === null ? '-' : mover.averageRating.toFixed(1);
  const careerLabel = mover.career === null ? '-' : `${mover.career}년`;
  const description =
    mover.shortDescription?.trim() || '등록된 한 줄 소개가 없습니다.';

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    event.preventDefault();
    onFavoriteClick?.(mover.moverId, !mover.isFavorited);
  };

  const handleCardActivate = () => {
    if (disableNavigation) {
      return;
    }
    router.push(`/movers/${mover.moverId}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disableNavigation) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardActivate();
    }
  };

  return (
    <div
      role={disableNavigation ? undefined : 'button'}
      tabIndex={disableNavigation ? undefined : 0}
      onClick={handleCardActivate}
      onKeyDown={handleCardKeyDown}
      className={cn(
        'flex w-full flex-col border border-line-100 bg-white shadow-request-card transition-colors',
        !disableNavigation && 'cursor-pointer hover:border-blue-200',
        isCompact
          ? 'gap-3 rounded-2xl px-4 py-4'
          : 'gap-4 rounded-2xl px-6 py-5',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {mover.services.length > 0 ? (
          mover.services.map((service: ApiMoveType) => (
            <MoveTypeChip
              key={service}
              type={API_MOVE_TYPE_TO_UI[service]}
              size="sm"
            />
          ))
        ) : (
          <span className="text-md-medium text-gray-300">서비스 미등록</span>
        )}
        {mover.isDesignated ? (
          <MoveTypeChip type="designated" size="sm" />
        ) : null}
      </div>

      {!isCompact ? (
        <p className="text-xl-semibold text-black-300 sm:text-2xl-semibold">
          {description}
        </p>
      ) : null}

      <div
        className={cn(
          'flex w-full items-start border border-line-100 bg-white shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10',
          isCompact
            ? 'gap-3 rounded-md px-3 py-3'
            : 'gap-4 rounded-md px-[1.125rem] py-4'
        )}
      >
        <div
          className={cn(
            'shrink-0 overflow-hidden rounded-full',
            isCompact ? 'size-10' : 'size-14'
          )}
        >
          {mover.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- CDN 도메인 미확정
            <img
              src={mover.profileImageUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <ProfileIcon className="size-full" aria-hidden />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">
          <p
            className={cn(
              'text-black-300',
              isCompact ? 'text-lg-semibold' : 'text-2lg-semibold'
            )}
          >
            {mover.nickname} 기사님
          </p>
          <div
            className={cn(
              'flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4',
              isCompact ? 'text-md-medium' : 'text-lg-medium'
            )}
          >
            <span className="inline-flex items-center gap-1.5">
              <StarIcon
                className={cn(
                  'shrink-0 text-yellow-100',
                  isCompact ? 'size-5' : 'size-6'
                )}
                aria-hidden
              />
              <span className="text-black-300">{ratingLabel}</span>
              <span className="text-gray-300">({mover.reviewCount})</span>
            </span>
            {!isCompact ? (
              <>
                <span
                  aria-hidden
                  className="hidden h-3.5 w-px bg-line-200 sm:block"
                />
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-gray-300">경력</span>
                  <span className="text-black-300">{careerLabel}</span>
                </span>
                <span
                  aria-hidden
                  className="hidden h-3.5 w-px bg-line-200 sm:block"
                />
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-black-300">
                    {mover.confirmedCount}건
                  </span>
                  <span className="text-gray-300">확정</span>
                </span>
              </>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={mover.isFavorited ? '찜 취소' : '찜하기'}
          aria-pressed={mover.isFavorited}
          className="flex shrink-0 items-center gap-1 text-2lg-medium text-blue-400"
        >
          <LikeActiveIcon
            className={cn(
              'size-6',
              mover.isFavorited ? 'text-blue-400' : 'text-gray-200'
            )}
            aria-hidden
          />
          <span className="text-black-400 sm:text-2lg-medium">
            {mover.favoritedCount}
          </span>
        </button>
      </div>
    </div>
  );
};
