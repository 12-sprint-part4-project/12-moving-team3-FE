import type { ApiUserType } from '@/types/auth';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';

type SearchParamsReader = {
  get: (key: string) => string | null;
};

export interface KakaoCallbackSuccess {
  ok: true;
  code: string;
  userType: ApiUserType;
}

export interface KakaoCallbackFailure {
  ok: false;
  reason: 'denied' | 'missing_code' | 'invalid_state';
  message: string;
}

export type KakaoCallbackResult = KakaoCallbackSuccess | KakaoCallbackFailure;

export const isApiUserType = (value: string): value is ApiUserType => {
  return value === 'CUSTOMER' || value === 'MOVER';
};

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

/**
 * 카카오 콜백 쿼리에서 code / state를 파싱한다.
 * code는 일회용·민감값이므로 호출부에서 로그에 남기지 않는다.
 */
export const parseKakaoCallbackParams = (
  params: SearchParamsReader
): KakaoCallbackResult => {
  const error = params.get('error');

  if (error) {
    return {
      ok: false,
      reason: 'denied',
      message: '카카오 로그인이 취소되었습니다.',
    };
  }

  const code = params.get('code');
  const state = params.get('state');

  if (!code) {
    return {
      ok: false,
      reason: 'missing_code',
      message: '인가 코드를 받지 못했습니다.',
    };
  }

  if (!state || !isApiUserType(state)) {
    return {
      ok: false,
      reason: 'invalid_state',
      message: '잘못된 로그인 요청입니다.',
    };
  }

  return {
    ok: true,
    code,
    userType: state,
  };
};

const KAKAO_LOGIN_ERROR_MESSAGES: Record<string, string> = {
  USER_TYPE_MISMATCH:
    '이미 다른 회원 유형으로 가입된 카카오 계정입니다. 해당 유형으로 로그인해 주세요.',
  KAKAO_EMAIL_REQUIRED:
    '카카오 계정 이메일 제공에 동의해 주세요.',
  EMAIL_ALREADY_EXISTS:
    '이미 가입된 이메일입니다. 이메일 로그인을 이용해 주세요.',
};

/**
 * BE 카카오 로그인 에러 코드를 사용자 메시지로 변환한다.
 * 매핑되지 않은 코드는 fallbackMessage를 그대로 사용한다.
 */
export const resolveKakaoLoginErrorMessage = (
  errorCode: string | undefined,
  fallbackMessage: string
): string => {
  if (!errorCode) return fallbackMessage;
  return KAKAO_LOGIN_ERROR_MESSAGES[errorCode] ?? fallbackMessage;
};
