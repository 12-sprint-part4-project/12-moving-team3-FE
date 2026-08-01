import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import { formatMoveDateLabel, formatShortDateLabel } from '@/lib/formatDate';
import { formatDistrictLabel } from '@/services/estimateRequestApi';
import { API_MOVE_TYPE_TO_UI, MOVE_TYPE_LABELS } from '@/types/estimateRequest';
import type {
  MoverQuotesParams,
  ProposalQuoteBody,
  QuoteDetail,
  QuoteDetailResponse,
  QuoteDetailViewModel,
  QuoteListMeta,
  QuoteListResponse,
  QuoteSubmitBody,
  QuoteSubmitResponse,
  QuoteSubmitResult,
  RejectedQuoteCardModel,
  RejectedQuoteListItem,
  RejectionQuoteBody,
  SentQuoteCardModel,
  SentQuoteListItem,
} from '@/types/quote';

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

  return {
    id: detail.id,
    customerName: detail.customer.name,
    moveType,
    isConfirmed: detail.status === 'CONFIRMED',
    isRejected: detail.status === 'REJECTED',
    isDesignated: detail.isDesignated,
    isMoveCompleted: detail.isMoveCompleted,
    priceLabel: formatQuotePriceLabel(detail.price),
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

const isQuoteListMeta = (meta: unknown): meta is QuoteListMeta => {
  if (!meta || typeof meta !== 'object') {
    return false;
  }

  const listMeta = meta as QuoteListMeta;

  return (
    typeof listMeta.totalCount === 'number' &&
    typeof listMeta.totalPages === 'number' &&
    typeof listMeta.currentPage === 'number' &&
    typeof listMeta.limit === 'number' &&
    typeof listMeta.hasNextPage === 'boolean' &&
    typeof listMeta.hasPrevPage === 'boolean'
  );
};

const isQuoteListResponse = (body: unknown): body is QuoteListResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data, meta } = body as {
    data?: unknown;
    meta?: unknown;
  };

  if (!data || typeof data !== 'object') {
    return false;
  }

  if (!Array.isArray((data as { items?: unknown }).items)) {
    return false;
  }

  return isQuoteListMeta(meta);
};

const isQuoteSubmitResponse = (body: unknown): body is QuoteSubmitResponse => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const { data } = body as { data?: unknown };
  if (!data || typeof data !== 'object') {
    return false;
  }

  const result = data as QuoteSubmitResult;

  return (
    typeof result.id === 'number' &&
    typeof result.estimateRequestId === 'number' &&
    typeof result.status === 'string' &&
    typeof result.isDesignated === 'boolean'
  );
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

  if (!isQuoteSubmitResponse(responseBody)) {
    throw new ApiError(
      response.status,
      DEFAULT_API_ERROR_MESSAGE,
      'INVALID_RESPONSE'
    );
  }

  return responseBody;
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
export const getMoverQuotes = async (
  params: MoverQuotesParams
): Promise<QuoteListResponse> => {
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

  if (!isQuoteListResponse(body)) {
    throw new ApiError(
      response.status,
      DEFAULT_API_ERROR_MESSAGE,
      'INVALID_RESPONSE'
    );
  }

  return body;
};

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
    typeof detail.isMoveCompleted === 'boolean' &&
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
      'INVALID_RESPONSE'
    );
  }

  return body;
};
