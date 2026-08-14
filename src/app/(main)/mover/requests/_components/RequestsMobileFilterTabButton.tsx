'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { cn } from '@/lib/utils';

export type RequestsMobileFilterTab = 'moveType' | 'scope';

export interface RequestsMobileFilterTabButtonProps {
  tab: RequestsMobileFilterTab;
  label: string;
  isActive: boolean;
  tabId: string;
  panelId: string;
  onSelect: (tab: RequestsMobileFilterTab) => void;
}

/** 모바일 필터 모달 탭 버튼 — 활성 탭 밑줄 인디케이터 */
export const RequestsMobileFilterTabButton = ({
  tab,
  label,
  isActive,
  tabId,
  panelId,
  onSelect,
}: RequestsMobileFilterTabButtonProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => onSelect(tab)}
      id={tabId}
      role="tab"
      className={cn(
        'relative cursor-pointer pb-1 text-2lg-semibold transition-colors',
        isActive ? 'text-black-400' : 'text-gray-300'
      )}
      aria-selected={isActive}
      aria-controls={panelId}
    >
      {label}
      {isActive ? (
        <motion.span
          layoutId="requests-mobile-filter-tab-indicator"
          className="absolute right-0 -bottom-0.5 left-0 h-0.5 bg-black-400"
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 400, damping: 30 }
          }
        />
      ) : null}
    </button>
  );
};
