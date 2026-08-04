'use client';

import LikeActiveIcon from '@/assets/icons/like-active.svg';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { cn } from '@/lib/utils';

export interface CustomerQuoteDetailActionsProps {
  isPending: boolean;
  isConfirming: boolean;
  isFavorited: boolean;
  onConfirm: () => void;
  onToggleFavorite: () => void;
  /** desktop=사이드바 CTA / mobile=하단 고정바 */
  variant: 'desktop' | 'mobile';
  className?: string;
}

/** 견적 상세 확정·찜 액션 */
export const CustomerQuoteDetailActions = ({
  isPending,
  isConfirming,
  isFavorited,
  onConfirm,
  onToggleFavorite,
  variant,
  className = '',
}: CustomerQuoteDetailActionsProps) => {
  if (variant === 'desktop') {
    if (!isPending) {
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

  // 대기 중이 아니면 하단 고정바를 숨김
  if (!isPending) {
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
        <IconButton
          icon={LikeActiveIcon}
          size="sm"
          variant="outlined"
          aria-label={isFavorited ? '찜 해제하기' : '찜하기'}
          aria-pressed={isFavorited}
          className={cn(
            'cursor-pointer',
            isFavorited ? 'text-blue-400' : 'text-gray-200'
          )}
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
