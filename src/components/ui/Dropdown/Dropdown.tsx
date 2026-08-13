'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import {
  OPTIONS_BY_TYPE,
  TYPE_LABELS,
  type DropdownType,
} from '@/constants/dropdownOptions';
import { useControllableValue } from '@/hooks/useControllableValue';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useScrollbarGutterCompensation } from '@/hooks/useScrollbarGutterCompensation';
import {
  dropdownPanelVariants,
  getMotionTransition,
} from '@/lib/motionVariants';

export type { DropdownOption, DropdownType } from '@/constants/dropdownOptions';
export { REGION_OPTIONS, SERVICE_OPTIONS } from '@/constants/dropdownOptions';

type DropdownSize = 'sm' | 'md';

interface DropdownProps {
  /**
   * 드롭다운 목록 종류.
   * - region: 지역 2열 리스트
   * - service: 서비스 1열 리스트
   */
  type: DropdownType;
  /** 현재 선택된 value (controlled) */
  value?: string;
  /** 초기 선택 value (uncontrolled) */
  defaultValue?: string;
  /** 옵션 선택 시 호출 */
  onValueChange?: (value: string) => void;
  /** 사이즈. sm: 모바일, md: 태블릿/PC */
  size?: DropdownSize;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 추가 스타일 클래스 */
  className?: string;
}

const TRIGGER_WIDTH = 'w-[20.5rem]';
const LIST_WIDTH = 'w-[20.5rem]';

const SIZE_STYLES = {
  sm: {
    trigger:
      'justify-between rounded-2xl border px-6 py-4 text-lg-medium shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-blue/20',
    option: 'px-6 py-4 text-lg-medium text-black-400',
    icon: 'size-6',
    list: 'mt-1 overflow-hidden rounded-2xl border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-200/25',
    listMaxHeight: 'max-h-[20rem]',
  },
  md: {
    trigger:
      'justify-between rounded-2xl border px-6 py-4 text-2lg-medium shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-blue/20',
    option: 'px-6 py-4 text-2lg-medium text-black-400',
    icon: 'size-9',
    list: 'mt-1 overflow-hidden rounded-2xl border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-200/25',
    listMaxHeight: 'max-h-[20rem]',
  },
} as const;

const STATE_STYLES = {
  default: 'border-line-200 bg-white text-black-400 [&_path]:stroke-gray-200',
  open: 'border-blue-300 bg-blue-50 text-blue-300 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-blue/20 [&_path]:stroke-blue-300',
  disabled:
    'cursor-not-allowed border-gray-100 bg-white text-black-400 shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-blue/20 [&_path]:stroke-gray-200',
} as const;

export const Dropdown = ({
  type,
  value,
  defaultValue = 'ALL',
  onValueChange,
  size = 'md',
  disabled = false,
  className,
}: DropdownProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion, {
    duration: 0.16,
  });
  const options = OPTIONS_BY_TYPE[type];
  const [selectedValue, setSelectedValue] = useControllableValue(
    value,
    defaultValue,
    onValueChange
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const regionGridRef = useRef<HTMLUListElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      selectedRef.current?.scrollIntoView({ block: 'center' });
    }
  }, [isOpen]);

  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];
  const sizeStyles = SIZE_STYLES[size];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  useScrollbarGutterCompensation(
    listRef,
    regionGridRef,
    isOpen && type === 'region'
  );

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    setSelectedValue(nextValue);
    setIsOpen(false);
  };

  if (!selectedOption) {
    return null;
  }

  const triggerStateClass = disabled
    ? STATE_STYLES.disabled
    : isOpen
      ? STATE_STYLES.open
      : STATE_STYLES.default;

  return (
    <div ref={containerRef} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${TYPE_LABELS[type]}: ${selectedOption.label}`}
        disabled={disabled}
        onClick={handleToggle}
        className={`flex cursor-pointer items-center ${TRIGGER_WIDTH} ${sizeStyles.trigger} ${triggerStateClass}`}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selectedOption.label}
        </span>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={motionTransition}
          className={`inline-flex shrink-0 ${sizeStyles.icon}`}
        >
          <ChevronDownIcon className="size-full" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="listbox"
            aria-label={`${TYPE_LABELS[type]} 옵션`}
            variants={dropdownPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={motionTransition}
            className={`absolute top-full left-0 z-10 ${LIST_WIDTH} ${sizeStyles.list}`}
          >
            {type === 'region' ? (
              <div
                ref={listRef}
                className={`overflow-x-hidden overflow-y-auto ${sizeStyles.listMaxHeight}`}
              >
                <ul ref={regionGridRef} className="grid grid-cols-2">
                  {options.map((option, index) => {
                    const isSelected = option.value === selectedValue;
                    const isLeftColumn = index % 2 === 0;

                    return (
                      <li
                        key={option.value}
                        role="presentation"
                        className={`min-w-0 ${
                          isLeftColumn ? 'border-r border-line-200' : ''
                        }`}
                      >
                        <button
                          ref={isSelected ? selectedRef : undefined}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelect(option.value)}
                          className={`flex w-full cursor-pointer items-center ${sizeStyles.option} ${
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
                </ul>
              </div>
            ) : (
              <ul
                className={`flex w-full flex-col overflow-y-auto ${sizeStyles.listMaxHeight}`}
              >
                {options.map((option) => {
                  const isSelected = option.value === selectedValue;

                  return (
                    <li key={option.value} role="presentation">
                      <button
                        ref={isSelected ? selectedRef : undefined}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelect(option.value)}
                        className={`flex w-full cursor-pointer items-center ${sizeStyles.option} ${
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
              </ul>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
