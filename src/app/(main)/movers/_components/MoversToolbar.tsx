'use client';

import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Sort } from '@/components/ui/Sort/Sort';
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
            label="지역"
            placeholder="지역"
            options={REGION_FILTER_OPTIONS}
            value={regionValue}
            onValueChange={onRegionChange}
            columns={2}
          />
          <MoversSelectDropdown
            label="서비스"
            placeholder="서비스"
            options={SERVICE_FILTER_OPTIONS}
            value={serviceValue}
            onValueChange={onServiceChange}
          />
        </div>
        <Sort
          options={MOVERS_SORT_OPTIONS}
          value={sortValue}
          onValueChange={handleSortChange}
          size="sm"
          className="z-20"
        />
      </div>

      <div className="hidden justify-end xl:flex">
        <Sort
          options={MOVERS_SORT_OPTIONS}
          value={sortValue}
          onValueChange={handleSortChange}
          size="md"
          className="z-20"
        />
      </div>

      <TextFieldSearch
        size="sm"
        className="w-full max-w-none lg:h-16 lg:gap-2 lg:px-6 lg:py-3.5 lg:[&_button]:size-9 lg:[&_input]:text-xl-regular lg:[&_svg]:size-9"
        placeholder="검색어를 입력해 주세요"
        value={searchValue}
        onChange={onSearchChange}
        aria-label="기사님 이름 검색"
      />
    </div>
  );
};
