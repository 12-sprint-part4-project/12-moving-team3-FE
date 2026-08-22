'use client';

import { WRITE_CATEGORY_OPTIONS } from '@/constants/communityOptions';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_CATEGORY_CHIP_LAYOUT_CLASS,
  COMMUNITY_WRITE_FIELD_ROW_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  getPostCategoryWriteChipClassName,
} from './communityWriteStyles';

import type { PostCategory } from '@/types/community';

interface CommunityWriteCategoryChipsProps {
  value: PostCategory;
  onChange: (category: PostCategory) => void;
  readOnly?: boolean;
  className?: string;
}

/** 게시글 작성 카테고리 칩 — 이사팁·질문·후기·기타·가구나눔 */
export const CommunityWriteCategoryChips = ({
  value,
  onChange,
  readOnly = false,
  className = '',
}: CommunityWriteCategoryChipsProps) => {
  const { t } = useTranslation();

  return (
    <section className={className}>
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>{t('community.category')}</h2>
      <div className={COMMUNITY_WRITE_FIELD_ROW_CLASS}>
        {WRITE_CATEGORY_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              disabled={readOnly}
              onClick={() => {
                if (readOnly) {
                  return;
                }

                onChange(option.value);
              }}
              className={cn(
                COMMUNITY_WRITE_CATEGORY_CHIP_LAYOUT_CLASS,
                readOnly ? 'cursor-default' : 'cursor-pointer',
                getPostCategoryWriteChipClassName(option.value, isSelected)
              )}
            >
              {t(`community.postCategory.${option.value}`)}
            </button>
          );
        })}
      </div>
    </section>
  );
};
