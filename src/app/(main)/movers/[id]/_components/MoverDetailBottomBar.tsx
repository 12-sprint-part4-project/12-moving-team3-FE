'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface MoverDetailBottomBarProps {
  isFavorited: boolean;
  onFavoriteClick: () => void;
  isFavoritePending?: boolean;
  className?: string;
}

/** Tablet / Mobile 하단 sticky — 찜 아이콘 + 지정 견적 CTA */
export const MoverDetailBottomBar = ({
  isFavorited,
  onFavoriteClick,
  isFavoritePending = false,
  className = '',
}: MoverDetailBottomBarProps) => {
  const handleDesignatedQuoteClick = () => {
    // TODO: 지정 견적 요청 API 연동
  };

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] xl:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        <button
          type="button"
          onClick={onFavoriteClick}
          disabled={isFavoritePending}
          aria-label={isFavorited ? '기사님 찜 취소' : '기사님 찜하기'}
          aria-pressed={isFavorited}
          aria-busy={isFavoritePending}
          className={cn(
            'inline-flex size-[3.375rem] shrink-0 items-center justify-center rounded-2xl border border-line-200 bg-white',
            isFavoritePending
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
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
          onClick={handleDesignatedQuoteClick}
          className="flex-1"
        >
          지정 견적 요청하기
        </Button>
      </div>
    </div>
  );
};
