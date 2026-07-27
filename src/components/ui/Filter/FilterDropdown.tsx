'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { TriggerWidthSizer } from '@/components/ui/common_temp/TriggerWidthSizer';
import {
  OPTIONS_BY_TYPE,
  TYPE_LABELS,
  type DropdownType,
} from '@/constants/dropdownOptions';
import { useControllableValue } from '@/hooks/useControllableValue';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { useScrollbarGutterCompensation } from '@/hooks/useScrollbarGutterCompensation';

interface FilterDropdownProps {
  /**
   * 필터 목록 종류.
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
  /** 추가 스타일 클래스 */
  className?: string;
}

const TRIGGER_CLASS =
  'flex cursor-pointer items-center gap-1.5 rounded-lg border py-1.5 pr-2.5 pl-3.5 text-md-medium';
const OPTION_CLASS =
  'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-md-medium whitespace-nowrap text-black-400';
const LIST_MAX_HEIGHT = 'max-h-[11.25rem]';

export const FilterDropdown = ({
  type,
  value,
  defaultValue = 'ALL',
  onValueChange,
  className,
}: FilterDropdownProps) => {
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

  const selectedOption =
    options.find((option) => option.value === selectedValue) ?? options[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  useScrollbarGutterCompensation(
    listRef,
    regionGridRef,
    isOpen && type === 'region'
  );

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

  const triggerStateClass = isOpen
    ? 'border-blue-300 bg-blue-50 text-blue-300 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-blue/10 [&_path]:stroke-blue-300'
    : 'border-line-200 bg-white text-black-400 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-100/10 [&_path]:stroke-black-100';

  return (
    <div
      ref={containerRef}
      className={`relative inline-grid w-max grid-cols-[max-content] ${className ?? ''}`}
    >
      {type === 'service' ? (
        <TriggerWidthSizer
          options={options}
          triggerClassName={TRIGGER_CLASS}
          iconClassName="size-5"
        />
      ) : null}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${TYPE_LABELS[type]}: ${selectedOption.label}`}
        onClick={handleToggle}
        className={`col-start-1 row-start-1 w-full justify-between ${TRIGGER_CLASS} ${triggerStateClass}`}
      >
        <span className="whitespace-nowrap">{selectedOption.label}</span>
        <ChevronDownIcon
          aria-hidden
          className={`size-5 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={`${TYPE_LABELS[type]} 옵션`}
          className={`absolute top-full left-0 z-10 mt-1 overflow-hidden rounded-lg border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-gray-400/20 ${
            type === 'service' ? 'w-full' : 'w-max'
          }`}
        >
          {type === 'region' ? (
            <div
              ref={listRef}
              className={`overflow-x-hidden overflow-y-auto ${LIST_MAX_HEIGHT}`}
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
                        className={`${OPTION_CLASS} ${
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
            <ul className="flex w-full flex-col">
              {options.map((option) => {
                const isSelected = option.value === selectedValue;

                return (
                  <li key={option.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(option.value)}
                      className={`${OPTION_CLASS} ${
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
