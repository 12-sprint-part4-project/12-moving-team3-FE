'use client';

import { useIsScrolled } from './useIsScrolled';

export type FloatingActionVisibility = 'scroll' | 'mobile-always' | 'always';

/** 플로팅 버튼 노출 Tailwind 클래스 반환 */
export const useFloatingActionScrollVisibility = (
  mode: FloatingActionVisibility = 'scroll',
): string => {
  const isScrolled = useIsScrolled();

  if (mode === 'always') return 'opacity-100';
  if (isScrolled) return 'opacity-100';
  if (mode === 'mobile-always') {
    return 'opacity-100 min-[46.5rem]:pointer-events-none min-[46.5rem]:opacity-0';
  }
  return 'pointer-events-none opacity-0';
};
