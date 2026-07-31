import { API_BASE_URL, ApiError, getAccessToken } from '@/services/apiClient';
import type { ApiErrorBody } from '@/types/api';
import type {
  ProposalQuoteBody,
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
    body?.error?.code ?? 'UNKNOWN_ERROR',
    body?.error?.message ?? '요청 처리 중 오류가 발생했습니다.'
  );
};

/**
 * 견적 보내기.
 * POST /api/users/movers/estimate-requests/:estimateRequestId/quotes
 */
export const submitProposalQuote = async (
  estimateRequestId: number,
  payload: Omit<ProposalQuoteBody, 'type'>
): Promise<QuoteSubmitResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/movers/estimate-requests/${estimateRequestId}/quotes`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        type: 'PROPOSAL',
        price: payload.price,
        comment: payload.comment,
      } satisfies ProposalQuoteBody),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as QuoteSubmitResponse;
};

/**
 * 견적 요청 반려.
 * POST /api/users/movers/estimate-requests/:estimateRequestId/quotes
 */
export const submitRejectionQuote = async (
  estimateRequestId: number,
  payload: Omit<RejectionQuoteBody, 'type'>
): Promise<QuoteSubmitResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/movers/estimate-requests/${estimateRequestId}/quotes`,
    {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        type: 'REJECTION',
        rejectReason: payload.rejectReason,
      } satisfies RejectionQuoteBody),
    }
  );

  if (!response.ok) {
    return parseError(response);
  }

  return (await response.json()) as QuoteSubmitResponse;
};
