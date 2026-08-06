'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { isSuspendedRestrictedPath } from '@/lib/memberOnlyPaths';

interface SuspendedRouteGuardProps {
  children: ReactNode;
}

/**
 * 정지 계정이 제한 기능 경로에 들어오면 페이지를 그리지 않고 /suspended 로 보낸다.
 * (프로필·알림·채팅 목록·공개 둘러보기는 허용)
 */
export const SuspendedRouteGuard = ({ children }: SuspendedRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady } = useAuth();

  const shouldRedirect =
    isReady &&
    user?.status === 'SUSPENDED' &&
    isSuspendedRestrictedPath(pathname) &&
    pathname !== '/suspended';

  useEffect(() => {
    if (!shouldRedirect) return;
    router.replace('/suspended');
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  return children;
};
