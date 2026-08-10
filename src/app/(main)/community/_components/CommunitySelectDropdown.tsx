'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

export interface CommunitySelectOption {
  label: string;
  value: string;
}

type CommunitySelectDropdownSize = 'sm' | 'desktop';

interface CommunitySelectDropdownProps {
  label: string;
  placeholder: string;
  options: CommunitySelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  size?: CommunitySelectDropdownSize;
  listColumns?: 1 | 2;
  className?: string;
}

const OPEN_TRIGGER_CLASS =
  'border-blue-300 bg-blue-50 text-blue-300 [&_path]:stroke-blue-300';

/** 커뮤니티 카테고리·지역 필터 드롭다운 (Figma filter/sm · Desktop Dropdown) */
export const CommunitySelectDropdown = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  size = 'sm',
  listColumns = 1,
  className = '',
}: CommunitySelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = size === 'desktop';

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

  const isTwoColumn = listColumns === 2;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        isDesktop ? 'w-[20.5rem]' : 'w-max',
        className
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={`${label}: ${triggerText}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between border',
          isDesktop
            ? cn(
                'h-16 rounded-2xl border-gray-100 bg-white px-6 py-4 text-2lg-medium text-black-400',
                isOpen && OPEN_TRIGGER_CLASS
              )
            : cn(
                'h-9 gap-1.5 rounded-lg border-line-200 bg-white py-1.5 pr-2.5 pl-3.5 text-md-regular text-black-400',
                isOpen && OPEN_TRIGGER_CLASS
              )
        )}
      >
        <span
          className={cn(
            'whitespace-nowrap',
            isDesktop && 'min-w-0 flex-1 truncate text-left'
          )}
        >
          {triggerText}
        </span>
        <ChevronDownIcon
          aria-hidden
          className={cn(
            'shrink-0',
            isDesktop ? 'size-9' : 'size-5',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen ? (
        <div
          className={cn(
            'absolute top-full left-0 z-20 mt-1 border border-line-200 bg-white',
            isDesktop
              ? 'w-[20.5rem] overflow-hidden rounded-2xl'
              : 'w-max min-w-full max-h-[11.25rem] overflow-y-auto rounded-lg'
          )}
        >
          <ul
            className={cn(
              isDesktop && 'max-h-[20rem] overflow-y-auto',
              isTwoColumn ? 'grid grid-cols-2' : 'flex flex-col'
            )}
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isLeftColumn = isTwoColumn && index % 2 === 0;

              return (
                <li
                  key={option.value}
                  className={cn(isLeftColumn && 'border-r border-line-200')}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full cursor-pointer items-center whitespace-nowrap text-black-400',
                      isDesktop
                        ? 'px-6 py-4 text-2lg-medium'
                        : 'px-3.5 py-1.5 text-md-regular',
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
