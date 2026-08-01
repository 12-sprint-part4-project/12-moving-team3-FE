'use client';

import type { KeyboardEvent } from 'react';

import { CheckBox } from '@/components/ui/CheckBox/CheckBox';
import { cn } from '@/lib/utils';
import type { ApiMoveType } from '@/types/estimateRequest';

interface MoveTypeOptionFieldProps {
  value: ApiMoveType;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (value: ApiMoveType) => void;
  className?: string;
}

/**
 * Figma check-box-field — 이사 종류 radio 옵션 한 줄.
 * CheckBox(round)를 시각으로 쓰고, 행 전체가 단일 radio 역할.
 */
export const MoveTypeOptionField = ({
  value,
  label,
  selected,
  disabled = false,
  onSelect,
  className,
}: MoveTypeOptionFieldProps) => {
  const handleSelect = () => {
    if (disabled) {
      return;
    }
    onSelect(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSelect();
    }
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex w-full items-center gap-2 rounded-2xl border border-solid shadow-cta',
        'px-4 py-3.5 md:px-8 md:py-6',
        selected
          ? 'border-blue-300 bg-blue-50 shadow-cta-hover'
          : 'border-line-200 bg-white',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      {/* 시각용 체크 — 행 클릭으로만 선택 (중첩 interactive 방지) */}
      <span className="pointer-events-none" aria-hidden>
        <CheckBox
          checked={selected}
          onCheckedChange={() => undefined}
          size="sm"
          shape="round"
          tabIndex={-1}
        />
      </span>
      <span className="text-md-semibold text-black-400 md:text-2lg-semibold">
        {label}
      </span>
    </div>
  );
};
