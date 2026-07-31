import {
  ALL_MOVE_TYPES,
  ALL_SCOPES,
  type MoveTypeOption,
  type RequestScopeOption,
} from '@/types/estimateRequest';

/** 이사 유형 옵션 목록 정의 */
export const MOVE_TYPE_OPTIONS: readonly MoveTypeOption[] = ALL_MOVE_TYPES;
/** 요청 범위 옵션 목록 정의 */
export const SCOPE_OPTIONS: readonly RequestScopeOption[] = ALL_SCOPES;

/** 이사 유형 표시 라벨 매핑 */
export const MOVE_TYPE_LABELS: Record<MoveTypeOption, string> = {
  small: '소형이사',
  home: '가정이사',
  office: '사무실이사',
};

/** 요청 범위 표시 라벨 매핑 */
export const SCOPE_LABELS: Record<RequestScopeOption, string> = {
  serviceArea: '서비스 가능 지역',
  designated: '지정 견적 요청',
};

/** 라벨 뒤에 건수 붙이기 */
export const formatFilterLabel = (label: string, count?: number) =>
  count === undefined ? label : `${label} (${count})`;

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
