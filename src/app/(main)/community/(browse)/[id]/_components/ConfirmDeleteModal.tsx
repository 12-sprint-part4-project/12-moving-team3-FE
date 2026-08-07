'use client';

import type { ReactNode } from 'react';

import { Button } from '@/components/Button/Button';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { MODAL_PANEL_BOTTOM_SHEET_CLASS } from '@/components/ui/Modal/modalPanel';
import { cn } from '@/lib/utils';

export interface ConfirmDeleteModalProps {
  title: string;
  message: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  confirmLabel?: string;
  className?: string;
}

/** 삭제 확인 모달 — 댓글·게시글 공통 */
export const ConfirmDeleteModal = ({
  title,
  message,
  onClose,
  onConfirm,
  isDeleting = false,
  confirmLabel = '삭제하기',
  className = '',
}: ConfirmDeleteModalProps) => {
  const handleClose = () => {
    if (isDeleting) {
      return;
    }
    onClose();
  };

  return (
    <ModalBasic
      title={title}
      onClose={handleClose}
      closeDisabled={isDeleting}
      className={cn(MODAL_PANEL_BOTTOM_SHEET_CLASS, className)}
      footer={
        <div className="flex w-full gap-2 sm:gap-3">
          <Button
            variant="outlined"
            size="sm"
            className="sm:h-16 sm:text-xl-semibold"
            disabled={isDeleting}
            onClick={handleClose}
          >
            취소
          </Button>
          <Button
            variant="solid"
            size="sm"
            className="sm:h-16 sm:text-xl-semibold"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="text-lg-medium text-black-300 sm:text-2lg-medium">
        {message}
      </div>
    </ModalBasic>
  );
};
