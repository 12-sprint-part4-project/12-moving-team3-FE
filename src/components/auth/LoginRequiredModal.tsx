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
}

/**
 * useSearchParams는 Suspense 경계 필요 — prerender(/movers 등) 빌드 실패 방지
 * @see https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
const LoginRequiredModalInner = ({
  open,
  onClose,
  className,
}: LoginRequiredModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    const search = searchParams.toString();
    const redirectTo = search ? `${pathname}?${search}` : pathname;
    router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title="로그인이 필요해요"
        onClose={onClose}
        className={className}
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outlined"
              size="sm"
              onClick={onClose}
              className="sm:flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              onClick={handleLogin}
              className="sm:flex-1"
            >
              로그인 하기
            </Button>
          </div>
        }
      >
        <p className="px-6 pb-6 text-2lg-medium text-black-300">
          로그인 후 이용할 수 있습니다.
        </p>
      </ModalBasic>
    </Modal>
  );
};

/** 비회원 찜 등 — 로그인 필요 안내 모달 */
export const LoginRequiredModal = (props: LoginRequiredModalProps) => {
  return (
    <Suspense fallback={null}>
      <LoginRequiredModalInner {...props} />
    </Suspense>
  );
};
