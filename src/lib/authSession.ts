import type { AuthUser } from '@/types/auth';

const AUTH_SESSION_KEY = 'authSession';

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

type Listener = () => void;

const listeners = new Set<Listener>();

const notifyAuthSessionListeners = (): void => {
  listeners.forEach((listener) => listener());
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
  return getAuthSession()?.user ?? null;
};

export const setAuthSession = (session: AuthSession): void => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  notifyAuthSessionListeners();
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_SESSION_KEY);
  notifyAuthSessionListeners();
};
