'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { MouseEvent } from 'react';

export type FavoriteButtonVariant = 'count' | 'labeled' | 'icon-only';

export interface FavoriteButtonProps {
  isFavorited: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  /** 찜 요청 진행 중 — 시각적 busy 표시 */
  isPending?: boolean;
  /** count 변형에서 표시할 찜 수. null이면 숫자 숨김 */
  favoritedCount?: number | null;
  variant?: FavoriteButtonVariant;
  className?: string;
  iconClassName?: string;
  countClassName?: string;
}

const ICON_COLOR = {
  favorited: 'text-red-200',
  idle: 'text-blue-400',
} as const;

/**
 * 기사님 찜 버튼.
 * - count: 아이콘 + 찜 수 (카드/프로필)
 * - labeled: 아이콘 + 「기사님 찜하기/취소」 (상세 사이드바·풀폭)
 * - icon-only: 테두리 정사각 아이콘만 (하단 바)
 */
export const FavoriteButton = ({
  isFavorited,
  onClick,
  isPending = false,
  favoritedCount = null,
  variant = 'count',
  className = '',
  iconClassName = '',
  countClassName = '',
}: FavoriteButtonProps) => {
  const { t } = useTranslation();
  const iconColorClass = isFavorited ? ICON_COLOR.favorited : ICON_COLOR.idle;
  const shortLabel = isFavorited
    ? t('movers.favorite.remove')
    : t('movers.favorite.add');
  const longLabel = isFavorited
    ? t('movers.favorite.removeMover')
    : t('movers.favorite.addMover');

  if (variant === 'icon-only') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={longLabel}
        aria-pressed={isFavorited}
        aria-busy={isPending}
        className={cn(
          'inline-flex size-[3.375rem] shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-line-200 bg-white',
          isPending && 'opacity-60',
          className
        )}
      >
        <LikeActiveIcon
          className={cn('size-6', iconColorClass, iconClassName)}
          aria-hidden
        />
      </button>
    );
  }

  if (variant === 'labeled') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={longLabel}
        aria-pressed={isFavorited}
        aria-busy={isPending}
        className={cn(
          'inline-flex h-[3.375rem] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-200 bg-white text-xl-semibold text-black-400 transition-colors hover:border-blue-200',
          isPending && 'opacity-60',
          className
        )}
      >
        <LikeActiveIcon
          className={cn('size-6 shrink-0', iconColorClass, iconClassName)}
          aria-hidden
        />
        {longLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={shortLabel}
      aria-pressed={isFavorited}
      aria-busy={isPending}
      className={cn(
        'relative z-10 flex shrink-0 cursor-pointer items-center gap-1 text-2lg-medium text-blue-400',
        isPending && 'opacity-60',
        className
      )}
    >
      <LikeActiveIcon
        className={cn('size-6', iconColorClass, iconClassName)}
        aria-hidden
      />
      {favoritedCount !== null ? (
        <span className={cn('text-black-400', countClassName)}>
          {favoritedCount.toLocaleString('ko-KR')}
        </span>
      ) : null}
    </button>
  );
};
