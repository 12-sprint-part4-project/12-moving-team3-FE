import { clearAuthUiCookie, writeAuthUiCookie } from '@/lib/authUiCookie';
import type { AuthUser, UserStatus } from '@/types/auth';

const AUTH_SESSION_KEY = 'authSession';

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

type Listener = () => void;

const listeners = new Set<Listener>();

/** useSyncExternalStore getSnapshot은 동일 참조를 반환해야 한다. */
let cachedRaw: string | null | undefined;
let cachedUser: AuthUser | null = null;

const notifyAuthSessionListeners = (): void => {
  listeners.forEach((listener) => listener());
};

/** 구 세션에 status가 없으면 ACTIVE로 정규화 */
const normalizeAuthUser = (user: AuthUser): AuthUser => {
  const status: UserStatus =
    user.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE';
  if (user.status === status) {
    return user;
  }
  return { ...user, status };
};

const parseAuthSession = (raw: string): AuthSession | null => {
  try {
    const session = JSON.parse(raw) as AuthSession;
    if (!session?.user || !session.accessToken) {
      return null;
    }
    return {
      ...session,
      user: normalizeAuthUser(session.user),
    };
  } catch {
    return null;
  }
};

const readUserSnapshot = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(AUTH_SESSION_KEY);

  if (raw === cachedRaw) {
    return cachedUser;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedUser = null;
    return cachedUser;
  }

  const session = parseAuthSession(raw);
  cachedUser = session?.user ?? null;
  return cachedUser;
};

export const subscribeAuthSession = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  return parseAuthSession(raw);
};

export const getAuthSessionUser = (): AuthUser | null => {
  return readUserSnapshot();
};

export const setAuthSession = (session: AuthSession): void => {
  const nextSession: AuthSession = {
    ...session,
    user: normalizeAuthUser(session.user),
  };
  const raw = JSON.stringify(nextSession);
  localStorage.setItem(AUTH_SESSION_KEY, raw);
  cachedRaw = raw;
  cachedUser = nextSession.user;
  writeAuthUiCookie(nextSession.user);
  notifyAuthSessionListeners();
};

/** Access Token만 교체. user 스냅샷/구독 알림은 유지한다. */
export const updateAuthAccessToken = (accessToken: string): boolean => {
  const session = getAuthSession();
  if (!session) {
    return false;
  }

  const nextSession: AuthSession = { ...session, accessToken };
  const raw = JSON.stringify(nextSession);
  localStorage.setItem(AUTH_SESSION_KEY, raw);
  cachedRaw = raw;
  return true;
};

/** user.status만 갱신 (USER_SUSPENDED 등) */
export const updateAuthUserStatus = (status: UserStatus): boolean => {
  const session = getAuthSession();
  if (!session) {
    return false;
  }

  setAuthSession({
    ...session,
    user: {
      ...session.user,
      status,
    },
  });
  return true;
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_SESSION_KEY);
  cachedRaw = null;
  cachedUser = null;
  clearAuthUiCookie();
  notifyAuthSessionListeners();
};
