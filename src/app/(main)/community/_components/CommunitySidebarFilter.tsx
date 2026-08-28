'use client';

import {
  BOARD_CATEGORY_FILTER_OPTIONS,
  REGION_FILTER_OPTIONS,
  type RegionFilterValue,
} from '@/constants/communityOptions';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import { CommunitySearchField } from './CommunitySearchField';
import { CommunitySelectDropdown } from './CommunitySelectDropdown';

import type { PostCategory } from '@/types/community';
import type { ReactNode } from 'react';

interface CommunitySidebarFilterProps {
  showCategoryFilter: boolean;
  showHideCompleted?: boolean;
  hideCompleted?: boolean;
  categoryFilter: PostCategory | 'ALL';
  regionFilter: RegionFilterValue;
  searchValue: string;
  onCategoryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  onReset: () => void;
  onHideCompletedChange?: (value: boolean) => void;
  onCategoryOpen?: () => void;
  onRegionOpen?: () => void;
  writeButton?: ReactNode;
  className?: string;
}

/** Figma Desktop left-filter-sidebar (15129:40993) — 328px */
export const CommunitySidebarFilter = ({
  showCategoryFilter,
  showHideCompleted = false,
  hideCompleted = false,
  categoryFilter,
  regionFilter,
  searchValue,
  onCategoryChange,
  onRegionChange,
  onSearchChange,
  onSearch,
  onReset,
  onHideCompletedChange,
  onCategoryOpen,
  onRegionOpen,
  writeButton,
  className = '',
}: CommunitySidebarFilterProps) => {
  const { t } = useTranslation();

  return (
    <aside className={cn('w-[20.5rem] shrink-0', className)}>
      <div className="flex h-8 items-center justify-between pl-3.5">
        <h2 className="text-xl-medium text-black-400">{t('common.filter')}</h2>
        <button
          type="button"
          onClick={onReset}
          className="cursor-pointer text-md-regular text-gray-400"
        >
          {t('common.reset')}
        </button>
      </div>

      {showCategoryFilter ? (
        <section className="mt-6 flex flex-col gap-4">
          <p className="text-lg-semibold text-black-400">
            {t('community.selectCategory')}
          </p>
          <CommunitySelectDropdown
            label={t('community.category')}
            placeholder={t('community.category')}
            options={BOARD_CATEGORY_FILTER_OPTIONS.map((option) => ({
              ...option,
              label:
                option.value === 'ALL'
                  ? t('common.all')
                  : t(`community.postCategory.${option.value}`),
            }))}
            value={categoryFilter}
            onValueChange={onCategoryChange}
            onOpen={onCategoryOpen}
            size="desktop"
          />
        </section>
      ) : null}

      {showHideCompleted ? (
        <button
          type="button"
          onClick={() => onHideCompletedChange?.(!hideCompleted)}
          aria-pressed={hideCompleted}
          className="mt-6 flex cursor-pointer items-center gap-1.5"
        >
          <span
            className={cn(
              'flex h-5 w-9 items-center rounded-full px-0.5 transition-colors',
              hideCompleted ? 'bg-blue-300' : 'bg-gray-200'
            )}
          >
            <span
              className={cn(
                'h-4 w-4 rounded-full bg-white shadow transition-transform',
                hideCompleted ? 'translate-x-4' : 'translate-x-0'
              )}
            />
          </span>
          <span className="text-lg-medium text-black-400">
            {t('community.hideCompleted')}
          </span>
        </button>
      ) : null}

      <section
        className={cn(
          'flex flex-col gap-4',
          showCategoryFilter ? 'mt-4' : 'mt-6'
        )}
      >
        <p className="text-lg-semibold text-black-400">
          {t('community.selectRegion')}
        </p>
        <CommunitySelectDropdown
          label={t('common.region')}
          placeholder={t('common.region')}
          options={REGION_FILTER_OPTIONS.map((option) => ({
            ...option,
            label:
              option.value === 'ALL'
                ? t('common.all')
                : t(`region.${option.value}`),
          }))}
          value={regionFilter}
          onValueChange={onRegionChange}
          onOpen={onRegionOpen}
          listColumns={2}
          size="desktop"
        />
      </section>

      <section className="mt-4 flex flex-col gap-4">
        <p className="text-lg-semibold text-black-400">{t('common.search')}</p>
        <CommunitySearchField
          size="md"
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
          inputClassName="h-16 w-[20.5rem] max-w-none rounded-2xl bg-background-200"
        />
      </section>

      {writeButton ? <div className="mt-4">{writeButton}</div> : null}
    </aside>
  );
};
