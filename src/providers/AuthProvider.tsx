'use client';

import {
  createContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

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

const clearLegacyAuthUiCookie = (): void => {
  document.cookie = 'auth_ui=; path=/; Max-Age=0; SameSite=Lax';
};

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

  const user = isReady ? sessionUser : null;

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
