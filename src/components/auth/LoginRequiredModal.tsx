'use client';

import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';

export interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  loginHref?: string;
  onBeforeLogin?: () => void;
}

const LoginRequiredModalInner = ({
  open,
  onClose,
  className,
  loginHref = '/login',
  onBeforeLogin,
}: LoginRequiredModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    (onBeforeLogin ?? onClose)();
    const search = searchParams.toString();
    const redirectTo = search ? `${pathname}?${search}` : pathname;
    const separator = loginHref.includes('?') ? '&' : '?';
    router.push(
      `${loginHref}${separator}redirect=${encodeURIComponent(redirectTo)}`
    );
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title="로그인이 필요해요"
        onClose={onClose}
        className={className}
        footer={
          <div className="flex w-full gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outlined"
              size="sm"
              className="sm:h-16 sm:text-xl-semibold"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              className="sm:h-16 sm:text-xl-semibold"
              onClick={handleLogin}
            >
              로그인 하기
            </Button>
          </div>
        }
      >
        <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
          로그인 후 이용할 수 있습니다.
        </p>
      </ModalBasic>
    </Modal>
  );
};

/** 비회원 액션 — 로그인 필요 안내 모달 */
export const LoginRequiredModal = (props: LoginRequiredModalProps) => {
  return (
    <Suspense fallback={null}>
      <LoginRequiredModalInner {...props} />
    </Suspense>
  );
};
