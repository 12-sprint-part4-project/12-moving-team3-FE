import { ApiError } from '@/lib/apiClient';
import {
  API_BASE_URL,
  createApiTimeoutSignal,
  getAccessToken,
} from '@/services/apiClient.legacy';
import type { ApiErrorBody } from '@/types/api';
import type {
  ProposalQuoteBody,
  QuoteSubmitBody,
  QuoteSubmitResponse,
  RejectionQuoteBody,
} from '@/types/quote';

const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseError = async (response: Response): Promise<never> => {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.',
    body?.error?.code ?? 'UNKNOWN_ERROR'
  );
};

/** 견적 제출 공통 요청 */
const submitQuote = async (
  estimateRequestId: number,
  body: QuoteSubmitBody
): Promise<QuoteSubmitResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/movers/estimate-requests/${estimateRequestId}/quotes`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
      signal: createApiTimeoutSignal(),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as QuoteSubmitResponse;
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
