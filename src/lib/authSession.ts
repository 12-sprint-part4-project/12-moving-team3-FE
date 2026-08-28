const AUTH_SESSION_KEY = 'authSession';

export interface AuthSession {
  accessToken: string;
}

type Listener = () => void;

const listeners = new Set<Listener>();

/** useSyncExternalStore getSnapshot은 동일 참조를 반환해야 한다. */
let cachedRaw: string | null | undefined;
let cachedSession: AuthSession | null = null;

const notifyAuthSessionListeners = (): void => {
  listeners.forEach((listener) => listener());
};

const parseAuthSession = (raw: string): AuthSession | null => {
  try {
    const session = JSON.parse(raw) as Partial<AuthSession>;
    if (typeof session?.accessToken !== 'string' || !session.accessToken) {
      return null;
    }
    return { accessToken: session.accessToken };
  } catch {
    return null;
  }
};

const readSessionSnapshot = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  const raw = localStorage.getItem(AUTH_SESSION_KEY);

  if (raw === cachedRaw) {
    return cachedSession;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSession = null;
    return cachedSession;
  }

  cachedSession = parseAuthSession(raw);
  return cachedSession;
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

/** useSyncExternalStore용 스냅샷 (참조 안정) */
export const getAuthSessionSnapshot = (): AuthSession | null => {
  return readSessionSnapshot();
};

export const setAuthSession = (session: AuthSession): void => {
  const nextSession: AuthSession = { accessToken: session.accessToken };
  const raw = JSON.stringify(nextSession);
  localStorage.setItem(AUTH_SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSession = nextSession;
  notifyAuthSessionListeners();
};

/** Access Token만 교체 */
export const updateAuthAccessToken = (accessToken: string): boolean => {
  const session = getAuthSession();
  if (!session) {
    return false;
  }

  const nextSession: AuthSession = { accessToken };
  const raw = JSON.stringify(nextSession);
  localStorage.setItem(AUTH_SESSION_KEY, raw);
  cachedRaw = raw;
  cachedSession = nextSession;
  notifyAuthSessionListeners();
  return true;
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_SESSION_KEY);
  cachedRaw = null;
  cachedSession = null;
  notifyAuthSessionListeners();
};
