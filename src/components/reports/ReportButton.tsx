'use client';

import ReportIcon from '@/assets/icons/report.svg';
import { cn } from '@/lib/utils';

export type ReportButtonVariant = 'default' | 'icon-only';

export interface ReportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: ReportButtonVariant;
  className?: string;
}

/**
 * 신고 트리거 버튼 — default: 아이콘+「신고」, icon-only: 아이콘만
 */
export const ReportButton = ({
  onClick,
  disabled = false,
  variant = 'default',
  className = '',
}: ReportButtonProps) => (
  <button
    type="button"
    aria-label="신고"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'inline-flex cursor-pointer items-center transition-colors disabled:cursor-not-allowed disabled:opacity-50',
      variant === 'default' &&
        'gap-1 text-md-medium text-gray-400 hover:text-black-300',
      variant === 'icon-only' &&
        'size-5 min-[46.5rem]:size-6 xl:size-7 shrink-0 justify-center text-[#8c8c8c] hover:text-[#1a1a1a]',
      className
    )}
  >
    <ReportIcon
      className={cn(
        variant === 'icon-only'
          ? 'size-5 min-[46.5rem]:size-6 xl:size-7'
          : 'size-4'
      )}
    />
    {variant === 'default' ? <span>신고</span> : null}
  </button>
);
