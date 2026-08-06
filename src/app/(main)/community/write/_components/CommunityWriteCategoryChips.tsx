'use client';

import { WRITE_CATEGORY_OPTIONS } from '@/constants/communityOptions';
import { POST_CATEGORY_CHIP_LAYOUT_CLASS } from '@/constants/communityCategoryStyles';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/community';

import {
  COMMUNITY_WRITE_FIELD_ROW_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  getPostCategoryWriteChipClassName,
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
    <div className={COMMUNITY_WRITE_FIELD_ROW_CLASS}>
      {WRITE_CATEGORY_OPTIONS.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              POST_CATEGORY_CHIP_LAYOUT_CLASS,
              'cursor-pointer',
              getPostCategoryWriteChipClassName(option.value, isSelected)
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </section>
);
