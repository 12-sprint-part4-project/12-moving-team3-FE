import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';

/**
 * 기사님(movers/favorites) 도메인 전용 Access Token 조회.
 * 로그인 세션(authSession)만 사용 — 공통 apiClient.legacy는 수정하지 않는다.
 * 실제 보호 API 호출은 authFetch(401→refresh)를 사용하고,
 * 이 헬퍼는 토큰 유무 가드·query enabled에 쓴다.
 */
export const getMoverAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return getAuthSession()?.accessToken ?? null;
};

/** 로그인(Access Token) 필수 — 없으면 요청 전 실패 */
export const assertMoverAccessToken = (): void => {
  if (!getMoverAccessToken()) {
    throw new ApiError(401, '로그인이 필요한 기능입니다.', 'UNAUTHORIZED');
  }
};
