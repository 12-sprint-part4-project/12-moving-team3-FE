import FilterIcon from '@/assets/icons/filter.svg';

import type { ButtonHTMLAttributes } from 'react';

export interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 활성(선택) 상태.
   * Figma Button filter/sm의 Property 3=active에 해당한다.
   */
  active?: boolean;
  /** 아이콘만 있는 버튼이라 스크린리더가 읽을 이름을 반드시 받는다. */
  'aria-label': string;
  className?: string;
}

const STATE_STYLE = {
  default:
    'border-line-200 bg-white text-gray-100 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-100/10',
  active: 'border-blue-200 bg-blue-50 text-blue-200',
} as const;

/**
 * 필터 아이콘 버튼.
 * Figma "Button" (Property 1=filter, Property 2=sm) — default / active.
 */
export const FilterButton = ({
  active = false,
  className = '',
  type = 'button',
  ...rest
}: FilterButtonProps) => (
  <button
    type={type}
    aria-pressed={active}
    className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg border p-1 ${
      active ? STATE_STYLE.active : STATE_STYLE.default
    } ${className}`}
    {...rest}
  >
    <FilterIcon className="size-6 shrink-0" aria-hidden />
  </button>
);
