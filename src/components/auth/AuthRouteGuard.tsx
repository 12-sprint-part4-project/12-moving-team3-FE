'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { RoleMismatchModal } from '@/components/auth/RoleMismatchModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  getAuthRouteRequirement,
  LOGIN_HREF_BY_USER_TYPE,
} from '@/lib/authRoutePaths';
import { logout } from '@/services/authApi';
import type { ApiUserType } from '@/types/auth';

interface AuthRouteGuardProps {
  children: ReactNode;
}

type AuthGateState =
  | { kind: 'none' }
  | { kind: 'loginRequired'; loginHref: string }
  | { kind: 'roleMismatch'; requiredUserType: ApiUserType };

const resolveAuthGate = (
  pathname: string,
  userType: ApiUserType | null
): AuthGateState => {
  const requirement = getAuthRouteRequirement(pathname);

  if (requirement.kind === 'public') {
    return { kind: 'none' };
  }

  if (userType == null) {
    const loginHref =
      requirement.kind === 'role'
        ? LOGIN_HREF_BY_USER_TYPE[requirement.requiredUserType]
        : LOGIN_HREF_BY_USER_TYPE.CUSTOMER;

    return { kind: 'loginRequired', loginHref };
  }

  if (requirement.kind === 'shared') {
    return { kind: 'none' };
  }

  if (userType !== requirement.requiredUserType) {
    return {
      kind: 'roleMismatch',
      requiredUserType: requirement.requiredUserType,
    };
  }

  return { kind: 'none' };
};

/**
 * 보호 경로에 비로그인·역할 불일치로 직접 진입 시 모달로 안내
 */
export const AuthRouteGuard = ({ children }: AuthRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user, isReady, clearSession } = useAuth();
  /** 닫기 직후·이동 전까지 모달이 다시 열리지 않도록 경로를 기억 */
  const [dismissedPath, setDismissedPath] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // pathname 변경 시 dismissedPath 리셋 (같은 URL 재진입 시 모달 재표시)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDismissedPath(null);
  }

  const requirement = getAuthRouteRequirement(pathname);
  const isProtectedPath = requirement.kind !== 'public';

  const gate: AuthGateState = isReady
    ? resolveAuthGate(pathname, user?.userType ?? null)
    : { kind: 'none' };

  /** 인증 실패 시 콘텐츠는 계속 숨기고, 모달만 dismiss로 닫을 수 있다 */
  const shouldHideChildren =
    (!isReady && isProtectedPath) || (isReady && gate.kind !== 'none');

  const isModalOpen =
    isReady && gate.kind !== 'none' && dismissedPath !== pathname;

  /** 취소·닫기 — 모달 닫고 홈으로 */
  const handleDismiss = () => {
    setDismissedPath(pathname);
    router.replace('/');
  };

  /** 로그인 하기 — 홈으로 보내지 않고 모달만 닫은 뒤 로그인 페이지로 이동 */
  const handleBeforeLogin = () => {
    setDismissedPath(pathname);
  };

  const handleLogout = async () => {
    const loginHref =
      gate.kind === 'roleMismatch'
        ? LOGIN_HREF_BY_USER_TYPE[gate.requiredUserType]
        : LOGIN_HREF_BY_USER_TYPE.CUSTOMER;

    try {
      await logout();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요.';
      showToast({ content: message });
      return;
    }

    queryClient.clear();
    clearSession();
    setDismissedPath(pathname);
    showToast({ content: '로그아웃되었습니다.' });
    router.replace(loginHref);
  };

  return (
    <>
      {shouldHideChildren ? null : children}
      <LoginRequiredModal
        open={isModalOpen && gate.kind === 'loginRequired'}
        onClose={handleDismiss}
        onBeforeLogin={handleBeforeLogin}
        loginHref={gate.kind === 'loginRequired' ? gate.loginHref : '/login'}
      />
      <RoleMismatchModal
        open={isModalOpen && gate.kind === 'roleMismatch'}
        onClose={handleDismiss}
        requiredUserType={
          gate.kind === 'roleMismatch' ? gate.requiredUserType : 'CUSTOMER'
        }
        onLogout={() => {
          void handleLogout();
        }}
      />
    </>
  );
};
