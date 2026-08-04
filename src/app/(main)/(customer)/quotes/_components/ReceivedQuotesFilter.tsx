'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';
import type { CustomerPastQuoteFilter } from '@/types/customerQuote';

export interface ReceivedQuotesFilterProps {
  value: CustomerPastQuoteFilter;
  onValueChange: (value: CustomerPastQuoteFilter) => void;
  className?: string;
}

const FILTER_OPTIONS: { value: CustomerPastQuoteFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CONFIRMED', label: '확정한 견적서' },
];

/** 받았던 견적 필터 (전체 / 확정한 견적서) */
export const ReceivedQuotesFilter = ({
  value,
  onValueChange,
  className = '',
}: ReceivedQuotesFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected =
    FILTER_OPTIONS.find((option) => option.value === value) ??
    FILTER_OPTIONS[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  if (!selected) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (nextValue: CustomerPastQuoteFilter) => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  const triggerStateClass = isOpen
    ? 'border-blue-300 bg-blue-50 text-blue-300 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-blue/10 [&_path]:stroke-blue-300'
    : 'border-line-200 bg-white text-black-400 shadow-[0.25rem_0.25rem_0.3125rem] shadow-shadow-gray-100/10 [&_path]:stroke-black-100';

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-grid w-max', className)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`견적 필터: ${selected.label}`}
        onClick={handleToggle}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg border py-1.5 pr-2.5 pl-3.5 text-md-medium lg:h-16 lg:px-4 lg:text-lg-medium',
          triggerStateClass
        )}
      >
        <span className="whitespace-nowrap">{selected.label}</span>
        <ChevronDownIcon
          aria-hidden
          className={cn('size-5 shrink-0', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          aria-label="견적 필터 옵션"
          className="absolute top-full left-0 z-10 mt-1 flex w-max min-w-full flex-col overflow-hidden rounded-lg border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-gray-400/20"
        >
          {FILTER_OPTIONS.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-md-medium whitespace-nowrap text-black-400',
                    isSelected ? 'bg-background-300' : 'hover:bg-background-300'
                  )}
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
