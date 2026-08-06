'use client';

import {
  BOARD_WRITE_CATEGORY_OPTIONS,
  FURNITURE_WRITE_CATEGORY,
  type CommunityTabId,
} from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/community';

import { COMMUNITY_WRITE_LABEL_CLASS } from './communityWriteStyles';

interface CommunityWriteCategoryChipsProps {
  activeTab: CommunityTabId;
  value: PostCategory;
  onChange: (category: PostCategory) => void;
  className?: string;
}

const CHIP_BASE_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded px-1.5 py-0.5 text-sm-semibold shadow-sm';

const getCategoryOptions = (activeTab: CommunityTabId) =>
  activeTab === 'furniture'
    ? [{ label: '가구나눔', value: FURNITURE_WRITE_CATEGORY }]
    : BOARD_WRITE_CATEGORY_OPTIONS;

/** 게시글 작성 카테고리 칩 — Figma Chip/이사유형 sm */
export const CommunityWriteCategoryChips = ({
  activeTab,
  value,
  onChange,
  className = '',
}: CommunityWriteCategoryChipsProps) => {
  const options = getCategoryOptions(activeTab);

  return (
    <section className={className}>
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>카테고리</h2>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={cn(
                CHIP_BASE_CLASS,
                isSelected
                  ? 'bg-blue-100 text-blue-300'
                  : 'bg-line-100 text-blue-400'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
