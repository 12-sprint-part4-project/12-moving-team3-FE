'use client';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
import { cn } from '@/lib/utils';

import { getDesignatedButtonLabel } from './getDesignatedButtonLabel';

export interface MoverDetailSidebarProps {
  name: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  /** false면 지정 견적 안내·버튼 숨김 (기사 로그인 등) */
  showDesignatedCta?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  hasReceivedQuoteFromMover?: boolean;
  isQuoteStatusError?: boolean;
  isDesignatedStatusLoading?: boolean;
  description?: string | null;
  profileImageUrl?: string | null;
  className?: string;
}

/** Desktop 우측 — 지정 견적 CTA · 찜 · 공유 */
export const MoverDetailSidebar = ({
  name,
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  showDesignatedCta = true,
  onDesignatedQuoteClick,
  isDesignatedPending = false,
  isAlreadyDesignated = false,
  hasReceivedQuoteFromMover = false,
  isQuoteStatusError = false,
  isDesignatedStatusLoading = false,
  description = null,
  profileImageUrl = null,
  className = '',
}: MoverDetailSidebarProps) => {
  const isHardDisabled =
    isDesignatedPending || isAlreadyDesignated || isDesignatedStatusLoading;
  const isSoftBlocked =
    (hasReceivedQuoteFromMover || isQuoteStatusError) && !isHardDisabled;

  return (
    <aside
      className={cn(
        'flex w-full max-w-[22.125rem] shrink-0 flex-col gap-10',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {showDesignatedCta ? (
          <p className="text-xl-semibold text-black-400">
            {name} 기사님에게 지정 견적을 요청해보세요!
          </p>
        ) : null}
        <FavoriteButton
          variant="labeled"
          isFavorited={isFavorited}
          isPending={isFavoritePending}
          onClick={onFavoriteClick}
        />
        {showDesignatedCta ? (
          <Button
            type="button"
            variant="solid"
            size="md"
            onClick={onDesignatedQuoteClick}
            disabled={isHardDisabled}
            aria-disabled={isHardDisabled || isSoftBlocked}
            aria-busy={isDesignatedPending || isDesignatedStatusLoading}
            className={cn(
              isSoftBlocked &&
                'cursor-not-allowed bg-gray-100 hover:bg-gray-100'
            )}
          >
            {getDesignatedButtonLabel(
              isAlreadyDesignated,
              hasReceivedQuoteFromMover,
              isDesignatedPending,
              isDesignatedStatusLoading,
              isQuoteStatusError
            )}
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col gap-[1.375rem] border-t border-line-100 pt-10">
        <p className="text-xl-semibold text-black-400">
          나만 알기엔 아쉬운 기사님인가요?
        </p>
        <MoverShareButtons
          size="md"
          name={name}
          description={description}
          profileImageUrl={profileImageUrl}
        />
      </div>
    </aside>
  );
};
