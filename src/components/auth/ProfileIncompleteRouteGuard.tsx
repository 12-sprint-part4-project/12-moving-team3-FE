'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { LoginRequiredModal } from '@/components/auth/LoginRequiredModal';
import { useAuth } from '@/hooks/useAuth';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import { isSuspendedRestrictedPath } from '@/lib/memberOnlyPaths';

interface ProfileIncompleteRouteGuardProps {
  children: ReactNode;
}

/**
 * 프로필 미완료 유저가 정지 계정과 동일한 제한 경로에 들어오면
 * 등록 안내 모달을 띄운다. (취소 → 이전 페이지, 등록하기 → 프로필 등록)
 */
export const ProfileIncompleteRouteGuard = ({
  children,
}: ProfileIncompleteRouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shouldBlock =
    isReady &&
    user != null &&
    !user.isProfileCompleted &&
    isSuspendedRestrictedPath(pathname);

  useEffect(() => {
    if (shouldBlock) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [shouldBlock]);

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  return (
    <>
      {shouldBlock ? null : children}
      {user != null ? (
        <LoginRequiredModal
          open={isModalOpen}
          onClose={handleClose}
          title="등록된 프로필이 없어요!"
          message="해당 기능을 사용하기 위해선 프로필 등록이 필요합니다"
          confirmLabel="등록하기"
          confirmHref={getPostAuthRedirectPath(user)}
          showEmptyImage
        />
      ) : null}
    </>
  );
};
