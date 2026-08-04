'use client';

import { cn } from '@/lib/utils';
import ReportIcon from '@/assets/icons/report.svg';

export interface ReportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * 신고 트리거 버튼 (신고 아이콘 + 「신고」).
 */
export const ReportButton = ({
  onClick,
  disabled = false,
  className = '',
}: ReportButtonProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      'inline-flex cursor-pointer items-center gap-1 text-md-medium text-gray-400 transition-colors hover:text-black-300 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
  >
    <ReportIcon className="size-4" />
    <span>신고</span>
  </button>
);
