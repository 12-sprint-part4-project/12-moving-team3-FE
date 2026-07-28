'use client';

import type { ChangeEvent } from 'react';

import CheckIcon from '@/assets/icons/check.svg';

import { cn } from '@/lib/utils';

interface FilterCheckBoxProps {
  /** 체크박스 왼쪽에 표시할 라벨 텍스트 */
  label: string;
  /** 체크 여부 */
  checked: boolean;
  /** 체크 상태 변경 시 호출되는 콜백 */
  onCheckedChange: (checked: boolean) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 라벨 텍스트 스타일 오버라이드 (예: 전체선택 gray-300) */
  labelClassName?: string;
}

export const FilterCheckBox = ({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className,
  labelClassName,
}: FilterCheckBoxProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(event.target.checked);
  };

  return (
    <label
      className={cn(
        'flex w-full items-center justify-between border-b border-line-100 bg-white p-4',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className
      )}
    >
      <span className={cn('text-2lg-medium text-black-400', labelClassName)}>
        {label}
      </span>
      <span className="relative flex size-9 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={`flex size-5 items-center justify-center rounded border ${
            checked ? 'border-blue-300 bg-blue-300' : 'border-line-200 bg-white'
          }`}
        >
          {checked ? (
            <CheckIcon className="h-1.5 w-2.5 text-white" />
          ) : null}
        </span>
      </span>
    </label>
  );
};
