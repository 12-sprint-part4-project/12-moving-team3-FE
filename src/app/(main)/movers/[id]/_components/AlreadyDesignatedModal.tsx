'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { useTranslation } from '@/i18n/useTranslation';

export interface AlreadyDesignatedModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 이미 해당 기사님에게 지정 견적을 보낸 경우 안내 (버튼 비활성 전 폴백)
 * 실제론 버튼이 비활성 되어 쓰이지 않겠지만, 혹시 모르는 엣지케이스 처리
 */
export const AlreadyDesignatedModal = ({
  open,
  onClose,
}: AlreadyDesignatedModalProps) => {
  const { t } = useTranslation();

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t('movers.designated.request')}
        onClose={onClose}
        footer={
          <ModalCtaButton onClick={onClose}>{t('common.confirm')}</ModalCtaButton>
        }
      >
        <p className="text-2lg-medium text-black-300">
          {t('movers.designated.alreadyBody')}
        </p>
      </ModalBasic>
    </Modal>
  );
};
