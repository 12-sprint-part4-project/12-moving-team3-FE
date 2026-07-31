import type { ApiUserType } from '@/types/auth';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

/**
 * 카카오 인가 코드 요청 URL을 만든다.
 * userType은 OAuth `state`에 실어 콜백에서 복원한다.
 */
export const getKakaoAuthorizeUrl = (userType: ApiUserType): string => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('카카오 로그인 환경변수가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state: userType,
  });

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

/** 카카오 로그인 화면으로 이동한다. */
export const redirectToKakaoLogin = (userType: ApiUserType): void => {
  window.location.assign(getKakaoAuthorizeUrl(userType));
};
