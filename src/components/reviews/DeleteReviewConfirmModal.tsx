'use client';

import { Button } from '@/components/Button/Button';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { MODAL_PANEL_BOTTOM_SHEET_CLASS } from '@/components/ui/Modal/modalPanel';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export interface DeleteReviewConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  /** 삭제 요청 진행 중 */
  isDeleting?: boolean;
  className?: string;
}

/**
 * 리뷰 삭제 확인 모달.
 * Modal 셸과 조합해 사용한다.
 */
export const DeleteReviewConfirmModal = ({
  onClose,
  onConfirm,
  isDeleting = false,
  className = '',
}: DeleteReviewConfirmModalProps) => {
  const { t } = useTranslation();
  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  return (
    <ModalBasic
      title={t('reviews.modal.deleteTitle')}
      onClose={handleClose}
      className={cn(MODAL_PANEL_BOTTOM_SHEET_CLASS, className)}
      footer={
        <div className="flex w-full gap-2 tablet:gap-3">
          <Button
            variant="outlined"
            size="sm"
            className="tablet:h-16 tablet:text-xl-semibold"
            disabled={isDeleting}
            onClick={handleClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="solid"
            size="sm"
            className="tablet:h-16 tablet:text-xl-semibold"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {t('community.deleteAction')}
          </Button>
        </div>
      }
    >
      <p className="text-lg-medium text-black-300 tablet:text-2lg-medium">
        {t('reviews.modal.deleteMessage')}
        <br />
        {t('reviews.modal.deleteIrreversible')}
      </p>
    </ModalBasic>
  );
};
