'use client';

import { createContext, useSyncExternalStore, type ReactNode } from 'react';

import {
  clearAuthSession,
  getAuthSessionUser,
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

const subscribeIsReady = () => () => {};
const getIsReadySnapshot = () => true;
const getIsReadyServerSnapshot = () => false;

const getUserServerSnapshot = (): AuthUser | null => null;

/**
 * localStorage 세션을 useSyncExternalStore로 구독한다.
 * isReady / user 모두 getServerSnapshot을 hydration에 사용해
 * 서버 HTML과 첫 클라이언트 트리를 일치시킨다.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isReady = useSyncExternalStore(
    subscribeIsReady,
    getIsReadySnapshot,
    getIsReadyServerSnapshot
  );

  const sessionUser = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionUser,
    getUserServerSnapshot
  );

  // hydration 전에는 서버와 동일하게 null을 노출한다.
  const user = isReady ? sessionUser : null;

  const setSession = (session: AuthSession) => {
    setAuthSession(session);
  };

  const clearSession = () => {
    clearAuthSession();
  };

  return (
    <AuthContext.Provider value={{ user, isReady, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};
