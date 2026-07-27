'use client';

import type { ChangeEvent, InputHTMLAttributes } from 'react';

import CheckIcon from '@/assets/icons/check.svg';

export type CheckBoxSize = 'sm' | 'md';
/** Figma `sort` 속성 — round=원형, square=사각 */
export type CheckBoxShape = 'round' | 'square';

export interface CheckBoxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'onChange' | 'checked'
  > {
  /** 체크 여부 (Figma Property 1: active / default) */
  checked: boolean;
  /** 체크 상태 변경 시 호출되는 콜백 */
  onCheckedChange: (checked: boolean) => void;
  /** 크기. sm=24px 히트영역, md=36px 히트영역 */
  size?: CheckBoxSize;
  /** 형태. round=원형, square=모서리 둥근 사각 */
  shape?: CheckBoxShape;
  className?: string;
}

const HIT_AREA_STYLE: Record<CheckBoxSize, string> = {
  sm: 'size-6',
  md: 'size-9',
};

const BOX_STYLE: Record<CheckBoxSize, Record<CheckBoxShape, string>> = {
  sm: {
    round: 'size-[1.125rem] rounded-full',
    square: 'size-4 rounded',
  },
  md: {
    round: 'size-[1.375rem] rounded-full',
    square: 'size-5 rounded',
  },
};

const CHECK_ICON_STYLE: Record<CheckBoxSize, string> = {
  sm: 'h-[0.3125rem] w-2',
  md: 'h-1.5 w-2.5',
};

/**
 * 선택 UI 체크박스 (Figma "check-box").
 * - size: sm(24) / md(36) 히트영역
 * - shape: round(원형) / square(사각, radius 4px)
 * - checked: active(blue-300 + 체크) / default(line-200 테두리)
 */
export const CheckBox = ({
  checked,
  onCheckedChange,
  size = 'sm',
  shape = 'round',
  disabled = false,
  className = '',
  ...rest
}: CheckBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.target.checked);
  };

  return (
    <label
      className={`relative inline-flex shrink-0 items-center justify-center ${HIT_AREA_STYLE[size]} ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden
        className={`flex items-center justify-center border ${BOX_STYLE[size][shape]} ${
          checked
            ? 'border-blue-300 bg-blue-300'
            : shape === 'round'
              ? 'border-line-200 bg-transparent'
              : 'border-line-200 bg-white'
        }`}
      >
        {checked ? (
          <CheckIcon
            className={`shrink-0 text-white ${CHECK_ICON_STYLE[size]}`}
          />
        ) : null}
      </span>
    </label>
  );
};
