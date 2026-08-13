'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

import ChevronDownIcon from '@/assets/icons/chevron-down.svg';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import {
  dropdownPanelVariants,
  getMotionTransition,
} from '@/lib/motionVariants';
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

/** 받았던 견적 필터 (전체 / 확정한 견적서) — 커스텀 listbox + 키보드·포커스 계약 */
export const ReceivedQuotesFilter = ({
  value,
  onValueChange,
  className = '',
}: ReceivedQuotesFilterProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion, {
    duration: 0.16,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const listboxId = useId();

  const selectedIndex = Math.max(
    0,
    FILTER_OPTIONS.findIndex((option) => option.value === value)
  );
  const selected = FILTER_OPTIONS[selectedIndex] ?? FILTER_OPTIONS[0];

  useOutsideClick(containerRef, isOpen, setIsOpen);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      optionRefs.current[activeIndex]?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, activeIndex]);

  if (!selected) {
    return null;
  }

  const closeAndRestoreFocus = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  const openListbox = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const focusOption = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), FILTER_OPTIONS.length - 1));
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    openListbox();
  };

  const handleSelect = (nextValue: CustomerPastQuoteFilter) => {
    onValueChange(nextValue);
    closeAndRestoreFocus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      event.key === 'ArrowDown' ||
      event.key === 'ArrowUp' ||
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault();
      openListbox();
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const lastIndex = FILTER_OPTIONS.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusOption(activeIndex + 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusOption(activeIndex - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusOption(0);
        break;
      case 'End':
        event.preventDefault();
        focusOption(lastIndex);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const activeOption = FILTER_OPTIONS[activeIndex];
        if (activeOption) {
          handleSelect(activeOption.value);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        closeAndRestoreFocus();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
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
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={`견적 필터: ${selected.label}`}
        onClick={handleToggle}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          'flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg border py-1.5 pr-2.5 pl-3.5 text-md-medium lg:h-16 lg:px-4 lg:text-lg-medium',
          triggerStateClass
        )}
      >
        <span className="whitespace-nowrap">{selected.label}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={motionTransition}
          className="inline-flex size-5 shrink-0"
        >
          <ChevronDownIcon className="size-full" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label="견적 필터 옵션"
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
            variants={dropdownPanelVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={motionTransition}
            className="absolute top-full left-0 z-10 mt-1 flex w-max min-w-full flex-col overflow-hidden rounded-lg border border-line-200 bg-white shadow-[0.25rem_0.25rem_0.625rem] shadow-shadow-gray-400/20"
          >
            {FILTER_OPTIONS.map((option, index) => {
              const isSelected = option.value === value;
              const isActive = index === activeIndex;

              return (
                <li key={option.value} role="presentation">
                  <div
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    role="option"
                    tabIndex={isActive ? 0 : -1}
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full cursor-pointer items-center px-3.5 py-1.5 text-md-medium whitespace-nowrap text-black-400 outline-none focus-visible:bg-background-300',
                      isSelected
                        ? 'bg-background-300'
                        : 'hover:bg-background-300'
                    )}
                  >
                    {option.label}
                  </div>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
