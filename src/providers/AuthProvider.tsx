'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';

import {
  clearAuthSession,
  getAuthSession,
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getAuthSession()?.user ?? null);
    setIsReady(true);
  }, []);

  const setSession = (session: AuthSession) => {
    setAuthSession(session);
    setUser(session.user);
  };

  const clearSession = () => {
    clearAuthSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isReady, setSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
};
