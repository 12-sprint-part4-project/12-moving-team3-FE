'use client';

import { WRITE_REGION_OPTIONS } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { Region } from '@/types/community';

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

interface CommunityWriteRegionChipsProps {
  value: Region | null;
  onChange: (region: Region) => void;
  className?: string;
}

/** 게시글 작성 지역 칩 — 가구나눔 선택 시 필수 */
export const CommunityWriteRegionChips = ({
  value,
  onChange,
  className = '',
}: CommunityWriteRegionChipsProps) => (
  <section className={className}>
    <div className={COMMUNITY_WRITE_LABEL_ROW_CLASS}>
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>지역</h2>
      <p className={COMMUNITY_WRITE_HINT_CLASS}>
        가구나눔 작성 시 지역을 꼭 선택해 주세요.
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
            onClick={() => onChange(option.value)}
            className={cn(COMMUNITY_WRITE_CHIP_BASE_CLASS, chipClassName)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </section>
);
