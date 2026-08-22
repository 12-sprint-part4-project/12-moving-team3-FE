'use client';

import { useTranslation } from '@/i18n/useTranslation';

import { WRITE_REGION_OPTIONS } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_CHIP_BASE_CLASS,
  COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS,
  COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS,
  COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS,
  COMMUNITY_WRITE_FIELD_ROW_CLASS,
  COMMUNITY_WRITE_HINT_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_LABEL_ROW_CLASS,
  COMMUNITY_WRITE_REGION_CHIP_SELECTED_CLASS,
} from './communityWriteStyles';

import type { Region } from '@/types/community';

interface CommunityWriteRegionChipsProps {
  value: Region | null;
  onChange: (region: Region) => void;
  readOnly?: boolean;
  className?: string;
}

/** 게시글 작성 지역 칩 — 가구나눔 선택 시 필수 */
export const CommunityWriteRegionChips = ({
  value,
  onChange,
  readOnly = false,
  className = '',
}: CommunityWriteRegionChipsProps) => {
  const { t } = useTranslation();

  return (
    <section className={className}>
      <div className={COMMUNITY_WRITE_LABEL_ROW_CLASS}>
        <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>{t('common.region')}</h2>
        <p className={COMMUNITY_WRITE_HINT_CLASS}>
          {t('community.writeRegionHint')}
        </p>
      </div>
      <div className={COMMUNITY_WRITE_FIELD_ROW_CLASS}>
        {WRITE_REGION_OPTIONS.map((option) => {
          const isSelected = value === option.value;
          const chipClassName = isSelected
            ? `${COMMUNITY_WRITE_REGION_CHIP_SELECTED_CLASS} ${COMMUNITY_WRITE_CHIP_SELECTED_FONT_CLASS}`
            : `${COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS} ${COMMUNITY_WRITE_CHIP_UNSELECTED_FONT_CLASS}`;

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
                COMMUNITY_WRITE_CHIP_BASE_CLASS,
                readOnly ? 'cursor-default' : 'cursor-pointer',
                chipClassName
              )}
            >
              {t(`region.${option.value}`)}
            </button>
          );
        })}
      </div>
    </section>
  );
};
