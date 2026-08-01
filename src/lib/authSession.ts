import type { AuthUser } from '@/types/auth';

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

  try {
    cachedUser = (JSON.parse(raw) as AuthSession).user;
  } catch {
    cachedUser = null;
  }

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

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
};

export const getAuthSessionUser = (): AuthUser | null => {
  return readUserSnapshot();
};

export const setAuthSession = (session: AuthSession): void => {
  const raw = JSON.stringify(session);
  localStorage.setItem(AUTH_SESSION_KEY, raw);
  cachedRaw = raw;
  cachedUser = session.user;
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

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_SESSION_KEY);
  cachedRaw = null;
  cachedUser = null;
  notifyAuthSessionListeners();
};
