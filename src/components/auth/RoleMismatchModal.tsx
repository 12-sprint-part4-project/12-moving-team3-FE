'use client';

import { useTranslation } from 'react-i18next';

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
  {
    titleKey: string;
    descriptionKeys: readonly [string, string];
  }
> = {
  MOVER: {
    titleKey: 'auth.roleMismatch.moverTitle',
    descriptionKeys: [
      'auth.roleMismatch.moverLine1',
      'auth.roleMismatch.moverLine2',
    ],
  },
  CUSTOMER: {
    titleKey: 'auth.roleMismatch.customerTitle',
    descriptionKeys: [
      'auth.roleMismatch.customerLine1',
      'auth.roleMismatch.customerLine2',
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

  const { t } = useTranslation();
  const copy = ROLE_MISMATCH_COPY[requiredUserType];

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t(copy.titleKey)}
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
              onClick={onLogout}
            >
              {t('auth.roleMismatch.logout')}
            </Button>
          </div>
        }
      >
        <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
          {t(copy.descriptionKeys[0])}
          <br />
          {t(copy.descriptionKeys[1])}
        </p>
      </ModalBasic>
    </Modal>
  );
};
