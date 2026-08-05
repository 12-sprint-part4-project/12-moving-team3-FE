'use client';

import {
  BOARD_CATEGORY_FILTER_OPTIONS,
  REGION_FILTER_OPTIONS,
  type RegionFilterValue,
} from '@/constants/communityOptions';
import { cn } from '@/lib/utils';
import type { PostCategory } from '@/types/community';

import { CommunitySearchField } from './CommunitySearchField';
import { CommunitySelectDropdown } from './CommunitySelectDropdown';

interface CommunitySidebarFilterProps {
  showCategoryFilter: boolean;
  categoryFilter: PostCategory | 'ALL';
  regionFilter: RegionFilterValue;
  searchValue: string;
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  onReset: () => void;
  className?: string;
}

/** Figma Desktop left-filter-sidebar (15129:40993) — 328px */
export const CommunitySidebarFilter = ({
  showCategoryFilter,
  categoryFilter,
  regionFilter,
  searchValue,
  onCategoryChange,
  onRegionChange,
  onSearchChange,
  onSearch,
  onReset,
  className = '',
}: CommunitySidebarFilterProps) => (
  <aside className={cn('w-[20.5rem] shrink-0', className)}>
    <div className="flex h-8 items-center justify-between pl-3.5">
      <h2 className="text-xl-medium text-black-400">필터</h2>
      <button
        type="button"
        onClick={onReset}
        className="cursor-pointer text-md-regular text-gray-400"
      >
        초기화
      </button>
    </div>

    {showCategoryFilter ? (
      <section className="mt-6 flex flex-col gap-4">
        <p className="text-lg-semibold text-black-400">
          카테고리를 선택해주세요
        </p>
        <CommunitySelectDropdown
          label="카테고리"
          placeholder="카테고리"
          options={BOARD_CATEGORY_FILTER_OPTIONS}
          value={categoryFilter}
          onValueChange={onCategoryChange}
          size="desktop"
        />
      </section>
    ) : null}

    <section
      className={cn(
        'flex flex-col gap-4',
        showCategoryFilter ? 'mt-4' : 'mt-6'
      )}
    >
      <p className="text-lg-semibold text-black-400">지역을 선택해주세요</p>
      <CommunitySelectDropdown
        label="지역"
        placeholder="지역"
        options={REGION_FILTER_OPTIONS}
        value={regionFilter}
        onValueChange={onRegionChange}
        listColumns={2}
        size="desktop"
      />
    </section>

    <section className="mt-4 flex flex-col gap-4">
      <p className="text-lg-semibold text-black-400">검색</p>
      <CommunitySearchField
        size="md"
        value={searchValue}
        onChange={onSearchChange}
        onSearch={onSearch}
        inputClassName="h-16 w-[20.5rem] max-w-none rounded-2xl bg-background-200"
      />
    </section>
  </aside>
);
