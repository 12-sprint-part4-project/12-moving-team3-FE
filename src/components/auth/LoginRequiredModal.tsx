'use client';

import Image from 'next/image';
import { Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';

export interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  title?: string;
  message?: string;
  confirmLabel?: string;
  /** 있으면 로그인 대신 해당 경로로 이동 (프로필 등록 등) */
  confirmHref?: string;
  /** empty.svg 일러스트 + 중앙 타이틀/본문 레이아웃 */
  showEmptyImage?: boolean;
}

/**
 * useSearchParams는 Suspense 경계 필요 — prerender(/movers 등) 빌드 실패 방지
 * @see https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */
const LoginRequiredModalInner = ({
  open,
  onClose,
  className,
  title = '로그인이 필요해요',
  message = '로그인 후 이용할 수 있습니다.',
  confirmLabel = '로그인 하기',
  confirmHref,
  showEmptyImage = false,
}: LoginRequiredModalProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!open) {
    return null;
  }

  const handleConfirm = () => {
    if (confirmHref) {
      router.push(confirmHref);
      return;
    }

    onClose();
    const search = searchParams.toString();
    const redirectTo = search ? `${pathname}?${search}` : pathname;
    router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={title}
        onClose={onClose}
        titleAlign={showEmptyImage ? 'center' : 'start'}
        titleClassName={showEmptyImage ? 'sr-only' : undefined}
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
              onClick={handleConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        }
      >
        {showEmptyImage ? (
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <Image
              src="/images/empty.svg"
              alt=""
              width={110}
              height={82}
              className="h-[5.125rem] w-[6.875rem]"
            />
            <div className="flex flex-col items-center gap-2">
              <p className="text-center text-2lg-bold text-black-400 sm:text-2xl-semibold">
                {title}
              </p>
              <p className="text-center text-lg-medium text-gray-400 sm:text-2lg-medium">
                {message}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
            {message}
          </p>
        )}
      </ModalBasic>
    </Modal>
  );
};

/** 비회원 찜 등 — 로그인/프로필 등록 필요 안내 모달 */
export const LoginRequiredModal = (props: LoginRequiredModalProps) => {
  return (
    <Suspense fallback={null}>
      <LoginRequiredModalInner {...props} />
    </Suspense>
  );
};
