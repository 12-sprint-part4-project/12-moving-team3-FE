import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  throwApiError,
} from '@/lib/apiClient';
import { authFetch } from '@/lib/authFetch';
import {
  confirmCustomerQuoteResponseSchema,
  customerPastQuotesResponseSchema,
  customerPendingQuotesResponseSchema,
  customerQuoteDetailResponseSchema,
} from '@/lib/customerQuoteSchema';
import {
  formatKoreanDateLabel,
  formatKoreanMoveDateLabel,
  formatMoveDateLabel,
  formatRelativeTime,
  formatShortDateLabel,
} from '@/lib/formatDate';
import {
  canStartChatForDesignation,
  canStartEstimateChat,
} from '@/lib/startEstimateChat';
import { formatDistrictLabel } from '@/services/estimateRequestApi';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import { i18n } from '@/i18n/i18n';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';

import type { MoveTypeOption } from '@/types/estimateRequest';

import type { EstimateRequestStatus } from '@/types/customerEstimateRequest';
import type {
  ConfirmCustomerQuoteResponse,
  CustomerPastQuoteGroup,
  CustomerPastQuotesParams,
  CustomerPastQuotesResponse,
  CustomerPendingQuotesData,
  CustomerPendingQuotesResponse,
  CustomerQuoteDetail,
  CustomerQuoteDetailResponse,
  CustomerQuoteDetailViewModel,
  CustomerQuoteItem,
  CustomerQuoteMover,
  CustomerQuoteMoverViewModel,
  HistoryQuoteCardModel,
  PendingQuoteCardModel,
  PendingQuotesPageModel,
  PendingRequestSummaryModel,
  QuoteInfoViewModel,
  ReceivedQuoteCardModel,
  ReceivedQuoteGroupModel,
} from '@/types/customerQuote';
import type { ApiMoveType } from '@/types/estimateRequest';
import type { MoverCardModel } from '@/types/mover';
import type { ZodType } from 'zod';

const MOVE_TYPE_I18N_KEY: Record<MoveTypeOption, 'SMALL' | 'HOME' | 'OFFICE'> = {
  small: 'SMALL',
  home: 'HOME',
  office: 'OFFICE',
};

const getMoveTypeLabel = (moveType: MoveTypeOption | null): string =>
  moveType ? i18n.t(`moveType.${MOVE_TYPE_I18N_KEY[moveType]}`) : '-';

const CUSTOMER_QUOTES_BASE = `${API_BASE_URL}/api/users/customers/quotes`;
const CUSTOMER_PAST_QUOTES_URL = `${API_BASE_URL}/api/users/customers/past-quotes`;

