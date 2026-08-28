import type { MoversSortValue } from '@/types/mover';
import type { ChangeEvent } from 'react';

export interface MoversFilters {
  regionValue: string;
  serviceValue: string;
}

export interface MoversFilterActions {
  onRegionChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onResetFilters: () => void;
}

export interface MoversSearch {
  searchValue: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface MoversSort {
  sortValue: MoversSortValue;
  onSortChange: (value: MoversSortValue) => void;
}
