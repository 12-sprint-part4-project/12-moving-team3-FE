'use client';

import { useEffect, useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import {
  OPTIONS_BY_TYPE,
  TYPE_LABELS,
  type DropdownType,
} from '@/constants/dropdownOptions';

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

const TRIGGER_WIDTH = 'w-[20.5rem] max-w-[328px]';
const LIST_WIDTH = 'w-[20.5rem] max-w-[328px]';

const SIZE_STYLES = {
  sm: {
    trigger:
      'justify-between rounded-2xl border px-6 py-4 text-lg-medium shadow-[0.25rem_0.25rem_0.625rem_rgb(195_217_242_/_0.2)]',
    option: 'px-6 py-4 text-lg-medium text-black-400',
    icon: 'size-6',
    list: 'mt-1 overflow-hidden rounded-2xl border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.3125rem_rgb(224_224_224_/_0.25)]',
    listMaxHeight: 'max-h-[20rem]',
  },
  md: {
    trigger:
      'justify-between rounded-2xl border px-6 py-4 text-2lg-medium shadow-[0.25rem_0.25rem_0.625rem_rgb(195_217_242_/_0.2)]',
    option: 'px-6 py-4 text-2lg-medium text-black-400',
    icon: 'size-9',
    list: 'mt-1 overflow-hidden rounded-2xl border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.3125rem_rgb(224_224_224_/_0.25)]',
    listMaxHeight: 'max-h-[20rem]',
  },
} as const;

const STATE_STYLES = {
  default: 'border-line-200 bg-white text-black-400 [&_path]:stroke-gray-200',
  open: 'border-blue-300 bg-blue-50 text-blue-300 shadow-[0.25rem_0.25rem_0.3125rem_rgb(195_217_242_/_0.2)] [&_path]:stroke-blue-300',
  disabled:
    'cursor-not-allowed border-gray-100 bg-white text-black-400 shadow-[0.25rem_0.25rem_0.625rem_rgb(195_217_242_/_0.2)] [&_path]:stroke-gray-200',
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
  const options = OPTIONS_BY_TYPE[type];
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const regionGridRef = useRef<HTMLUListElement>(null);

  const selectedValue = isControlled ? value : internalValue;
  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];
  const sizeStyles = SIZE_STYLES[size];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (!containerRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || type !== 'region') {
      return;
    }

    const listElement = listRef.current;
    const gridElement = regionGridRef.current;
    if (!listElement || !gridElement) {
      return;
    }

    const updateScrollbarMargin = () => {
      const nextScrollbarWidth =
        listElement.offsetWidth - listElement.clientWidth;
      const adjustedMargin = Math.max(0, nextScrollbarWidth - 6);
      gridElement.style.marginRight = `${adjustedMargin}px`;
    };

    updateScrollbarMargin();
    const resizeObserver = new ResizeObserver(updateScrollbarMargin);
    resizeObserver.observe(listElement);

    return () => {
      resizeObserver.disconnect();
      gridElement.style.marginRight = '';
    };
  }, [isOpen, type]);

  const handleToggle = () => {
    if (disabled) {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    onValueChange?.(nextValue);
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
        <ChevronDownIcon
          aria-hidden
          className={`shrink-0 ${sizeStyles.icon} ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={`${TYPE_LABELS[type]} 옵션`}
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
        </div>
      ) : null}
    </div>
  );
};
