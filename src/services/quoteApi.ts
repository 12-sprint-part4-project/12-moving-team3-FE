import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import { formatMoveDateLabel, formatRelativeTime, formatShortDateLabel } from '@/lib/formatDate';
import {
  quoteListResponseSchema,
  quoteSubmitResponseSchema,
} from '@/lib/quoteSchema';
import { isEstimateRequestClosedForChat } from '@/lib/startEstimateChat';
import { formatDistrictLabel } from '@/services/estimateRequestApi';
import { API_MOVE_TYPE_TO_UI, MOVE_TYPE_LABELS } from '@/types/estimateRequest';
import type {
  MoverQuotesParams,
  ProposalQuoteBody,
  QuoteDetail,
  QuoteDetailResponse,
  QuoteDetailViewModel,
  QuoteListResponse,
  QuoteSubmitBody,
  QuoteSubmitResponse,
  RejectedQuoteCardModel,
  RejectedQuoteListItem,
  RejectionQuoteBody,
  SentQuoteCardModel,
  SentQuoteListItem,
} from '@/types/quote';

type SentQuotesParams = MoverQuotesParams & { status: 'SENT' };
type RejectedQuotesParams = MoverQuotesParams & { status: 'REJECTED' };

const JSON_HEADERS: HeadersInit = {
  'Content-Type': 'application/json',
};

/** 견적 금액 표시 문자열 */
export const formatQuotePriceLabel = (price: number | null): string => {
  if (price === null) {
    return '-';
  }

  return `${price.toLocaleString('ko-KR')}원`;
};

/** 보낸 견적 BE 아이템 → 카드 UI 모델 */
export const toSentQuoteCardModel = (
  item: SentQuoteListItem
): SentQuoteCardModel => ({
  id: item.id,
  customerName: item.customer.name,
  moveType: item.moveType ? API_MOVE_TYPE_TO_UI[item.moveType] : null,
  isConfirmed: item.isConfirmed,
  isDesignated: item.isDesignated,
  moveDate: formatMoveDateLabel(item.moveDate),
  departure: item.fromRegionLabel ?? '-',
  arrival: item.toRegionLabel ?? '-',
  priceLabel: formatQuotePriceLabel(item.price),
  relativeTimeLabel: formatRelativeTime(item.createdAt),
  estimateRequestStatus: item.estimateRequestStatus,
  isMoveCompleted: item.isMoveCompleted,
});

/** 반려 견적 BE 아이템 → 카드 UI 모델 */
export const toRejectedQuoteCardModel = (
  item: RejectedQuoteListItem
): RejectedQuoteCardModel => ({
  id: item.id,
  customerName: item.customer.name,
  moveType: item.moveType ? API_MOVE_TYPE_TO_UI[item.moveType] : null,
  isDesignated: item.isDesignated,
  moveDate: formatMoveDateLabel(item.moveDate),
  departure: item.fromRegionLabel ?? '-',
  arrival: item.toRegionLabel ?? '-',
});

/** 견적 상세 BE → UI 모델 */
export const toQuoteDetailViewModel = (
  detail: QuoteDetail
): QuoteDetailViewModel => {
  const moveType = detail.moveType
    ? API_MOVE_TYPE_TO_UI[detail.moveType]
    : null;
  const isRejected = detail.status === 'REJECTED';
  /** `/mover/quotes/[quoteId]` 채팅 CTA — 반려·닫힌 요청·지정 id 없으면 숨김 */
  const canStartChat =
    !isRejected &&
    !isEstimateRequestClosedForChat(detail.estimateRequestStatus) &&
    (!detail.isDesignated || detail.designatedMoverId != null);

  return {
    id: detail.id,
    estimateRequestId: detail.estimateRequestId,
    customerName: detail.customer.name,
    moveType,
    isConfirmed: detail.status === 'CONFIRMED',
    isRejected,
    isDesignated: detail.isDesignated,
    designatedMoverId: detail.designatedMoverId ?? null,
    estimateRequestStatus: detail.estimateRequestStatus,
    isMoveCompleted: detail.isMoveCompleted,
    canStartChat,
    priceLabel: formatQuotePriceLabel(detail.price),
    comment: detail.comment,
    rejectReason: detail.rejectReason,
    requestedAtLabel: formatShortDateLabel(detail.requestedAt),
    serviceLabel: moveType ? MOVE_TYPE_LABELS[moveType] : '-',
    moveDateLabel: formatMoveDateLabel(detail.moveDate),
    departure: detail.fromAddress ?? '-',
    arrival: detail.toAddress ?? '-',
    summaryDeparture:
      formatDistrictLabel(detail.fromAddress) ?? detail.fromAddress ?? '-',
    summaryArrival:
      formatDistrictLabel(detail.toAddress) ?? detail.toAddress ?? '-',
  };
};

