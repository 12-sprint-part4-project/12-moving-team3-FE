'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface MoverDetailBottomBarProps {
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  /** false면 지정 견적 버튼 숨김 (기사 로그인 등) */
  showDesignatedCta?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  isDesignatedStatusLoading?: boolean;
  className?: string;
}

const getDesignatedButtonLabel = (
  isAlreadyDesignated: boolean,
  isDesignatedPending: boolean
): string => {
  if (isAlreadyDesignated) {
    return '지정 견적 요청 완료';
  }
  if (isDesignatedPending) {
    return '요청 중...';
  }
  return '지정 견적 요청하기';
};

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  showDesignatedCta = true,
  onDesignatedQuoteClick,
  isDesignatedPending = false,
  isAlreadyDesignated = false,
  isDesignatedStatusLoading = false,
  className = '',
}: MoverDetailBottomBarProps) => {
  const isDesignatedDisabled =
    isDesignatedPending || isAlreadyDesignated || isDesignatedStatusLoading;

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] xl:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        {showDesignatedCta ? (
          <>
            <button
              type="button"
              onClick={onFavoriteClick}
              aria-label={isFavorited ? '기사님 찜 취소' : '기사님 찜하기'}
              aria-pressed={isFavorited}
              aria-busy={isFavoritePending}
              className={cn(
                'inline-flex size-[3.375rem] shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-line-200 bg-white',
                isFavoritePending && 'opacity-60'
              )}
            >
              <LikeActiveIcon
                className={cn(
                  'size-6',
                  isFavorited ? 'text-blue-400' : 'text-gray-200'
                )}
                aria-hidden
              />
            </button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              onClick={onDesignatedQuoteClick}
              disabled={isDesignatedDisabled}
              aria-busy={isDesignatedPending || isDesignatedStatusLoading}
              className="flex-1"
            >
              {getDesignatedButtonLabel(
                isAlreadyDesignated,
                isDesignatedPending
              )}
            </Button>
          </>
        ) : (
          <button
            type="button"
            onClick={onFavoriteClick}
            aria-pressed={isFavorited}
            aria-busy={isFavoritePending}
            className={cn(
              'inline-flex h-[3.375rem] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-200 bg-white text-lg-semibold text-black-400',
              isFavoritePending && 'opacity-60',
              isFavorited && 'border-blue-300 text-blue-400'
            )}
          >
            <LikeActiveIcon
              className={cn(
                'size-6 shrink-0',
                isFavorited ? 'text-blue-400' : 'text-gray-200'
              )}
              aria-hidden
            />
            {isFavorited ? '기사님 찜 취소' : '기사님 찜하기'}
          </button>
        )}
      </div>
    </div>
  );
};
