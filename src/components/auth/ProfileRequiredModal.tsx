'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { useAuth } from '@/hooks/useAuth';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';

export interface ProfileRequiredModalProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

/** 프로필 미등록 — 등록 유도 모달 (empty 일러스트) */
export const ProfileRequiredModal = ({
  open,
  onClose,
  className,
}: ProfileRequiredModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();

  if (!open || user == null) {
    return null;
  }

  const handleRegister = () => {
    router.push(getPostAuthRedirectPath(user));
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t('auth.profileRequired.title')}
        onClose={onClose}
        titleAlign="center"
        titleClassName="sr-only"
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
              onClick={handleRegister}
            >
              {t('auth.profileRequired.register')}
            </Button>
          </div>
        }
      >
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
              {t('auth.profileRequired.title')}
            </p>
            <p className="text-center text-lg-medium text-gray-400 sm:text-2lg-medium">
              {t('auth.profileRequired.description')}
            </p>
          </div>
        </div>
      </ModalBasic>
    </Modal>
  );
};
