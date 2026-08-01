import {
  isAuthRetryExcludedPath,
  refreshAccessToken,
} from '@/lib/authRefresh';
import { getAuthSession } from '@/lib/authSession';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

/** @deprecated authSession.accessToken을 사용한다. 하위 호환용 키 */
export const ACCESS_TOKEN_KEY = 'accessToken';

/** API fetch 기본 타임아웃(ms) */
export const API_FETCH_TIMEOUT_MS = 10_000;

/** 기본 타임아웃용 AbortSignal */
export const createApiTimeoutSignal = (
  timeoutMs: number = API_FETCH_TIMEOUT_MS
): AbortSignal => AbortSignal.timeout(timeoutMs);

/** authSession에 저장된 Access Token */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return getAuthSession()?.accessToken ?? null;
};

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

  const buildInit = (accessToken: string | null): RequestInit => {
    const headers = new Headers(init.headers);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return {
      ...init,
      credentials: 'include',
      headers,
    };
  };

  const response = await fetch(input, buildInit(getAccessToken()));

  if (response.status !== 401 || isAuthRetryExcludedPath(requestUrl)) {
    return response;
  }

  try {
    const newAccessToken = await refreshAccessToken();
    return fetch(input, buildInit(newAccessToken));
  } catch {
    return response;
  }
};
