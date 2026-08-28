'use client';

import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Sort } from '@/components/ui/Sort/Sort';
import { useTranslation } from '@/i18n/useTranslation';
import {
  isMoversSortValue,
  MOVERS_SORT_OPTIONS,
  REGION_FILTER_OPTIONS,
  SERVICE_FILTER_OPTIONS,
} from '@/types/mover';

import { MoversSelectDropdown } from './MoversSelectDropdown';

import type {
  MoversFilterActions,
  MoversFilters,
  MoversSearch,
  MoversSort,
} from '../_lib/moversFilters';

export interface MoversToolbarProps {
  filters: MoversFilters;
  filterActions: Pick<
    MoversFilterActions,
    'onRegionChange' | 'onServiceChange'
  >;
  search: MoversSearch;
  sort: MoversSort;
}

/** 검색·정렬·(xl 미만)인라인 필터 툴바 */
export const MoversToolbar = ({
  filters,
  filterActions,
  search,
  sort,
}: MoversToolbarProps) => {
  const { t } = useTranslation();
  const { regionValue, serviceValue } = filters;
  const { onRegionChange, onServiceChange } = filterActions;
  const { searchValue, onSearchChange } = search;
  const { sortValue, onSortChange } = sort;

  const handleSortChange = (value: string) => {
    if (isMoversSortValue(value)) {
      onSortChange(value);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3 xl:hidden">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <MoversSelectDropdown
            label={t('common.region')}
            placeholder={t('common.region')}
            options={REGION_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label:
                option.value === 'ALL'
                  ? t('common.all')
                  : t(`region.${option.value}`),
            }))}
            value={regionValue}
            onValueChange={onRegionChange}
            columns={2}
          />
          <MoversSelectDropdown
            label={t('common.service')}
            placeholder={t('common.service')}
            options={SERVICE_FILTER_OPTIONS.map((option) => ({
              value: option.value,
              label:
                option.value === 'ALL'
                  ? t('common.all')
                  : t(`moveType.${option.value}`),
            }))}
            value={serviceValue}
            onValueChange={onServiceChange}
          />
        </div>
        <Sort
          options={MOVERS_SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`movers.sort.${option.value}`),
          }))}
          value={sortValue}
          onValueChange={handleSortChange}
          size="sm"
          className="z-20"
        />
      </div>

      <div className="hidden justify-end xl:flex">
        <Sort
          options={MOVERS_SORT_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`movers.sort.${option.value}`),
          }))}
          value={sortValue}
          onValueChange={handleSortChange}
          size="md"
          className="z-20"
        />
      </div>

      <TextFieldSearch
        size="sm"
        className="w-full max-w-none xl:h-16 xl:gap-2 xl:px-6 xl:py-3.5 xl:[&_button]:size-9 xl:[&_input]:text-xl-regular xl:[&_svg]:size-9"
        placeholder={t('movers.searchPlaceholder')}
        value={searchValue}
        onChange={onSearchChange}
        aria-label={t('movers.searchAria')}
      />
    </div>
  );
};
