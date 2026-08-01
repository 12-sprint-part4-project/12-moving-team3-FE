'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

export interface MoversSelectOption {
  label: string;
  value: string;
}

export interface MoversSelectDropdownProps {
  label: string;
  options: MoversSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  /** true면 트리거가 부모 너비를 채움 (사이드바용) */
  fullWidth?: boolean;
  /**
   * value가 ALL(필터 없음)일 때 트리거에 보여줄 문구.
   * 리스트의 「전체」와 달리 닫힌 버튼에는 「지역」/「서비스」를 표시한다.
   */
  placeholder?: string;
  /** 옵션 리스트 열 수. 2면 2열 그리드 + 좌측 열 구분선 */
  columns?: 1 | 2;
}

/** 기사님 찾기용 단일 선택 드롭다운 (지역/서비스 BE enum 옵션) */
export const MoversSelectDropdown = ({
  label,
  options,
  value,
  onValueChange,
  className = '',
  fullWidth = false,
  placeholder,
  columns = 1,
}: MoversSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  if (!selected) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  const triggerText =
    value === 'ALL' && placeholder ? placeholder : selected.label;

  const triggerStateClass = isOpen
    ? 'border-blue-300 bg-blue-50 text-blue-300'
    : 'border-line-200 bg-white text-black-400';

  const isTwoColumn = columns === 2;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        fullWidth ? 'w-full' : 'inline-grid w-max',
        className
      )}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${triggerText}`}
        onClick={handleToggle}
        className={cn(
          'flex cursor-pointer items-center justify-between gap-1.5 rounded-lg border py-1.5 pr-2.5 pl-3.5 text-md-medium shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-100/10',
          fullWidth ? 'h-16 w-full px-4 text-lg-medium' : 'w-full',
          triggerStateClass
        )}
      >
        <span className="whitespace-nowrap">{triggerText}</span>
        <ChevronDownIcon
          aria-hidden
          className={cn('size-5 shrink-0', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={`${label} 옵션`}
          className={cn(
            'absolute top-full left-0 z-20 mt-1 max-h-[11.25rem] overflow-y-auto rounded-lg border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-gray-400/20',
            fullWidth ? 'w-full' : 'w-max min-w-full'
          )}
        >
          <ul
            role="presentation"
            className={cn(
              isTwoColumn ? 'grid grid-cols-2' : 'flex flex-col'
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isLeftColumn = isTwoColumn && index % 2 === 0;

              return (
                <li
                  key={option.value}
                  role="presentation"
                  className={cn(
                    isLeftColumn && 'border-r border-line-200'
                  )}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-md-medium whitespace-nowrap text-black-400',
                      isSelected
                        ? 'bg-background-300'
                        : 'hover:bg-background-300'
                    )}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
