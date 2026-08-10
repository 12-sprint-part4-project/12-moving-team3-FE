import {
  ALL_MOVE_TYPES,
  ALL_SCOPES,
  type MoveTypeOption,
  type RequestScopeOption,
  type RequestsSortValue,
} from '@/types/estimateRequest';

/** 받은 요청 목록 URL 쿼리와 동기화하는 검색·필터·정렬 */
export interface RequestsListUrlState {
  keyword: string;
  moveTypes: MoveTypeOption[];
  scopes: RequestScopeOption[];
  sort: RequestsSortValue;
}

export const DEFAULT_REQUESTS_LIST_URL_STATE: RequestsListUrlState = {
  keyword: '',
  moveTypes: [...ALL_MOVE_TYPES],
  scopes: [...ALL_SCOPES],
  sort: 'moveDateAsc',
};

const EMPTY_SENTINEL = 'none';

const isMoveTypeOption = (value: string): value is MoveTypeOption =>
  ALL_MOVE_TYPES.includes(value as MoveTypeOption);

const isRequestScopeOption = (value: string): value is RequestScopeOption =>
  ALL_SCOPES.includes(value as RequestScopeOption);

export const isRequestsSortValue = (
  value: string
): value is RequestsSortValue =>
  value === 'moveDateAsc' || value === 'requestDateAsc';

/** CSV 쿼리 → 옵션 배열. 없으면 전체, `none`/빈 문자열이면 빈 배열 */
const parseOptionCsv = <T extends string>(
  raw: string | null,
  isValid: (value: string) => value is T,
  all: readonly T[]
): T[] => {
  if (raw === null) {
    return [...all];
  }

  if (raw === '' || raw === EMPTY_SENTINEL) {
    return [];
  }

  const parsed = raw
    .split(',')
    .map((item) => item.trim())
    .filter(isValid);

  return parsed.length > 0 ? parsed : [...all];
};

/** 옵션 배열 → CSV. 전체면 null(생략), 빈 배열이면 none */
const toOptionCsv = <T extends string>(
  items: readonly T[],
  all: readonly T[]
): string | null => {
  if (items.length === 0) {
    return EMPTY_SENTINEL;
  }

  if (items.length >= all.length && all.every((item) => items.includes(item))) {
    return null;
  }

  return [...items].sort().join(',');
};

const areSameOptions = <T extends string>(
  left: readonly T[],
  right: readonly T[]
): boolean =>
  left.length === right.length && left.every((item) => right.includes(item));

/** 검색·필터·정렬이 모두 기본값인지 */
export const isDefaultRequestsListUrlState = (
  state: RequestsListUrlState
): boolean =>
  state.keyword.trim() === '' &&
  state.sort === DEFAULT_REQUESTS_LIST_URL_STATE.sort &&
  areSameOptions(state.moveTypes, ALL_MOVE_TYPES) &&
  areSameOptions(state.scopes, ALL_SCOPES);

/** URL searchParams → 검색·필터·정렬 상태 */
export const parseRequestsListSearchParams = (
  searchParams: Pick<URLSearchParams, 'get'>
): RequestsListUrlState => {
  const sortRaw = searchParams.get('sort');
  const sort =
    sortRaw !== null && isRequestsSortValue(sortRaw)
      ? sortRaw
      : DEFAULT_REQUESTS_LIST_URL_STATE.sort;

  return {
    keyword: searchParams.get('keyword')?.trim() ?? '',
    moveTypes: parseOptionCsv(
      searchParams.get('moveTypes'),
      isMoveTypeOption,
      ALL_MOVE_TYPES
    ),
    scopes: parseOptionCsv(
      searchParams.get('scopes'),
      isRequestScopeOption,
      ALL_SCOPES
    ),
    sort,
  };
};

/** 검색·필터·정렬 상태 → URL searchParams (기본값은 생략) */
export const buildRequestsListSearchParams = (
  state: RequestsListUrlState
): URLSearchParams => {
  const params = new URLSearchParams();

  const keyword = state.keyword.trim();
  if (keyword) {
    params.set('keyword', keyword);
  }

  const moveTypesCsv = toOptionCsv(state.moveTypes, ALL_MOVE_TYPES);
  if (moveTypesCsv !== null) {
    params.set('moveTypes', moveTypesCsv);
  }

  const scopesCsv = toOptionCsv(state.scopes, ALL_SCOPES);
  if (scopesCsv !== null) {
    params.set('scopes', scopesCsv);
  }

  if (state.sort !== DEFAULT_REQUESTS_LIST_URL_STATE.sort) {
    params.set('sort', state.sort);
  }

  return params;
};

export const buildRequestsListHref = (state: RequestsListUrlState): string => {
  const qs = buildRequestsListSearchParams(state).toString();
  return qs ? `/mover/requests?${qs}` : '/mover/requests';
};
