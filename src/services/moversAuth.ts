import { getAuthSession } from '@/lib/authSession';

/**
 * 기사님(movers/favorites) 도메인 전용 Access Token.
 * 로그인 세션(authSession)만 사용 — 공통 apiClient.legacy는 수정하지 않는다.
 */
export const getMoverAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return getAuthSession()?.accessToken ?? null;
};
