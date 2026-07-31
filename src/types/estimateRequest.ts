/** BE MoveType enum */
export type ApiMoveType = 'SMALL' | 'HOME' | 'OFFICE';

/** UI 이사 유형 필터 옵션 */
export type MoveTypeOption = 'small' | 'home' | 'office';

/** UI 요청 범위 필터 옵션 */
export type RequestScopeOption = 'serviceArea' | 'designated';

/** UI 목록 정렬 값 */
export type RequestsSortValue = 'moveDateAsc' | 'requestDateAsc';

/** BE 정렬 쿼리 값 */
export type EstimateRequestSort = 'MOVE_DATE_ASC' | 'SUBMITTED_AT_ASC';

/** 받은 요청 목록 조회 쿼리 파라미터 */
export interface ReceivedEstimateRequestsParams {
  keyword?: string;
  moveTypes?: MoveTypeOption[];
  scopes?: RequestScopeOption[];
  sort?: RequestsSortValue;
  cursor?: string;
  limit?: number;
}

/** BE 목록 아이템 */
export interface EstimateRequestListItem {
  id: number;
  customer: {
    id: string;
    name: string;
  };
  moveType: ApiMoveType | null;
  moveDate: string | null;
  departure: {
    address: string | null;
    regionLabel: string | null;
  };
  arrival: {
    address: string | null;
    regionLabel: string | null;
  };
  isDesignated: boolean;
  submittedAt: string | null;
}

/** BE 필터 건수 */
export interface EstimateRequestFilterCounts {
  moveType: Record<ApiMoveType, number>;
  serviceAreaOnly: number;
  designated: number;
}

/** BE 목록 meta */
export interface EstimateRequestListMeta {
  totalCount: number;
  nextCursor: string | null;
  hasNextPage: boolean;
  filterCounts: EstimateRequestFilterCounts;
}

/** BE 목록 응답 */
export interface EstimateRequestListResponse {
  data: {
    items: EstimateRequestListItem[];
  };
  meta: EstimateRequestListMeta;
}

/** 카드 UI 모델 */
export interface ReceivedRequestCardModel {
  id: number;
  customerName: string;
  moveType: MoveTypeOption | null;
  isDesignated: boolean;
  requestedAgo: string;
  moveDate: string;
  departure: string;
  arrival: string;
}

/** UI 이사 유형 건수 */
export interface MoveTypeFilterCounts {
  small: number;
  home: number;
  office: number;
}

/** UI 요청 범위 건수 */
export interface RequestScopeFilterCounts {
  serviceArea: number;
  designated: number;
}

/** 모바일 필터 모달 제출 값 */
export interface RequestsFilterState {
  moveTypes: MoveTypeOption[];
  scopes: RequestScopeOption[];
}

export const ALL_MOVE_TYPES: MoveTypeOption[] = ['small', 'home', 'office'];
export const ALL_SCOPES: RequestScopeOption[] = ['serviceArea', 'designated'];

export const MOVE_TYPE_TO_API: Record<MoveTypeOption, ApiMoveType> = {
  small: 'SMALL',
  home: 'HOME',
  office: 'OFFICE',
};

export const API_MOVE_TYPE_TO_UI: Record<ApiMoveType, MoveTypeOption> = {
  SMALL: 'small',
  HOME: 'home',
  OFFICE: 'office',
};

export const SORT_VALUE_TO_API: Record<RequestsSortValue, EstimateRequestSort> =
  {
    moveDateAsc: 'MOVE_DATE_ASC',
    requestDateAsc: 'SUBMITTED_AT_ASC',
  };
