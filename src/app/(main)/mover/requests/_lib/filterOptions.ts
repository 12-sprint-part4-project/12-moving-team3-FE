import {
  ALL_MOVE_TYPES,
  ALL_SCOPES,
  MOVE_TYPE_LABELS,
  type MoveTypeOption,
  type RequestScopeOption,
  type RequestsSortValue,
} from '@/types/estimateRequest';

/** 이사 유형 옵션 목록 정의 */
export const MOVE_TYPE_OPTIONS: readonly MoveTypeOption[] = ALL_MOVE_TYPES;
/** 요청 범위 옵션 목록 정의 */
export const SCOPE_OPTIONS: readonly RequestScopeOption[] = ALL_SCOPES;

export { MOVE_TYPE_LABELS };

/** 요청 범위 표시 라벨 매핑 */
export const SCOPE_LABELS: Record<RequestScopeOption, string> = {
  serviceArea: '서비스 가능 지역',
  designated: '지정 견적 요청',
};

/** 받은 요청 목록 정렬 옵션 */
export const REQUESTS_SORT_OPTIONS: {
  label: string;
  value: RequestsSortValue;
}[] = [
  { label: '이사 빠른순', value: 'moveDateAsc' },
  { label: '요청일 빠른순', value: 'requestDateAsc' },
];

/** 체크 상태에 따라 필터 항목 추가·제거  (중복 방지) */
export const toggleFilterItem = <T>(
  items: readonly T[],
  item: T,
  checked: boolean
): T[] => {
  if (checked) {
    return items.includes(item) ? [...items] : [...items, item];
  }
  return items.filter((current) => current !== item);
};
