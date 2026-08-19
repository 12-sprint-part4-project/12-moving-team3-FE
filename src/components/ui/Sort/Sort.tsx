'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';
import { TriggerWidthSizer } from '@/components/ui/Common/TriggerWidthSizer';
import { useControllableValue } from '@/hooks/useControllableValue';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import {
  dropdownPanelVariants,
  getMotionTransition,
} from '@/lib/motionVariants';

import type { DropdownOption } from '@/constants/dropdownOptions';

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
  /** 드롭다운이 열리거나 트리거에 hover·포커스될 때 호출 (정렬 목록 prefetch 등) */
  onOpen?: () => void;
  /** 옵션 hover·포커스 시 해당 value 전달 */
  onOptionPrefetch?: (value: string) => void;
  /** 사이즈. sm: 모바일, md: 태블릿/PC */
  size?: SortSize;
  /** 추가 스타일 클래스 */
  className?: string;
}

const SIZE_STYLES = {
  sm: {
    trigger:
      'h-8 gap-0.5 rounded-lg bg-white pr-1.5 pl-2 text-xs-semibold leading-none text-black-400',
    option:
      'h-8 rounded-none bg-white pr-1.5 pl-2 text-xs-medium leading-none text-black-400',
    icon: 'size-5',
  },
  md: {
    trigger:
      'h-10 gap-2.5 rounded-lg bg-white px-2.5 text-md-medium leading-none text-black-400',
    option:
      'h-10 rounded-none bg-white px-2.5 text-md-medium leading-none text-black-400',
    icon: 'size-5',
  },
} as const;

export const Sort = ({
  options,
  value,
  defaultValue,
  onValueChange,
  onOpen,
  onOptionPrefetch,
  size = 'md',
  className,
}: SortProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion, {
    duration: 0.16,
  });
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
    setIsOpen((prev) => {
      const next = !prev;
      if (next) onOpen?.();
      return next;
    });
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
      className={`relative inline-grid w-max grid-cols-[max-content] items-center self-center ${className ?? ''}`}
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
        onPointerEnter={onOpen}
        onFocus={onOpen}
        className={`col-start-1 row-start-1 flex w-full cursor-pointer items-center justify-center whitespace-nowrap ${sizeStyles.trigger}`}
      >
        <span>{selectedOption.label}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={motionTransition}
          className={`inline-flex shrink-0 text-gray-200 ${sizeStyles.icon}`}
        >
          <ChevronDownIcon className="size-full" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            role="listbox"
            aria-label="정렬 옵션"
            variants={dropdownPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={motionTransition}
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
                    onPointerEnter={() => onOptionPrefetch?.(option.value)}
                    onFocus={() => onOptionPrefetch?.(option.value)}
                    className={`flex w-full cursor-pointer items-center justify-center whitespace-nowrap ${sizeStyles.option} ${
                      isSelected
                        ? 'bg-background-300'
                        : 'hover:bg-background-300'
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
