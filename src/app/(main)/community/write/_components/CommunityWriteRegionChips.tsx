'use client';

import { WRITE_REGION_OPTIONS } from '@/constants/communityOptions';
import { COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS } from '@/constants/communityCategoryStyles';
import { cn } from '@/lib/utils';
import type { Region } from '@/types/community';

import { COMMUNITY_WRITE_HINT_CLASS, COMMUNITY_WRITE_LABEL_CLASS } from './communityWriteStyles';

interface CommunityWriteRegionChipsProps {
  value: Region | null;
  onChange: (region: Region) => void;
  className?: string;
}

const CHIP_BASE_CLASS =
  'inline-flex cursor-pointer items-center justify-center rounded px-1.5 py-0.5 text-sm-semibold shadow-sm';

/** 게시글 작성 지역 칩 — 가구나눔 선택 시 필수 */
export const CommunityWriteRegionChips = ({
  value,
  onChange,
  className = '',
}: CommunityWriteRegionChipsProps) => (
  <section className={className}>
    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>지역</h2>
      <p className={COMMUNITY_WRITE_HINT_CLASS}>
        가구나눔 작성 시 지역을 꼭 선택해 주세요.
      </p>
    </div>
    <div className="mt-2.5 flex flex-wrap gap-2">
      {WRITE_REGION_OPTIONS.map((option) => {
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
                : COMMUNITY_WRITE_CHIP_UNSELECTED_CLASS
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  </section>
);
