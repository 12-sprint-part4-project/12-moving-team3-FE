'use client';

import CheckIcon from '@/assets/icons/check.svg';
import { cn } from '@/lib/utils';

import type { ApiMoveType } from '@/types/estimateRequest';

interface MoveTypeOptionFieldProps {
  /** radio 그룹 공유 name — 브라우저가 화살표 키 이동을 처리 */
  name: string;
  value: ApiMoveType;
  label: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: (value: ApiMoveType) => void;
  className?: string;
}

/**
 * 이사 종류 radio 옵션 한 줄.
 * 네이티브 radio + label로 키보드(화살표)·포커스를 브라우저에 맡긴다.
 */
export const MoveTypeOptionField = ({
  name,
  value,
  label,
  selected,
  disabled = false,
  onSelect,
  className,
}: MoveTypeOptionFieldProps) => {
  return (
    <label
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
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onSelect(value)}
        className="peer sr-only"
      />
      {/* CheckBox(round,sm)과 동일 시각 — radio와 input 중첩을 피하려고 표시만 */}
      <span
        aria-hidden
        className="inline-flex size-6 shrink-0 items-center justify-center"
      >
        <span
          className={cn(
            'flex size-[1.125rem] items-center justify-center rounded-full border',
            selected
              ? 'border-blue-300 bg-blue-300'
              : 'border-line-200 bg-transparent'
          )}
        >
          {selected ? (
            <CheckIcon className="h-[0.3125rem] w-2 shrink-0 text-white" />
          ) : null}
        </span>
      </span>
      <span className="text-md-semibold text-black-400 md:text-2lg-semibold">
        {label}
      </span>
    </label>
  );
};
