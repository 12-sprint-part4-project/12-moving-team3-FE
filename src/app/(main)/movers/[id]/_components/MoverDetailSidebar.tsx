'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { Button } from '@/components/Button/Button';
import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
import { cn } from '@/lib/utils';

export interface MoverDetailSidebarProps {
  name: string;
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  onDesignatedQuoteClick: () => void;
  isDesignatedPending?: boolean;
  isAlreadyDesignated?: boolean;
  isDesignatedStatusLoading?: boolean;
  description?: string | null;
  profileImageUrl?: string | null;
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

/** Desktop 우측 — 지정 견적 CTA · 찜 · 공유 */
export const MoverDetailSidebar = ({
  name,
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  onDesignatedQuoteClick,
  isDesignatedPending = false,
  isAlreadyDesignated = false,
  isDesignatedStatusLoading = false,
  description = null,
  profileImageUrl = null,
  className = '',
}: MoverDetailSidebarProps) => {
  const isDesignatedDisabled =
    isDesignatedPending || isAlreadyDesignated || isDesignatedStatusLoading;

  return (
    <aside
      className={cn(
        'flex w-full max-w-[22.125rem] shrink-0 flex-col gap-10',
        className
      )}
    >
      <div className="flex flex-col gap-4">
        <p className="text-xl-semibold text-black-400">
          {name} 기사님에게 지정 견적을 요청해보세요!
        </p>
        <button
          type="button"
          onClick={onFavoriteClick}
          aria-pressed={isFavorited}
          aria-busy={isFavoritePending}
          className={cn(
            'inline-flex h-[3.375rem] w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-200 bg-white text-xl-semibold text-black-400 transition-colors hover:border-blue-200',
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
        <Button
          type="button"
          variant="solid"
          size="md"
          onClick={onDesignatedQuoteClick}
          disabled={isDesignatedDisabled}
          aria-busy={isDesignatedPending || isDesignatedStatusLoading}
        >
          {getDesignatedButtonLabel(isAlreadyDesignated, isDesignatedPending)}
        </Button>
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
