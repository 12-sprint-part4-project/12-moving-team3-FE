'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { useTranslation } from '@/i18n/useTranslation';

export interface ConfirmQuoteModalProps {
  open: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

/** `/quotes` 견적 확정 재확인 모달. */
export const ConfirmQuoteModal = ({
  open,
  isConfirming = false,
  onClose,
  onConfirm,
  className = '',
}: ConfirmQuoteModalProps) => {
  const { t } = useTranslation();
  /** 확정 요청 중에는 닫기 차단 */
  const handleClose = () => {
    if (isConfirming) {
      return;
    }
    onClose();
  };

  if (!open) {
    return null;
  }

  // 확정 안내 문구 + 확정하기 CTA
  return (
    <Modal onClose={handleClose} closeOnDimmedClick={!isConfirming}>
      <ModalBasic
        title={t('estimateRequest.confirmQuote')}
        onClose={handleClose}
        closeDisabled={isConfirming}
        className={className}
        footer={
          <ModalCtaButton disabled={isConfirming} onClick={onConfirm}>
            {isConfirming
              ? t('quotes.confirming')
              : t('estimateRequest.confirmQuote')}
          </ModalCtaButton>
        }
      >
        <p className="text-2lg-medium text-black-300">
          {t('quotes.confirmBody')}
        </p>
      </ModalBasic>
    </Modal>
  );
};
