import { API_ERROR_CODE } from '@/constants/errorCode';

import type { ApiUserType } from '@/types/auth';

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const KAKAO_OAUTH_STATE_STORAGE_KEY = 'kakao_oauth_state';

type SearchParamsReader = {
  get: (key: string) => string | null;
};

type PendingKakaoOAuthState = {
  state: string;
  userType: ApiUserType;
  /** 로그인 페이지 ?redirect= 값 — 콜백 후 복귀용 */
  redirectTo?: string | null;
  consumed: boolean;
};

export interface ConsumedKakaoOAuthState {
  userType: ApiUserType;
  redirectTo: string | null;
}

export interface KakaoCallbackSuccess {
  ok: true;
  code: string;
  state: string;
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

const createRandomState = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const createKakaoOAuthState = (
  userType: ApiUserType,
  redirectTo?: string | null
): string => {
  if (typeof window === 'undefined') {
    throw new Error('카카오 OAuth state는 브라우저에서만 생성할 수 있습니다.');
  }

  const state = createRandomState();
  const pendingState: PendingKakaoOAuthState = {
    state,
    userType,
    redirectTo: redirectTo ?? null,
    consumed: false,
  };

  window.sessionStorage.setItem(
    KAKAO_OAUTH_STATE_STORAGE_KEY,
    JSON.stringify(pendingState)
  );

  return state;
};

export const consumeKakaoOAuthState = (
  state: string
): ConsumedKakaoOAuthState | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedState = window.sessionStorage.getItem(
    KAKAO_OAUTH_STATE_STORAGE_KEY
  );

  if (!storedState) {
    return null;
  }

  try {
    const parsedState = JSON.parse(storedState) as PendingKakaoOAuthState;

    if (!parsedState || parsedState.consumed || parsedState.state !== state) {
      return null;
    }

    const nextState: PendingKakaoOAuthState = {
      ...parsedState,
      consumed: true,
    };

    window.sessionStorage.setItem(
      KAKAO_OAUTH_STATE_STORAGE_KEY,
      JSON.stringify(nextState)
    );

    return {
      userType: parsedState.userType,
      redirectTo: parsedState.redirectTo ?? null,
    };
  } catch {
    return null;
  }
};

/**
 * 카카오 인가 코드 요청 URL을 만든다.
 * OAuth state는 브라우저 세션에 저장해 콜백에서 일회용으로 검증한다.
 */
export const getKakaoAuthorizeUrl = (
  userType: ApiUserType,
  state: string
): string => {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
  const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error('카카오 로그인 환경변수가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
    lang: 'ko',
  });

  return `${KAKAO_AUTHORIZE_URL}?${params.toString()}`;
};

/** 카카오 로그인 화면으로 이동한다. */
export const redirectToKakaoLogin = (
  userType: ApiUserType,
  redirectTo?: string | null
): void => {
  const state = createKakaoOAuthState(userType, redirectTo);
  window.location.assign(getKakaoAuthorizeUrl(userType, state));
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

  if (!state) {
    return {
      ok: false,
      reason: 'invalid_state',
      message: '잘못된 로그인 요청입니다.',
    };
  }

  return {
    ok: true,
    code,
    state,
  };
};

const KAKAO_LOGIN_ERROR_MESSAGES: Record<string, string> = {
  [API_ERROR_CODE.USER_TYPE_MISMATCH]:
    '이미 다른 회원 유형으로 가입된 카카오 계정입니다. 해당 유형으로 로그인해 주세요.',
  [API_ERROR_CODE.KAKAO_EMAIL_REQUIRED]:
    '카카오 계정 이메일 제공에 동의해 주세요.',
  [API_ERROR_CODE.EMAIL_ALREADY_EXISTS]:
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
