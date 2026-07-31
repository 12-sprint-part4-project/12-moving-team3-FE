import type { AuthUser } from '@/types/auth';

const AUTH_SESSION_KEY = 'authSession';

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export const getAuthSession = (): AuthSession | null => {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
};

export const setAuthSession = (session: AuthSession): void => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(AUTH_SESSION_KEY);
};