/** authFetch + 상태 처리 + JSON 파싱 + zod 검증 공통 흐름 */
const requestCustomerQuoteJson = async <T>(
  url: string,
  init: RequestInit,
  schema: ZodType<T>
): Promise<T> => {
  const response = await authFetch(url, {
    cache: 'no-store',
    ...init,
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  const body: unknown = await response.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError(
      500,
      DEFAULT_API_ERROR_MESSAGE,
      API_ERROR_CODE.INVALID_RESPONSE
    );
  }

  return parsed.data;
};

interface PendingRequestContext {
  estimateRequestId: number;
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}

const EMPTY_RATING_COUNTS = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as const;

/** 기사님 BE → UI 모델 */
export const toCustomerQuoteMoverViewModel = (
  mover: CustomerQuoteMover
): CustomerQuoteMoverViewModel => ({
  moverId: mover.moverId,
  name: mover.name,
  profileImageUrl: mover.profileImage,
  shortDescription: mover.shortDescription,
  averageRating: mover.rating,
  reviewCount: mover.reviewCount,
  career: mover.career,
  confirmedCount: mover.confirmedQuoteCount,
  favoriteCount: mover.favoriteCount,
  isFavorited: mover.isFavorited,
});

/** 견적 기사님 뷰모델 → MoverCard 모델 */
export const toMoverCardModelFromCustomerQuoteMover = (
  mover: CustomerQuoteMoverViewModel
): MoverCardModel => ({
  moverId: mover.moverId,
  name: mover.name,
  profileImageUrl: mover.profileImageUrl,
  services: [],
  regions: [],
  career: mover.career,
  shortDescription: mover.shortDescription,
  description: null,
  averageRating: mover.averageRating,
  reviewCount: mover.reviewCount,
  ratingCounts: EMPTY_RATING_COUNTS,
  isFavorited: mover.isFavorited,
  favoritedCount: mover.favoriteCount,
  confirmedCount: mover.confirmedCount,
});

/** 견적 정보 공통 UI 모델 */
export const toQuoteInfoViewModel = (input: {
  submittedAt: string | null;
  serviceType: ApiMoveType | null;
  moveDate: string | null;
  fromAddress: string | null;
  toAddress: string | null;
}): QuoteInfoViewModel => {
  const moveType = input.serviceType
    ? API_MOVE_TYPE_TO_UI[input.serviceType]
    : null;

  return {
    requestedAtLabel: formatShortDateLabel(input.submittedAt),
    serviceLabel: getMoveTypeLabel(moveType),
    moveDateLabel: formatMoveDateLabel(input.moveDate),
    departure: input.fromAddress ?? '-',
    arrival: input.toAddress ?? '-',
  };
};

/** 대기 중 견적 아이템 → 카드 UI 모델 */
export const toPendingQuoteCardModel = (
  item: CustomerQuoteItem,
  request: PendingRequestContext
): PendingQuoteCardModel => ({
  quoteId: item.quoteId,
  estimateRequestId: request.estimateRequestId,
  moveType: request.serviceType
    ? API_MOVE_TYPE_TO_UI[request.serviceType]
    : null,
  isDesignated: item.isDesignated,
  designatedMoverId: item.designatedMoverId ?? null,
  canStartChat: canStartChatForDesignation(
    item.isDesignated,
    item.designatedMoverId
  ),
  moveDate: formatMoveDateLabel(request.moveDate),
  departure: request.fromAddress ?? '-',
  arrival: request.toAddress ?? '-',
  priceLabel: formatQuotePriceLabel(item.price),
  mover: toCustomerQuoteMoverViewModel(item.mover),
});

/** 받았던 견적 아이템 → 카드 UI 모델 */
export const toReceivedQuoteCardModel = (
  item: CustomerQuoteItem,
  serviceType: ApiMoveType | null
): ReceivedQuoteCardModel => ({
  quoteId: item.quoteId,
  moveType: serviceType ? API_MOVE_TYPE_TO_UI[serviceType] : null,
  isDesignated: item.isDesignated,
  isConfirmed: item.status === 'CONFIRMED',
  shortDescription: item.mover.shortDescription,
  priceLabel: formatQuotePriceLabel(item.price),
  mover: toCustomerQuoteMoverViewModel(item.mover),
});

/** 받았던 견적 그룹 BE → UI 모델 */
export const toReceivedQuoteGroupModel = (
  group: CustomerPastQuoteGroup
): ReceivedQuoteGroupModel => ({
  estimateRequestId: group.estimateRequestId,
  info: toQuoteInfoViewModel(group),
  quotes: group.quotes.map((item) =>
    toReceivedQuoteCardModel(item, group.serviceType)
  ),
});

/** 이용 내역 카드 종료 오버레이 대상 (이사 완료·만료·취소) */
const isClosedHistoryCard = (status: EstimateRequestStatus): boolean =>
  status === 'COMPLETED' || status === 'EXPIRED' || status === 'CANCELED';

/** 과거 견적 그룹 → 이용 내역(확정) 카드 UI 모델 목록 */
export const toHistoryQuoteCardModels = (
  group: CustomerPastQuoteGroup
): HistoryQuoteCardModel[] => {
  const isMoveCompleted = isClosedHistoryCard(group.status);
  const moveType = group.serviceType
    ? API_MOVE_TYPE_TO_UI[group.serviceType]
    : null;
  const departure =
    formatDistrictLabel(group.fromAddress) ?? group.fromAddress ?? '-';
  const arrival =
    formatDistrictLabel(group.toAddress) ?? group.toAddress ?? '-';
  const moveDate = formatMoveDateLabel(group.moveDate);

  return group.quotes
    .filter((item) => item.status === 'CONFIRMED')
    .map((item) => ({
      quoteId: item.quoteId,
      estimateRequestId: group.estimateRequestId,
      moverId: item.mover.moverId,
      moverName: item.mover.name,
      moveType,
      isConfirmed: true,
      isDesignated: item.isDesignated,
      designatedMoverId: item.designatedMoverId ?? null,
      canStartChat: canStartEstimateChat({
        isDesignated: item.isDesignated,
        designatedMoverId: item.designatedMoverId,
        estimateRequestStatus: group.status,
      }),
      moveDate,
      departure,
      arrival,
      priceLabel: formatQuotePriceLabel(item.price),
      relativeTimeLabel: group.confirmedAt
        ? formatRelativeTime(group.confirmedAt)
        : '',
      estimateRequestStatus: group.status,
      isMoveCompleted,
    }));
};

/** 대기 중 요청 요약 UI 모델 */
const toPendingRequestSummaryModel = (
  data: CustomerPendingQuotesData
): PendingRequestSummaryModel => {
  const moveType = data.serviceType
    ? API_MOVE_TYPE_TO_UI[data.serviceType]
    : null;

  return {
    estimateRequestId: data.estimateRequestId,
    serviceLabel: getMoveTypeLabel(moveType),
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
    estimateRequestId: data.estimateRequestId,
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
  const isPending = detail.status === 'PENDING';
  const isConfirmed = detail.status === 'CONFIRMED';
  const canConfirm = isPending && detail.estimateRequestStatus === 'SUBMITTED';
  /** `/quotes/[quoteId]` 채팅 CTA — 닫힌 요청·지정인데 id 없으면 숨김 */
  const canStartChat = canStartEstimateChat({
    isDesignated: detail.isDesignated,
    designatedMoverId: detail.designatedMoverId,
    estimateRequestStatus: detail.estimateRequestStatus,
  });

  return {
    quoteId: detail.quoteId,
    estimateRequestId: detail.estimateRequestId,
    moveType,
    isDesignated: detail.isDesignated,
    designatedMoverId: detail.designatedMoverId ?? null,
    estimateRequestStatus: detail.estimateRequestStatus,
    isPending,
    isConfirmed,
    canConfirm,
    canStartChat,
    showUnconfirmedBanner: isPending && !canConfirm,
    priceLabel: formatQuotePriceLabel(detail.price),
    comment: detail.comment,
    serviceLabel: getMoveTypeLabel(moveType),
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
  async (): Promise<CustomerPendingQuotesResponse> =>
    requestCustomerQuoteJson(
      CUSTOMER_QUOTES_BASE,
      { method: 'GET' },
      customerPendingQuotesResponseSchema
    );

/**
 * 받았던 견적(과거) 리스트 조회.
 * GET /api/users/customers/past-quotes
 */
export const getCustomerPastQuotes = async (
  params: CustomerPastQuotesParams = {}
): Promise<CustomerPastQuotesResponse> => {
  const searchParams = new URLSearchParams();

  if (params.cursor != null) {
    searchParams.set('cursor', String(params.cursor));
  }
  if (params.limit != null) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.filter) {
    searchParams.set('filter', params.filter);
  }
  if (params.estimateRequestId != null) {
    searchParams.set('estimateRequestId', String(params.estimateRequestId));
  }

  const query = searchParams.toString();
  return requestCustomerQuoteJson(
    `${CUSTOMER_PAST_QUOTES_URL}${query ? `?${query}` : ''}`,
    { method: 'GET' },
    customerPastQuotesResponseSchema
  );
};

/**
 * 고객 견적 상세 조회.
 * GET /api/users/customers/quotes/:quoteId
 */
export const getCustomerQuoteDetail = async (
  quoteId: number
): Promise<CustomerQuoteDetailResponse> =>
  requestCustomerQuoteJson(
    `${CUSTOMER_QUOTES_BASE}/${quoteId}`,
    { method: 'GET' },
    customerQuoteDetailResponseSchema
  );

/**
 * 견적 확정하기.
 * PATCH /api/users/customers/quotes/:quoteId
 */
export const confirmCustomerQuote = async (
  quoteId: number
): Promise<ConfirmCustomerQuoteResponse> =>
  requestCustomerQuoteJson(
    `${CUSTOMER_QUOTES_BASE}/${quoteId}`,
    { method: 'PATCH' },
    confirmCustomerQuoteResponseSchema
  );
