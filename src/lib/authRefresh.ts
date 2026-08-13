import { API_ERROR_CODE } from '@/constants/errorCode';
import {
  API_BASE_URL,
  ApiError,
  createApiTimeoutSignal,
  toNetworkApiError,
} from '@/lib/apiClient';
import { clearAuthSession, updateAuthAccessToken } from '@/lib/authSession';
import type { ApiErrorBody } from '@/types/api';
import type { RefreshResponse } from '@/types/auth';

/** 401 refresh 재시도 루프에 넣지 않을 경로 */
export const AUTH_RETRY_EXCLUDED_PATHS = [
  '/api/auth/refresh',
  '/api/auth/login',
  '/api/auth/logout',
] as const;

let inflightRefresh: Promise<string> | null = null;

export const isAuthRetryExcludedPath = (pathOrUrl: string): boolean => {
  try {
    const pathname = pathOrUrl.startsWith('http')
      ? new URL(pathOrUrl).pathname
      : (pathOrUrl.split('?')[0] ?? pathOrUrl);

    return AUTH_RETRY_EXCLUDED_PATHS.some(
      (excluded) => pathname === excluded || pathname.endsWith(excluded)
    );
  } catch {
    return AUTH_RETRY_EXCLUDED_PATHS.some((excluded) =>
      pathOrUrl.includes(excluded)
    );
  }
};

/**
 * POST /api/auth/refresh (credentials include).
 * 동시 호출은 하나의 Promise로 묶는다.
 */
export const refreshAccessToken = (): Promise<string> => {
  if (inflightRefresh) {
    return inflightRefresh;
  }

  inflightRefresh = (async () => {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        signal: createApiTimeoutSignal(),
      });
    } catch (error) {
      throw toNetworkApiError(error);
    }

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      clearAuthSession();
      const errorBody = payload as ApiErrorBody | null;
      throw new ApiError(
        response.status,
        errorBody?.error?.message ??
          '로그인이 만료되었습니다. 다시 로그인해 주세요.',
        errorBody?.error?.code
      );
    }

    const accessToken = (payload as RefreshResponse | null)?.data?.accessToken;

    if (!accessToken || !updateAuthAccessToken(accessToken)) {
      clearAuthSession();
      throw new ApiError(
        401,
        '로그인이 만료되었습니다. 다시 로그인해 주세요.',
        API_ERROR_CODE.UNAUTHORIZED
      );
    }

    return accessToken;
  })().finally(() => {
    inflightRefresh = null;
  });

  return inflightRefresh;
};
