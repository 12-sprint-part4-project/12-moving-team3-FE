import {
  ApiError,
  createApiTimeoutSignal,
  getAccessToken,
  mergeAbortSignals,
  toNetworkApiError,
} from '@/lib/apiClient';
import { isAuthRetryExcludedPath, refreshAccessToken } from '@/lib/authRefresh';

/**
 * 보호 API용 fetch.
 * 401 시 refresh 1회 후 동일 요청을 새 Access로 재시도한다.
 */
export const authFetch = async (
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> => {
  const requestUrl =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  const buildInit = (
    accessToken: string | null,
    signal?: AbortSignal
  ): RequestInit => {
    const headers = new Headers(init.headers);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return {
      ...init,
      credentials: 'include',
      headers,
      ...(signal ? { signal } : {}),
    };
  };

  const request = async (accessToken: string | null, signal?: AbortSignal) => {
    try {
      return await fetch(input, buildInit(accessToken, signal));
    } catch (error) {
      throw toNetworkApiError(error);
    }
  };

  const firstSignal = mergeAbortSignals(init.signal, createApiTimeoutSignal());
  const response = await request(getAccessToken(), firstSignal);

  if (response.status !== 401 || isAuthRetryExcludedPath(requestUrl)) {
    return response;
  }

  try {
    const newAccessToken = await refreshAccessToken();
    const retrySignal = mergeAbortSignals(
      init.signal,
      createApiTimeoutSignal()
    );
    return await request(newAccessToken, retrySignal);
  } catch (error) {
    // refresh·재시도 fetch의 네트워크·타임아웃은 그대로 전달
    if (
      error instanceof ApiError &&
      (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT')
    ) {
      throw error;
    }
    // 세션 만료 등 refresh 인증 실패 시에는 원래 401 응답을 반환
    return response;
  }
};
