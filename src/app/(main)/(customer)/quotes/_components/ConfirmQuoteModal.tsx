'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';

export interface ConfirmQuoteModalProps {
  open: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

/**
 * 견적 확정 재확인 모달
 */
export const ConfirmQuoteModal = ({
  open,
  isConfirming = false,
  onClose,
  onConfirm,
  className = '',
}: ConfirmQuoteModalProps) => {
  if (!open) {
    return null;
  }

  /** 확정 요청 중에는 닫기 차단 */
  const handleClose = () => {
    if (isConfirming) {
      return;
    }
    onClose();
  };

  return (
    <Modal onClose={handleClose} closeOnDimmedClick={!isConfirming}>
      <ModalBasic
        title="견적 확정하기"
        onClose={handleClose}
        closeDisabled={isConfirming}
        className={className}
        footer={
          <ModalCtaButton disabled={isConfirming} onClick={onConfirm}>
            {isConfirming ? '확정 중...' : '견적 확정하기'}
          </ModalCtaButton>
        }
      >
        <p className="text-2lg-medium text-black-300">
          정말 견적 확정을 진행하시겠습니까?
        </p>
      </ModalBasic>
    </Modal>
  );
};
