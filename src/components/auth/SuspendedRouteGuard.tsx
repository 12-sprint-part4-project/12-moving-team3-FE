'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  isSuspendedPagePath,
  isSuspendedRestrictedPath,
} from '@/lib/memberOnlyPaths';

interface SuspendedRouteGuardProps {
  children: ReactNode;
}

/**
 * 정지 계정이 제한 기능 경로에 들어오면 /suspended 로 보낸다.
 * 비로그인·활성 계정이 /suspended 에 있으면 홈으로 보낸다.
 * (프로필·알림·채팅 목록·공개 둘러보기는 허용)
 */
export const SuspendedRouteGuard = ({ children }: SuspendedRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady } = useAuth();

  const shouldRedirectToSuspended =
    isReady &&
    user?.status === 'SUSPENDED' &&
    isSuspendedRestrictedPath(pathname);

  const shouldLeaveSuspendedPage =
    isReady && isSuspendedPagePath(pathname) && user?.status !== 'SUSPENDED';

  useEffect(() => {
    if (shouldRedirectToSuspended) {
      router.replace('/suspended');
      return;
    }

    if (shouldLeaveSuspendedPage) {
      router.replace('/');
    }
  }, [shouldLeaveSuspendedPage, shouldRedirectToSuspended, router]);

  if (shouldRedirectToSuspended || shouldLeaveSuspendedPage) {
    return null;
  }

  return children;
};
