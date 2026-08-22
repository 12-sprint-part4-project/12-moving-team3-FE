'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { RoleMismatchModal } from '@/components/auth/RoleMismatchModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  isLoginGateSuppressed,
  releaseLoginGate,
  suppressLoginGate,
} from '@/lib/authLoginGate';
import {
  getAuthRouteRequirement,
  isGuestOnlyPath,
  LOGIN_HREF_BY_USER_TYPE,
} from '@/lib/authRoutePaths';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import { logout } from '@/services/authApi';

import type { ApiUserType } from '@/types/auth';

interface AuthRouteGuardProps {
  children: ReactNode;
}

type AuthGateState =
  | { kind: 'none' }
  | { kind: 'guestOnly' }
  | { kind: 'loginRequired'; loginHref: string }
  | { kind: 'roleMismatch'; requiredUserType: ApiUserType };

const resolveAuthGate = (
  pathname: string,
  userType: ApiUserType | null
): AuthGateState => {
  if (userType != null && isGuestOnlyPath(pathname)) {
    return { kind: 'guestOnly' };
  }

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
 * 보호 경로에 비로그인·역할 불일치로 직접 진입 시 모달로 안내.
 * 로그인 사용자가 로그인·회원가입 경로에 들어오면
 * 프로필 미등록 시 등록 페이지, 그 외는 redirect 또는 `/`로 보낸다.
 */
const AuthRouteGuardInner = ({ children }: AuthRouteGuardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    releaseLoginGate();
  }

  const loginGateSuppressed = isLoginGateSuppressed();
  const gate: AuthGateState = isReady
    ? resolveAuthGate(pathname, user?.userType ?? null)
    : { kind: 'none' };

  useEffect(() => {
    if (gate.kind !== 'guestOnly' || user == null) return;
    router.replace(
      getPostAuthRedirectPath(user, {
        redirectTo: searchParams.get('redirect'),
      })
    );
  }, [gate.kind, router, searchParams, user]);

  /**
   * 인증 준비 전에는 숨기지 않는다. (새로고침 빈 화면 방지)
   * 비로그인·역할 불일치·guest 전용만 숨긴다.
   * 로그아웃 직후 보호 경로에 남는 동안은 숨기지 않는다.
   */
  const shouldHideChildren =
    isReady && gate.kind !== 'none' && !loginGateSuppressed;

  const isModalOpen =
    isReady &&
    !loginGateSuppressed &&
    (gate.kind === 'loginRequired' || gate.kind === 'roleMismatch') &&
    dismissedPath !== pathname;

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

    const search = searchParams.toString();
    const redirectTo = search ? `${pathname}?${search}` : pathname;
    const separator = loginHref.includes('?') ? '&' : '?';
    const loginUrl = `${loginHref}${separator}redirect=${encodeURIComponent(redirectTo)}`;

    try {
      await logout();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : t('auth.logout.unexpected');
      showToast({ content: message });
      return;
    }

    queryClient.clear();
    suppressLoginGate();
    clearSession();
    setDismissedPath(pathname);
    showToast({ content: t('auth.logout.success') });
    router.replace(loginUrl);
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

/** useSearchParams용 Suspense 경계 */
export const AuthRouteGuard = (props: AuthRouteGuardProps) => {
  return (
    <Suspense fallback={props.children}>
      <AuthRouteGuardInner {...props} />
    </Suspense>
  );
};
