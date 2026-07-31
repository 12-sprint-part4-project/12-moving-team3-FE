export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

/** Access Token localStorage 키 */
export const ACCESS_TOKEN_KEY = 'accessToken';

/** API fetch 기본 타임아웃(ms) */
export const API_FETCH_TIMEOUT_MS = 10_000;

/** 기본 타임아웃용 AbortSignal */
export const createApiTimeoutSignal = (
  timeoutMs: number = API_FETCH_TIMEOUT_MS
): AbortSignal => AbortSignal.timeout(timeoutMs);

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string | null): void => {
  if (typeof window === 'undefined') {
    return;
  }
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
