'use client';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import type { ApiUserType } from '@/types/auth';

export interface RoleMismatchModalProps {
  open: boolean;
  onClose: () => void;
  /** 해당 페이지에 필요한 역할 */
  requiredUserType: ApiUserType;
  onLogout: () => void;
  className?: string;
}

const ROLE_MISMATCH_COPY: Record<
  ApiUserType,
  { title: string; descriptionLines: readonly [string, string] }
> = {
  MOVER: {
    title: '기사님 로그인이 필요해요',
    descriptionLines: [
      '이 페이지는 기사님 전용입니다.',
      '기사님 계정으로 다시 로그인해 주세요.',
    ],
  },
  CUSTOMER: {
    title: '일반 회원 로그인이 필요해요',
    descriptionLines: [
      '이 페이지는 일반 회원 전용입니다.',
      '일반 회원 계정으로 다시 로그인해 주세요.',
    ],
  },
};

/** 로그인 역할이 페이지 요구와 다를 때 — 안내 + 로그아웃 */
export const RoleMismatchModal = ({
  open,
  onClose,
  requiredUserType,
  onLogout,
  className,
}: RoleMismatchModalProps) => {
  if (!open) {
    return null;
  }

  const copy = ROLE_MISMATCH_COPY[requiredUserType];

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={copy.title}
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
              onClick={onLogout}
            >
              로그아웃하기
            </Button>
          </div>
        }
      >
        <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
          {copy.descriptionLines[0]}
          <br />
          {copy.descriptionLines[1]}
        </p>
      </ModalBasic>
    </Modal>
  );
};
