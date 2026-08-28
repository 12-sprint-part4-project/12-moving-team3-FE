'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import {
  buildRequestsListHref,
  DEFAULT_REQUESTS_LIST_URL_STATE,
  isRequestsSortValue,
  type RequestsListUrlState,
} from './requestsListSearchParams';

import type {
  MoveTypeOption,
  RequestScopeOption,
  RequestsFilterState,
} from '@/types/estimateRequest';

interface UseRequestsListUrlStateResult {
  listFilters: RequestsListUrlState;
  selectedMoveTypes: MoveTypeOption[];
  selectedScopes: RequestScopeOption[];
  sortValue: RequestsListUrlState['sort'];
  replaceListFilters: (next: RequestsListUrlState) => void;
  commitSearchKeyword: (keyword: string) => void;
  handleMoveTypesChange: (moveTypes: MoveTypeOption[]) => void;
  handleScopesChange: (scopes: RequestScopeOption[]) => void;
  handleSortChange: (value: string) => void;
  handleFilterSubmit: (next: RequestsFilterState) => void;
  resetListFilters: () => void;
}

/**
 * 받은 요청 URL 필터·정렬 상태.
 * - 서버 page searchParams props가 진실 (useSearchParams 미사용)
 * - 클릭 직후 반응을 위해 로컬에 낙관적으로 반영
 * - 서버 props/뒤로가기 변경 시 로컬과 동기화
 */
export const useRequestsListUrlState = (
  initialUrlState: RequestsListUrlState
): UseRequestsListUrlStateResult => {
  const router = useRouter();
  const serverHref = buildRequestsListHref(initialUrlState);
  const [listFilters, setListFilters] = useState(initialUrlState);
  const [syncedServerHref, setSyncedServerHref] = useState(serverHref);

  if (serverHref !== syncedServerHref) {
    setSyncedServerHref(serverHref);
    setListFilters(initialUrlState);
  }

  const replaceListFilters = useCallback(
    (next: RequestsListUrlState) => {
      setListFilters(next);
      router.replace(buildRequestsListHref(next), { scroll: false });
    },
    [router]
  );

  const commitSearchKeyword = useCallback(
    (keyword: string) => {
      const next = { ...listFilters, keyword };
      setListFilters(next);
      router.replace(buildRequestsListHref(next), { scroll: false });
    },
    [listFilters, router]
  );

  const handleMoveTypesChange = useCallback(
    (moveTypes: MoveTypeOption[]) => {
      replaceListFilters({ ...listFilters, moveTypes });
    },
    [listFilters, replaceListFilters]
  );

  const handleScopesChange = useCallback(
    (scopes: RequestScopeOption[]) => {
      replaceListFilters({ ...listFilters, scopes });
    },
    [listFilters, replaceListFilters]
  );

  const handleSortChange = useCallback(
    (value: string) => {
      if (isRequestsSortValue(value)) {
        replaceListFilters({ ...listFilters, sort: value });
      }
    },
    [listFilters, replaceListFilters]
  );

  const handleFilterSubmit = useCallback(
    (next: RequestsFilterState) => {
      replaceListFilters({
        ...listFilters,
        moveTypes: next.moveTypes,
        scopes: next.scopes,
      });
    },
    [listFilters, replaceListFilters]
  );

  const resetListFilters = useCallback(() => {
    replaceListFilters({ ...DEFAULT_REQUESTS_LIST_URL_STATE });
  }, [replaceListFilters]);

  return {
    listFilters,
    selectedMoveTypes: listFilters.moveTypes,
    selectedScopes: listFilters.scopes,
    sortValue: listFilters.sort,
    replaceListFilters,
    commitSearchKeyword,
    handleMoveTypesChange,
    handleScopesChange,
    handleSortChange,
    handleFilterSubmit,
    resetListFilters,
  };
};
