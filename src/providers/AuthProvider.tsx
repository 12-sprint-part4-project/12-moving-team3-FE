'use client';

import {
  createContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

import {
  clearAuthSession,
  setAuthSession,
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

const clearLegacyAuthUiCookie = (): void => {
  document.cookie = 'auth_ui=; path=/; Max-Age=0; SameSite=Lax';
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isReady = useSyncExternalStore(
    subscribeIsReady,
    getIsReadySnapshot,
    getIsReadyServerSnapshot
  );

  // 3단계: authSession은 토큰만 저장. user는 4단계 me 조회로 채운다.
  const user = null;

  useEffect(() => {
    clearLegacyAuthUiCookie();
  }, []);

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
