'use client';

import {
  createContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { AUTH_QUERY_KEYS } from '@/constants/queryKey';
import { useAuthMe } from '@/hooks/useAuthMe';
import { ApiError } from '@/lib/apiClient';
import {
  clearAuthSession,
  getAuthSessionSnapshot,
  setAuthSession,
  subscribeAuthSession,
  type AuthSession,
} from '@/lib/authSession';
import type { AuthUser } from '@/types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const subscribeIsClient = () => () => {};
const getIsClientSnapshot = () => true;
const getIsClientServerSnapshot = () => false;

const getSessionServerSnapshot = (): AuthSession | null => null;

const clearLegacyAuthUiCookie = (): void => {
  document.cookie = 'auth_ui=; path=/; Max-Age=0; SameSite=Lax';
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();

  const isClient = useSyncExternalStore(
    subscribeIsClient,
    getIsClientSnapshot,
    getIsClientServerSnapshot
  );

  const session = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionSnapshot,
    getSessionServerSnapshot
  );

  const hasToken = Boolean(session?.accessToken);
  const meQuery = useAuthMe(isClient && hasToken);

  useEffect(() => {
    clearLegacyAuthUiCookie();
  }, []);

  /** refresh 실패 등으로 토큰만 지워진 경우에도 me 캐시를 정리한다. */
  useEffect(() => {
    if (hasToken) {
      return;
    }
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
  }, [hasToken, queryClient]);

  useEffect(() => {
    if (!hasToken || !meQuery.isError || meQuery.isFetching) {
      return;
    }

    const error = meQuery.error;
    const isUnauthorized =
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403);

    if (!isUnauthorized) {
      return;
    }

    clearAuthSession();
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
  }, [
    hasToken,
    meQuery.isError,
    meQuery.isFetching,
    meQuery.error,
    queryClient,
  ]);

  const isReady =
    isClient && (!hasToken || meQuery.isSuccess || meQuery.isError);

  const user: AuthUser | null = hasToken ? (meQuery.data ?? null) : null;

  const setSession = (nextSession: AuthSession) => {
    // 이전 me 캐시/요청이 새 세션에 섞이지 않도록 토큰 저장 전에 제거
    void queryClient.cancelQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
    setAuthSession(nextSession);
  };

  const clearSession = () => {
    clearAuthSession();
    queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.me() });
  };

  return (
    <AuthContext.Provider value={{ user, isReady, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};
