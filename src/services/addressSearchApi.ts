import {
  ApiError,
  DEFAULT_API_ERROR_MESSAGE,
  createApiTimeoutSignal,
  toNetworkApiError,
} from '@/lib/apiClient';
import {
  addressSearchResultSchema,
  type AddressSearchResult,
} from '@/types/addressSearch';

export interface SearchAddressesParams {
  keyword: string;
  page?: number;
}

interface AddressSearchErrorBody {
  success?: boolean;
  message?: string;
  code?: string;
}

/**
 * Next.js 프록시 GET /api/addresses 호출.
 * 행안부 confmKey는 서버 Route Handler에만 있고, FE는 이 API만 사용한다.
 */
export const searchAddresses = async (
  params: SearchAddressesParams
): Promise<AddressSearchResult> => {
  const keyword = params.keyword.trim();
  if (!keyword) {
    throw new ApiError(400, '검색어를 입력해 주세요.', 'INVALID_KEYWORD');
  }

  const query = new URLSearchParams({
    keyword,
    page: String(params.page ?? 1),
  });

  let response: Response;
  try {
    response = await fetch(`/api/addresses?${query.toString()}`, {
      method: 'GET',
      signal: createApiTimeoutSignal(),
    });
  } catch (error) {
    // AbortError/TimeoutError → TIMEOUT, 그 외 → NETWORK_ERROR
    throw toNetworkApiError(error);
  }

  const body = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: unknown }
    | AddressSearchErrorBody
    | null;

  if (!response.ok) {
    const errorBody = body as AddressSearchErrorBody | null;
    throw new ApiError(
      response.status,
      errorBody?.message ?? DEFAULT_API_ERROR_MESSAGE,
      errorBody?.code
    );
  }

  if (!body || typeof body !== 'object' || !('data' in body)) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }

  const parsed = addressSearchResultSchema.safeParse(
    (body as { data: unknown }).data
  );
  if (!parsed.success) {
    throw new ApiError(500, DEFAULT_API_ERROR_MESSAGE, 'INVALID_RESPONSE');
  }

  return parsed.data;
};
