'use client';

import ResetIcon from '@/assets/icons/reset.svg';

import { cn } from '@/lib/utils';

interface RequestsFilterResetButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/** 검색·이사유형·필터·정렬 초기화 아이콘 버튼 */
export const RequestsFilterResetButton = ({
  onClick,
  disabled = false,
  className = '',
}: RequestsFilterResetButtonProps) => (
  <button
    type="button"
    aria-label="검색·필터·정렬 초기화"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-line-200 bg-white text-gray-400 transition-colors hover:text-gray-500 md:size-9',
      'disabled:cursor-default disabled:opacity-40 disabled:hover:text-gray-400',
      className
    )}
  >
    <ResetIcon className="size-5 shrink-0" aria-hidden />
  </button>
);
