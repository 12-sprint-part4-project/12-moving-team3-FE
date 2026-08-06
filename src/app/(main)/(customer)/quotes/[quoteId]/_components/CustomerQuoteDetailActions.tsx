'use client';

import { Button } from '@/components/Button/Button';
import { FavoriteButton } from '@/components/Favorite';
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
        <FavoriteButton
          variant="icon-only"
          isFavorited={isFavorited}
          isPending={isFavoritePending}
          onClick={onToggleFavorite}
        />
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
