export const COMMUNITY_SEARCH_DEBOUNCE_MS = 1000;

/** 디바운스된 입력에서 API keyword 파라미터를 결정한다. */
export const getCommunitySearchKeyword = (
  debouncedSearch: string
): string | undefined => {
  const trimmed = debouncedSearch.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};
