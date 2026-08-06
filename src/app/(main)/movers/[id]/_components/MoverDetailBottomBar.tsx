'use client';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
import { cn } from '@/lib/utils';

import { getDesignatedButtonLabel } from './getDesignatedButtonLabel';

export interface MoverDetailBottomBarProps {
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  /** false면 지정 견적 버튼 숨김 (기사 로그인 등) */
  showDesignatedCta?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  hasReceivedQuoteFromMover?: boolean;
  isDesignatedStatusLoading?: boolean;
  className?: string;
}

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  showDesignatedCta = true,
  onDesignatedQuoteClick,
  isDesignatedPending = false,
  isAlreadyDesignated = false,
  hasReceivedQuoteFromMover = false,
  isDesignatedStatusLoading = false,
  className = '',
}: MoverDetailBottomBarProps) => {
  const isHardDisabled =
    isDesignatedPending || isAlreadyDesignated || isDesignatedStatusLoading;
  const isQuoteReceivedBlocked =
    hasReceivedQuoteFromMover && !isHardDisabled;

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
            <FavoriteButton
              variant="icon-only"
              isFavorited={isFavorited}
              isPending={isFavoritePending}
              onClick={onFavoriteClick}
            />
            <Button
              type="button"
              variant="solid"
              size="sm"
              onClick={onDesignatedQuoteClick}
              disabled={isHardDisabled}
              aria-disabled={isHardDisabled || isQuoteReceivedBlocked}
              aria-busy={isDesignatedPending || isDesignatedStatusLoading}
              className={cn(
                'flex-1',
                isQuoteReceivedBlocked &&
                  'cursor-not-allowed bg-gray-100 hover:bg-gray-100'
              )}
            >
              {getDesignatedButtonLabel(
                isAlreadyDesignated,
                hasReceivedQuoteFromMover,
                isDesignatedPending,
                isDesignatedStatusLoading
              )}
            </Button>
          </>
        ) : (
          <FavoriteButton
            variant="labeled"
            isFavorited={isFavorited}
            isPending={isFavoritePending}
            onClick={onFavoriteClick}
            className="text-lg-semibold"
          />
        )}
      </div>
    </div>
  );
};
