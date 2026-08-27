import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  consumeKakaoOAuthState,
  createKakaoOAuthState,
  getKakaoAuthorizeUrl,
  isApiUserType,
  parseKakaoCallbackParams,
  resolveKakaoLoginErrorMessage,
} from './kakaoAuth';

import { API_ERROR_CODE } from '@/constants/errorCode';

const createParams = (entries: Record<string, string | null>) => ({
  get: (key: string) => entries[key] ?? null,
});

describe('isApiUserType', () => {
  it.each(['CUSTOMER', 'MOVER'] as const)('%s는 유효하다', (value) => {
    expect(isApiUserType(value)).toBe(true);
  });

  it('그 외 문자열은 유효하지 않다', () => {
    expect(isApiUserType('ADMIN')).toBe(false);
    expect(isApiUserType('')).toBe(false);
  });
});

describe('parseKakaoCallbackParams', () => {
  it('error가 있으면 denied이다', () => {
    expect(
      parseKakaoCallbackParams(createParams({ error: 'access_denied' }))
    ).toEqual({
      ok: false,
      reason: 'denied',
      message: '카카오 로그인이 취소되었습니다.',
    });
  });

  it('code가 없으면 missing_code이다', () => {
    expect(
      parseKakaoCallbackParams(createParams({ state: 'abc' }))
    ).toMatchObject({
      ok: false,
      reason: 'missing_code',
    });
  });

  it('state가 없으면 invalid_state이다', () => {
    expect(
      parseKakaoCallbackParams(createParams({ code: 'auth-code' }))
    ).toMatchObject({
      ok: false,
      reason: 'invalid_state',
    });
  });

  it('code와 state가 있으면 성공이다', () => {
    expect(
      parseKakaoCallbackParams(
        createParams({ code: 'auth-code', state: 'oauth-state' })
      )
    ).toEqual({
      ok: true,
      code: 'auth-code',
      state: 'oauth-state',
    });
  });
});

describe('resolveKakaoLoginErrorMessage', () => {
  it('코드가 없으면 fallback을 반환한다', () => {
    expect(resolveKakaoLoginErrorMessage(undefined, '기본 메시지')).toBe(
      '기본 메시지'
    );
  });

  it('매핑된 에러 코드는 번역 메시지를 반환한다', () => {
    expect(
      resolveKakaoLoginErrorMessage(
        API_ERROR_CODE.USER_TYPE_MISMATCH,
        '기본 메시지'
      )
    ).toBe(
      '이미 다른 회원 유형으로 가입된 카카오 계정입니다. 해당 유형으로 로그인해 주세요.'
    );
  });

  it('매핑되지 않은 코드는 fallback을 반환한다', () => {
    expect(resolveKakaoLoginErrorMessage('UNKNOWN', '기본 메시지')).toBe(
      '기본 메시지'
    );
  });
});

describe('카카오 OAuth state', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('window가 없으면 생성에 실패한다', () => {
    expect(() => createKakaoOAuthState('CUSTOMER')).toThrow(
      '카카오 OAuth state는 브라우저에서만 생성할 수 있습니다.'
    );
  });

  it('생성한 state는 한 번만 소비된다', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
      crypto: { randomUUID: () => 'oauth-state-1' },
    });
    vi.stubGlobal('crypto', { randomUUID: () => 'oauth-state-1' });

    const state = createKakaoOAuthState('MOVER', '/quotes');
    expect(state).toBe('oauth-state-1');
    expect(consumeKakaoOAuthState(state)).toEqual({
      userType: 'MOVER',
      redirectTo: '/quotes',
    });
    expect(consumeKakaoOAuthState(state)).toBeNull();
  });

  it('다른 state 값은 소비하지 않는다', () => {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
      crypto: { randomUUID: () => 'oauth-state-1' },
    });
    vi.stubGlobal('crypto', { randomUUID: () => 'oauth-state-1' });

    createKakaoOAuthState('CUSTOMER');
    expect(consumeKakaoOAuthState('wrong')).toBeNull();
  });
});

describe('getKakaoAuthorizeUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('환경변수가 없으면 오류이다', () => {
    vi.stubEnv('NEXT_PUBLIC_KAKAO_REST_API_KEY', '');
    vi.stubEnv('NEXT_PUBLIC_KAKAO_REDIRECT_URI', '');
    expect(() => getKakaoAuthorizeUrl('CUSTOMER', 'state')).toThrow(
      '카카오 로그인 환경변수가 설정되지 않았습니다.'
    );
  });

  it('인가 URL에 client_id·redirect·state를 넣는다', () => {
    vi.stubEnv('NEXT_PUBLIC_KAKAO_REST_API_KEY', 'kakao-key');
    vi.stubEnv(
      'NEXT_PUBLIC_KAKAO_REDIRECT_URI',
      'http://localhost/auth/kakao/callback'
    );

    const url = new URL(getKakaoAuthorizeUrl('CUSTOMER', 'oauth-state'));
    expect(url.origin).toBe('https://kauth.kakao.com');
    expect(url.pathname).toBe('/oauth/authorize');
    expect(url.searchParams.get('client_id')).toBe('kakao-key');
    expect(url.searchParams.get('redirect_uri')).toBe(
      'http://localhost/auth/kakao/callback'
    );
    expect(url.searchParams.get('response_type')).toBe('code');
    expect(url.searchParams.get('state')).toBe('oauth-state');
  });
});