/** 견적 목록 조회 쿼리스트링 생성 */
export const buildMoverQuotesQuery = (params: MoverQuotesParams): string => {
  const searchParams = new URLSearchParams();
  searchParams.set('status', params.status);

  if (params.page !== undefined) {
    searchParams.set('page', String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

/** 견적 제출 공통 요청 */
const submitQuote = async (
  estimateRequestId: number,
  body: QuoteSubmitBody
): Promise<QuoteSubmitResponse> => {
  const response = await authFetch(
    `${API_BASE_URL}/api/users/movers/estimate-requests/${estimateRequestId}/quotes`,
    {
      method: 'POST',
      cache: 'no-store',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    return throwApiError(response);
  }

  const responseBody: unknown = await response.json().catch(() => null);
  const parsed = quoteSubmitResponseSchema.safeParse(responseBody);

  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, API_ERROR_CODE.INVALID_RESPONSE);
  }

  return parsed.data;
};

/**
 * 견적 보내기.
 * POST /api/users/movers/estimate-requests/:estimateRequestId/quotes
 */
export const submitProposalQuote = async (
  estimateRequestId: number,
  payload: Omit<ProposalQuoteBody, 'type'>
): Promise<QuoteSubmitResponse> =>
  submitQuote(estimateRequestId, {
    type: 'PROPOSAL',
    price: payload.price,
    comment: payload.comment,
  } satisfies ProposalQuoteBody);

/**
 * 견적 요청 반려.
 * POST /api/users/movers/estimate-requests/:estimateRequestId/quotes
 */
export const submitRejectionQuote = async (
  estimateRequestId: number,
  payload: Omit<RejectionQuoteBody, 'type'>
): Promise<QuoteSubmitResponse> =>
  submitQuote(estimateRequestId, {
    type: 'REJECTION',
    rejectReason: payload.rejectReason,
  } satisfies RejectionQuoteBody);

/**
 * 보낸 견적 / 반려한 견적 목록 조회.
 * GET /api/users/movers/quotes
 */
export function getMoverQuotes(
  params: SentQuotesParams
): Promise<QuoteListResponse<SentQuoteListItem>>;
export function getMoverQuotes(
  params: RejectedQuotesParams
): Promise<QuoteListResponse<RejectedQuoteListItem>>;
export function getMoverQuotes(
  params: MoverQuotesParams
): Promise<QuoteListResponse>;
export async function getMoverQuotes(
  params: MoverQuotesParams
): Promise<QuoteListResponse> {
  const query = buildMoverQuotesQuery(params);

  const response = await authFetch(
    `${API_BASE_URL}/api/users/movers/quotes${query}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = quoteListResponseSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, API_ERROR_CODE.INVALID_RESPONSE);
  }

  return parsed.data as QuoteListResponse;
}

const isQuoteDetailResponse = (body: unknown): body is QuoteDetailResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data } = body as { data?: unknown };
  if (!data || typeof data !== 'object') {
    return false;
  }

  const detail = data as QuoteDetail;

  return (
    typeof detail.id === 'number' &&
    typeof detail.estimateRequestId === 'number' &&
    typeof detail.status === 'string' &&
    typeof detail.estimateRequestStatus === 'string' &&
    typeof detail.isMoveCompleted === 'boolean' &&
    typeof detail.isDesignated === 'boolean' &&
    (detail.designatedMoverId === null ||
      typeof detail.designatedMoverId === 'number') &&
    (detail.comment === null || typeof detail.comment === 'string') &&
    (detail.rejectReason === null || typeof detail.rejectReason === 'string') &&
    !!detail.customer &&
    typeof detail.customer.name === 'string'
  );
};

/**
 * 보낸 견적 / 반려 견적 상세 조회.
 * GET /api/users/movers/quotes/:quoteId
 */
export const getMoverQuoteDetail = async (
  quoteId: number
): Promise<QuoteDetailResponse> => {
  const response = await authFetch(
    `${API_BASE_URL}/api/users/movers/quotes/${quoteId}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);

  if (!isQuoteDetailResponse(body)) {
    throw new ApiError(
      response.status,
      DEFAULT_API_ERROR_MESSAGE,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }

  return body;
};
