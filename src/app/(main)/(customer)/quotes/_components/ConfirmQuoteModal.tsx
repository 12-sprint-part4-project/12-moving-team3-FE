'use client';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';

export interface ConfirmQuoteModalProps {
  open: boolean;
  isConfirming?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 견적 확정 재확인 모달
 */
export const ConfirmQuoteModal = ({
  open,
  isConfirming = false,
  onClose,
  onConfirm,
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
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outlined"
              size="sm"
              disabled={isConfirming}
              onClick={handleClose}
              className="sm:flex-1"
            >
              취소
            </Button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              disabled={isConfirming}
              onClick={onConfirm}
              className="sm:flex-1"
            >
              {isConfirming ? '확정 중...' : '견적 확정하기'}
            </Button>
          </div>
        }
      >
        <p className="text-2lg-medium text-black-300">
          견적 확정을 진행하시겠습니까?
        </p>
      </ModalBasic>
    </Modal>
  );
};
