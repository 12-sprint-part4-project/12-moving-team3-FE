'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { TriggerWidthSizer } from '@/components/ui/common_temp/TriggerWidthSizer';
import type { DropdownOption } from '@/constants/dropdownOptions';
import { useControllableValue } from '@/hooks/useControllableValue';
import { useOutsideClick } from '@/hooks/useOutsideClick';

export type SortOption = DropdownOption;

type SortSize = 'sm' | 'md';

interface SortProps {
  /**
   * 정렬 옵션 목록.
   * @example
   * [
   *   { label: '리뷰 많은순', value: 'mostReviews' },
   *   { label: '평점 높은순', value: 'highestRating' },
   * ]
   */
  options: SortOption[];
  /** 현재 선택된 value (controlled). 넘기면 외부에서 선택 상태를 관리 */
  value?: string;
  /** 초기 선택 value (uncontrolled). value를 안 넘길 때 사용 */
  defaultValue?: string;
  /** 옵션 선택 시 호출. 선택된 option의 value(영문 등)를 전달 */
  onValueChange?: (value: string) => void;
  /** 사이즈. sm: 모바일, md: 태블릿/PC */
  size?: SortSize;
  /** 추가 스타일 클래스 */
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    trigger:
      'gap-0.5 rounded-lg bg-white py-1.5 pr-1.5 pl-2 text-xs-semibold text-black-400',
    option:
      'rounded-none bg-white py-1.5 pr-1.5 pl-2 text-xs-medium text-black-400',
    icon: 'size-5',
  },
  md: {
    trigger:
      'gap-2.5 rounded-lg bg-white px-2.5 py-2 text-md-semibold text-black-400 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-300/20',
    option: 'rounded-none bg-white px-2.5 py-2 text-md-medium text-black-400',
    icon: 'size-5',
  },
} as const;

export const Sort = ({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  className,
}: SortProps) => {
  const [selectedValue, setSelectedValue] = useControllableValue(
    value,
    defaultValue ?? options[0]?.value ?? '',
    onValueChange
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];
  const sizeStyles = SIZE_STYLES[size];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    setSelectedValue(nextValue);
    setIsOpen(false);
  };

  if (!selectedOption) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-grid w-max grid-cols-[max-content] ${className ?? ''}`}
    >
      <TriggerWidthSizer
        options={options}
        triggerClassName={sizeStyles.trigger}
        iconClassName={sizeStyles.icon}
      />

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={`col-start-1 row-start-1 flex w-full cursor-pointer items-center justify-between whitespace-nowrap ${sizeStyles.trigger}`}
      >
        <span>{selectedOption.label}</span>
        <ChevronDownIcon
          aria-hidden
          className={`shrink-0 ${sizeStyles.icon} ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          aria-label="정렬 옵션"
          className="absolute top-full left-0 z-10 mt-1 w-full overflow-hidden rounded-lg border border-line-100 bg-white"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full cursor-pointer items-center whitespace-nowrap ${sizeStyles.option} ${
                    isSelected ? 'bg-background-300' : 'hover:bg-background-300'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};
