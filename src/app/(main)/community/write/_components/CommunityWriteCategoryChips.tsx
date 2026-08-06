'use client';

import { WRITE_CATEGORY_OPTIONS } from '@/constants/communityOptions';
import { getPostCategoryChipClassName } from '@/constants/communityCategoryStyles';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/community';

import {
  COMMUNITY_WRITE_CHIP_BASE_CLASS,
  COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS,
  COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
} from './communityWriteStyles';

interface CommunityWriteCategoryChipsProps {
  value: PostCategory;
  onChange: (category: PostCategory) => void;
  className?: string;
}

/** 게시글 작성 카테고리 칩 — 이사팁·질문·후기·기타·가구나눔 */
export const CommunityWriteCategoryChips = ({
  value,
  onChange,
  className = '',
}: CommunityWriteCategoryChipsProps) => (
  <section className={className}>
    <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>카테고리</h2>
    <div className="mt-2.5 flex flex-wrap gap-2">
      {WRITE_CATEGORY_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              COMMUNITY_WRITE_CHIP_BASE_CLASS,
              isSelected
                ? COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS
                : COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS,
              getPostCategoryChipClassName(option.value, isSelected)
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </section>
);
