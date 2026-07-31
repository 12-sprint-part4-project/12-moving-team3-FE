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

const getServerSnapshot = (): AuthUser | null => null;

/**
 * localStorage 세션을 useSyncExternalStore로 구독한다.
 * useEffect + setState 초기화는 cascading render 경고를 유발하므로 사용하지 않는다.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const user = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSessionUser,
    getServerSnapshot
  );
  const isReady = typeof window !== 'undefined';

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
