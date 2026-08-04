'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { Button } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

export interface CustomerQuoteDetailActionsProps {
  /** 확정 CTA 노출 (활성 SUBMITTED + PENDING) */
  canConfirm: boolean;
  isConfirming: boolean;
  isFavorited: boolean;
  isFavoritePending?: boolean;
  onConfirm: () => void;
  onToggleFavorite: () => void;
  /** desktop=사이드바 CTA / mobile=하단 고정바 */
  variant: 'desktop' | 'mobile';
  className?: string;
}

/** 견적 상세 확정·찜 액션 */
export const CustomerQuoteDetailActions = ({
  canConfirm,
  isConfirming,
  isFavorited,
  isFavoritePending = false,
  onConfirm,
  onToggleFavorite,
  variant,
  className = '',
}: CustomerQuoteDetailActionsProps) => {
  if (variant === 'desktop') {
    if (!canConfirm) {
      return null;
    }

    return (
      <div className={cn('w-full', className)}>
        <Button
          size="md"
          variant="solid"
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {isConfirming ? '확정 중...' : '견적 확정하기'}
        </Button>
      </div>
    );
  }

  // 확정 불가면 하단 고정바를 숨김
  if (!canConfirm) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-20 border-t border-line-100 bg-white px-6 py-2.5 md:px-[4.5rem] lg:hidden',
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[37.5rem] items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavorite}
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
          size="sm"
          variant="solid"
          className="flex-1"
          disabled={isConfirming}
          onClick={onConfirm}
        >
          {isConfirming ? '확정 중...' : '견적 확정하기'}
        </Button>
      </div>
    </div>
  );
};
