'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
} from 'react';

import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const SEARCH_DEBOUNCE_MS = 300;

interface UseRequestsListSearchParams {
  /** URL에 반영된 검색어 */
  urlKeyword: string;
  /** 검색어를 URL에 커밋 */
  onCommitKeyword: (keyword: string) => void;
}

interface UseRequestsListSearchResult {
  searchInputValue: string;
  /** API 조회용 디바운스된 검색어 */
  queryKeyword: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  handleSearch: () => void;
  handleSearchClear: () => void;
  /** 전체 초기화 등 외부에서 draft를 맞출 때 사용 */
  setSearchDraft: (keyword: string) => void;
}

/**
 * 받은 요청 검색어 상태.
 * - 입력: local draft
 * - 조회: draft 디바운스
 * - URL: 디바운스 완료·검색·지우기 시 커밋
 * - 브라우저 뒤로가기 등 URL 변경: draft를 URL에 맞춤
 */
export const useRequestsListSearch = ({
  urlKeyword,
  onCommitKeyword,
}: UseRequestsListSearchParams): UseRequestsListSearchResult => {
  const [draft, setDraft] = useState(urlKeyword);
  const [urlSnapshot, setUrlSnapshot] = useState(urlKeyword);
  const debouncedDraft = useDebouncedValue(draft, SEARCH_DEBOUNCE_MS);

  /** 외부 URL 변경 → draft 동기화 */
  if (urlKeyword !== urlSnapshot) {
    setUrlSnapshot(urlKeyword);
    setDraft(urlKeyword);
  }

  /** 디바운스 완료 후 URL 커밋 */
  useEffect(() => {
    if (debouncedDraft !== draft) {
      return;
    }

    const nextKeyword = debouncedDraft.trim();
    if (nextKeyword === urlKeyword) {
      return;
    }

    onCommitKeyword(nextKeyword);
  }, [debouncedDraft, draft, urlKeyword, onCommitKeyword]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value);
  };

  const handleSearch = () => {
    const nextKeyword = draft.trim();
    setDraft(nextKeyword);
    if (nextKeyword !== urlKeyword) {
      onCommitKeyword(nextKeyword);
    }
  };

  const handleSearchClear = () => {
    setDraft('');
    if (urlKeyword !== '') {
      onCommitKeyword('');
    }
  };

  return {
    searchInputValue: draft,
    queryKeyword: debouncedDraft.trim(),
    handleSearchChange,
    handleSearch,
    handleSearchClear,
    setSearchDraft: setDraft,
  };
};
