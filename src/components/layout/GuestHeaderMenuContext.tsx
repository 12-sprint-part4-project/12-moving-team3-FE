'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';

interface GuestHeaderMenuContextValue {
  openMenu: () => void;
}

const GuestHeaderMenuContext =
  createContext<GuestHeaderMenuContextValue | null>(null);

interface GuestHeaderMenuProviderProps {
  openMenu: () => void;
  children: ReactNode;
}

/** 비로그인 헤더 햄버거 ↔ HeaderClient 메뉴 상태를 연결한다. */
export const GuestHeaderMenuProvider = ({
  openMenu,
  children,
}: GuestHeaderMenuProviderProps) => (
  <GuestHeaderMenuContext.Provider value={{ openMenu }}>
    {children}
  </GuestHeaderMenuContext.Provider>
);

export const useGuestHeaderMenu = (): GuestHeaderMenuContextValue => {
  const context = useContext(GuestHeaderMenuContext);

  if (!context) {
    throw new Error(
      'useGuestHeaderMenu는 GuestHeaderMenuProvider 내부에서만 사용할 수 있습니다.'
    );
  }

  return context;
};
