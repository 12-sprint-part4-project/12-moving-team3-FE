'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';

export interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  loginHref?: string;
  /** 로그인 후 이동 경로. 없으면 현재 pathname(+search) */
  redirectTo?: string;
  onBeforeLogin?: () => void;
}

const LoginRequiredModalInner = ({
  open,
  onClose,
  className,
  loginHref = '/login',
  redirectTo,
  onBeforeLogin,
}: LoginRequiredModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    (onBeforeLogin ?? onClose)();
    const currentPath = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;
    const nextPath = redirectTo ?? currentPath;
    const separator = loginHref.includes('?') ? '&' : '?';
    router.push(
      `${loginHref}${separator}redirect=${encodeURIComponent(nextPath)}`
    );
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t('auth.required.title')}
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
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              className="sm:h-16 sm:text-xl-semibold"
              onClick={handleLogin}
            >
              {t('auth.required.login')}
            </Button>
          </div>
        }
      >
        <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
          {t('auth.required.description')}
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
