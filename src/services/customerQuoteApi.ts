import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  confirmCustomerQuoteResponseSchema,
  customerPendingQuotesResponseSchema,
  customerQuoteDetailResponseSchema,
} from '@/lib/customerQuoteSchema';
import {
  formatKoreanDateLabel,
  formatKoreanMoveDateLabel,
  formatMoveDateLabel,
  formatShortDateLabel,
} from '@/lib/formatDate';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type {
  ConfirmCustomerQuoteResponse,
  CustomerPendingQuotesData,
  CustomerPendingQuotesResponse,
  CustomerQuoteDetail,
  CustomerQuoteDetailResponse,
  CustomerQuoteDetailViewModel,
  CustomerQuoteItem,
  CustomerQuoteMover,
  CustomerQuoteMoverViewModel,
  PendingQuoteCardModel,
  PendingQuotesPageModel,
  PendingRequestSummaryModel,
} from '@/types/customerQuote';
import type { ApiMoveType } from '@/types/estimateRequest';
import { API_MOVE_TYPE_TO_UI, MOVE_TYPE_LABELS } from '@/types/estimateRequest';

const CUSTOMER_QUOTES_BASE = `${API_BASE_URL}/api/users/customers/quotes`;

interface PendingRequestContext {
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

/** 평점 표시 (소수 1자리) */
const formatRatingLabel = (rating: number): string => rating.toFixed(1);

/** 기사님 BE → UI 모델 */
export const toCustomerQuoteMoverViewModel = (
  mover: CustomerQuoteMover
): CustomerQuoteMoverViewModel => ({
  moverId: mover.moverId,
  nickname: mover.nickname,
  profileImageUrl: mover.profileImage,
  ratingLabel: formatRatingLabel(mover.rating),
  reviewCountLabel: `(${mover.reviewCount.toLocaleString('ko-KR')})`,
  careerLabel:
    mover.career !== null ? `${mover.career.toLocaleString('ko-KR')}년` : null,
  confirmedCountLabel: `${mover.confirmedQuoteCount.toLocaleString('ko-KR')}건`,
  favoriteCount: mover.favoriteCount,
  favoriteCountLabel: mover.favoriteCount.toLocaleString('ko-KR'),
  isFavorited: mover.isFavorited,
});

/** 대기 중 견적 아이템 → 카드 UI 모델 */
export const toPendingQuoteCardModel = (
  item: CustomerQuoteItem,
  request: PendingRequestContext
): PendingQuoteCardModel => ({
  quoteId: item.quoteId,
  moveType: request.serviceType
    ? API_MOVE_TYPE_TO_UI[request.serviceType]
    : null,
  isDesignated: item.isDesignated,
  moveDate: formatMoveDateLabel(request.moveDate),
  departure: request.fromAddress ?? '-',
  arrival: request.toAddress ?? '-',
  priceLabel: formatQuotePriceLabel(item.price),
  mover: toCustomerQuoteMoverViewModel(item.mover),
});

/** 대기 중 요청 요약 UI 모델 */
const toPendingRequestSummaryModel = (
  data: CustomerPendingQuotesData
): PendingRequestSummaryModel => {
  const moveType = data.serviceType
    ? API_MOVE_TYPE_TO_UI[data.serviceType]
    : null;

  return {
    estimateRequestId: data.estimateRequestId,
    serviceLabel: moveType ? MOVE_TYPE_LABELS[moveType] : '-',
    requestedAtLabel: formatKoreanDateLabel(data.submittedAt),
    moveDateLabel: formatKoreanMoveDateLabel(data.moveDate),
    from: data.fromAddress ?? '-',
    to: data.toAddress ?? '-',
  };
};

/** 대기 중 견적 응답 → 페이지 UI 모델 */
export const toPendingQuotesPageModel = (
  data: CustomerPendingQuotesResponse['data']
): PendingQuotesPageModel => {
  if (!data) {
    return {
      summary: null,
      quotes: [],
      isWaitingForQuotes: false,
    };
  }

  const requestContext: PendingRequestContext = {
    serviceType: data.serviceType,
    moveDate: data.moveDate,
    fromAddress: data.fromAddress,
    toAddress: data.toAddress,
  };

  return {
    summary: toPendingRequestSummaryModel(data),
    quotes: data.quotes.map((item) =>
      toPendingQuoteCardModel(item, requestContext)
    ),
    isWaitingForQuotes: data.quotes.length === 0,
  };
};

/** 고객 견적 상세 BE → UI 모델 */
export const toCustomerQuoteDetailViewModel = (
  detail: CustomerQuoteDetail
): CustomerQuoteDetailViewModel => {
  const moveType = detail.serviceType
    ? API_MOVE_TYPE_TO_UI[detail.serviceType]
    : null;

  return {
    quoteId: detail.quoteId,
    estimateRequestId: detail.estimateRequestId,
    moveType,
    isDesignated: detail.isDesignated,
    isPending: detail.status === 'PENDING',
    isConfirmed: detail.status === 'CONFIRMED',
    priceLabel: formatQuotePriceLabel(detail.price),
    comment: detail.comment,
    serviceLabel: moveType ? MOVE_TYPE_LABELS[moveType] : '-',
    requestedAtLabel: formatShortDateLabel(detail.submittedAt),
    moveDateLabel: formatMoveDateLabel(detail.moveDate),
    departure: detail.fromAddress ?? '-',
    arrival: detail.toAddress ?? '-',
    mover: toCustomerQuoteMoverViewModel(detail.mover),
  };
};

/**
 * 대기 중인 견적 리스트 조회.
 * GET /api/users/customers/quotes
 */
export const getCustomerPendingQuotes =
  async (): Promise<CustomerPendingQuotesResponse> => {
    const response = await authFetch(CUSTOMER_QUOTES_BASE, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!response.ok) {
      return throwApiError(response);
    }

    const body: unknown = await response.json().catch(() => null);
    const parsed = customerPendingQuotesResponseSchema.safeParse(body);

    if (!parsed.success) {
      throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
    }

    return parsed.data;
  };

/**
 * 고객 견적 상세 조회.
 * GET /api/users/customers/quotes/:quoteId
 */
export const getCustomerQuoteDetail = async (
  quoteId: number
): Promise<CustomerQuoteDetailResponse> => {
  const response = await authFetch(`${CUSTOMER_QUOTES_BASE}/${quoteId}`, {
    method: 'GET',
    cache: 'no-store',
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = customerQuoteDetailResponseSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }

  return parsed.data;
};

/**
 * 견적 확정하기.
 * PATCH /api/users/customers/quotes/:quoteId
 */
export const confirmCustomerQuote = async (
  quoteId: number
): Promise<ConfirmCustomerQuoteResponse> => {
  const response = await authFetch(`${CUSTOMER_QUOTES_BASE}/${quoteId}`, {
    method: 'PATCH',
    cache: 'no-store',
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = confirmCustomerQuoteResponseSchema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }

  return parsed.data;
};
