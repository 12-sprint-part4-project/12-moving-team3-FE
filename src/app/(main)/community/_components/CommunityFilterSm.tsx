'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

export interface CommunityFilterSmOption {
  label: string;
  value: string;
}

interface CommunityFilterSmProps {
  label: string;
  placeholder: string;
  options: CommunityFilterSmOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  listColumns?: 1 | 2;
}

const TRIGGER_CLASS =
  'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line-200 bg-white py-1.5 pr-2.5 pl-3.5 text-md-regular text-black-400';

const OPTION_CLASS =
  'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-md-regular whitespace-nowrap text-black-400';

/** Figma filter/sm — 카테고리·지역 필터 (Mobile) */
export const CommunityFilterSm = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  className = '',
  listColumns = 1,
}: CommunityFilterSmProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  if (!selected) {
    return null;
  }

  const triggerText = value === 'ALL' ? placeholder : selected.label;

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  const triggerStateClass = isOpen
    ? 'border-blue-300 bg-blue-50 text-blue-300 [&_path]:stroke-blue-300'
    : '';

  return (
    <div ref={containerRef} className={cn('relative w-max', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${triggerText}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          TRIGGER_CLASS,
          triggerStateClass,
          'w-full justify-between'
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
          className="absolute top-full left-0 z-20 mt-1 max-h-[11.25rem] overflow-y-auto rounded-lg border border-line-200 bg-white"
        >
          <ul
            className={cn(
              listColumns === 2 ? 'grid grid-cols-2' : 'flex flex-col'
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isLeftColumn = listColumns === 2 && index % 2 === 0;

              return (
                <li
                  key={option.value}
                  role="presentation"
                  className={cn(isLeftColumn && 'border-r border-line-200')}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      OPTION_CLASS,
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
