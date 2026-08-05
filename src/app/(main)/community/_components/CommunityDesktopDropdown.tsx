'use client';

import { useRef, useState } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import { cn } from '@/lib/utils';

export interface CommunityDesktopDropdownOption {
  label: string;
  value: string;
}

interface CommunityDesktopDropdownProps {
  label: string;
  placeholder: string;
  options: CommunityDesktopDropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  listColumns?: 1 | 2;
  className?: string;
}

const TRIGGER_CLASS =
  'flex h-16 w-[20.5rem] cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-4 text-2lg-medium text-black-400';

const OPTION_CLASS =
  'flex w-full cursor-pointer items-center px-6 py-4 text-2lg-medium text-black-400';

/** Figma Desktop Dropdown (15129:40999) — 328×64 */
export const CommunityDesktopDropdown = ({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  listColumns = 1,
  className = '',
}: CommunityDesktopDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected =
    options.find((option) => option.value === value) ?? options[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  if (!selected) {
    return null;
  }

  const triggerText = value === 'ALL' ? placeholder : selected.label;

  const triggerStateClass = isOpen
    ? 'border-blue-300 bg-blue-50 text-blue-300 [&_path]:stroke-blue-300'
    : '';

  const handleSelect = (nextValue: string) => {
    onValueChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${triggerText}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(TRIGGER_CLASS, triggerStateClass)}
      >
        <span className="min-w-0 flex-1 truncate text-left">{triggerText}</span>
        <ChevronDownIcon
          aria-hidden
          className={cn('size-9 shrink-0', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen ? (
        <div
          role="listbox"
          aria-label={`${label} 옵션`}
          className="absolute top-full left-0 z-20 mt-1 w-[20.5rem] overflow-hidden rounded-2xl border border-line-200 bg-white"
        >
          <ul
            className={cn(
              'max-h-[20rem] overflow-y-auto',
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
