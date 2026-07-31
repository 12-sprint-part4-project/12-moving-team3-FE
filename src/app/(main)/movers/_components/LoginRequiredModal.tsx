'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';

export interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/** 비회원 찜 등 — 로그인 필요 안내 모달 */
export const LoginRequiredModal = ({
  open,
  onClose,
}: LoginRequiredModalProps) => {
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    // TODO: 로그인 페이지 구현·라우트 확정 후 연결
    // 현재 GNB는 /login 을 가리키므로 동일 경로로 이동 시도
    router.push('/login');
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title="로그인이 필요해요"
        onClose={onClose}
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
          찜하기는 로그인 후 이용할 수 있습니다.
        </p>
      </ModalBasic>
    </Modal>
  );
};
