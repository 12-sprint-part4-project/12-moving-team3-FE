import { useCallback, useMemo, useState, type ChangeEvent } from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  isApiMoveType,
  isApiRegion,
  type ApiMoveType,
  type ApiRegion,
  type MoversSortValue,
} from '@/types/mover';

import type {
  MoversFilterActions,
  MoversFilters,
  MoversSearch,
  MoversSort,
} from './moversFilters';

const SEARCH_DEBOUNCE_MS = 300;

/**
 * 기사님 찾기 — 지역/서비스/검색/정렬 상태와 묶음 props.
 */
export const useMoversFilters = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sortValue, setSortValue] =
    useState<MoversSortValue>('reviewCountDesc');
  const [regionValue, setRegionValue] = useState('ALL');
  const [serviceValue, setServiceValue] = useState('ALL');

  const debouncedSearch = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS);

  const selectedRegions = useMemo((): ApiRegion[] => {
    if (regionValue === 'ALL' || !isApiRegion(regionValue)) {
      return [];
    }
    return [regionValue];
  }, [regionValue]);

  const selectedMoveTypes = useMemo((): ApiMoveType[] => {
    if (serviceValue === 'ALL' || !isApiMoveType(serviceValue)) {
      return [];
    }
    return [serviceValue];
  }, [serviceValue]);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(event.target.value);
    },
    []
  );

  const handleResetFilters = useCallback(() => {
    setRegionValue('ALL');
    setServiceValue('ALL');
  }, []);

  const handleResetAll = useCallback(() => {
    setSearchValue('');
    handleResetFilters();
  }, [handleResetFilters]);

  const filters = useMemo(
    (): MoversFilters => ({ regionValue, serviceValue }),
    [regionValue, serviceValue]
  );

  const filterActions = useMemo(
    (): MoversFilterActions => ({
      onRegionChange: setRegionValue,
      onServiceChange: setServiceValue,
      onResetFilters: handleResetFilters,
    }),
    [handleResetFilters]
  );

  const search = useMemo(
    (): MoversSearch => ({
      searchValue,
      onSearchChange: handleSearchChange,
    }),
    [searchValue, handleSearchChange]
  );

  const sort = useMemo(
    (): MoversSort => ({
      sortValue,
      onSortChange: setSortValue,
    }),
    [sortValue]
  );

  return {
    filters,
    filterActions,
    search,
    sort,
    selectedRegions,
    selectedMoveTypes,
    debouncedSearch,
    sortValue,
    handleResetAll,
  };
};
