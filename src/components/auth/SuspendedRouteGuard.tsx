'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { isMemberOnlyPath } from '@/lib/memberOnlyPaths';

interface SuspendedRouteGuardProps {
  children: ReactNode;
}

/**
 * 회원 전용 경로에서 SUSPENDED 계정이면 페이지를 그리지 않고 /suspended 로 보낸다.
 */
export const SuspendedRouteGuard = ({ children }: SuspendedRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady } = useAuth();

  const shouldRedirect =
    isReady &&
    user?.status === 'SUSPENDED' &&
    isMemberOnlyPath(pathname) &&
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
