'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { useTranslation } from '@/i18n/useTranslation';

export interface NeedGeneralEstimateModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 제출된 일반 견적요청이 없을 때 — 지정 견적 전 안내 (Figma: 일반 요청 필요)
 */
export const NeedGeneralEstimateModal = ({
  open,
  onClose,
}: NeedGeneralEstimateModalProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  if (!open) {
    return null;
  }

  const handleGoToEstimateRequest = () => {
    onClose();
    router.push('/estimates/request');
  };

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t('movers.designated.request')}
        onClose={onClose}
        footer={
          <ModalCtaButton onClick={handleGoToEstimateRequest}>
            {t('movers.designated.needGeneralCta')}
          </ModalCtaButton>
        }
      >
        <p className="text-2lg-medium text-black-300">
          {t('movers.designated.needGeneralBody')}
        </p>
      </ModalBasic>
    </Modal>
  );
};
