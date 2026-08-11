import type { ApiUserType, AuthUser } from '@/types/auth';

/** SSR 헤더용 최소 유저 힌트. accessToken·민감 필드는 넣지 않는다. */
export interface AuthUiUser {
  userType: ApiUserType;
  nickname: string;
  isProfileCompleted: boolean;
}

export const AUTH_UI_COOKIE_NAME = 'auth_ui';

const AUTH_UI_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

const isApiUserType = (value: unknown): value is ApiUserType =>
  value === 'CUSTOMER' || value === 'MOVER';

const toAuthUiUser = (user: AuthUser): AuthUiUser => ({
  userType: user.userType,
  nickname: user.nickname,
  isProfileCompleted: user.isProfileCompleted,
});

/** 쿠키 문자열 → AuthUiUser. 손상·위조 시 null. */
export const parseAuthUiUser = (raw: string | undefined): AuthUiUser | null => {
  if (!raw) return null;

  try {
    const decoded = decodeURIComponent(raw);
    const parsed: unknown = JSON.parse(decoded);
    if (!parsed || typeof parsed !== 'object') return null;

    const user = parsed as Partial<AuthUiUser>;
    if (
      !isApiUserType(user.userType) ||
      typeof user.nickname !== 'string' ||
      typeof user.isProfileCompleted !== 'boolean'
    ) {
      return null;
    }

    return {
      userType: user.userType,
      nickname: user.nickname,
      isProfileCompleted: user.isProfileCompleted,
    };
  } catch {
    return null;
  }
};

/** localStorage 세션과 맞춰 서버가 읽을 UI 쿠키를 기록한다. */
export const writeAuthUiCookie = (user: AuthUser): void => {
  if (typeof document === 'undefined') return;

  const value = encodeURIComponent(JSON.stringify(toAuthUiUser(user)));
  document.cookie = `${AUTH_UI_COOKIE_NAME}=${value}; path=/; Max-Age=${AUTH_UI_COOKIE_MAX_AGE_SEC}; SameSite=Lax`;
};

export const clearAuthUiCookie = (): void => {
  if (typeof document === 'undefined') return;

  document.cookie = `${AUTH_UI_COOKIE_NAME}=; path=/; Max-Age=0; SameSite=Lax`;
};
