'use client';

import { Button } from '@/components/Button/Button';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { MODAL_PANEL_BOTTOM_SHEET_CLASS } from '@/components/ui/Modal/modalPanel';
import { cn } from '@/lib/utils';

export interface PostDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  className?: string;
}

/** 게시글 삭제 확인 모달 */
export const PostDeleteModal = ({
  onClose,
  onConfirm,
  isDeleting = false,
  className = '',
}: PostDeleteModalProps) => {
  const handleClose = () => {
    if (isDeleting) {
      return;
    }
    onClose();
  };

  return (
    <ModalBasic
      title="게시글 삭제"
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
            삭제하기
          </Button>
        </div>
      }
    >
      <p className="text-lg-medium text-black-300 sm:text-2lg-medium">
        작성한 게시글을 삭제하시겠습니까?
        <br />
        삭제 후에는 복구할 수 없습니다.
      </p>
    </ModalBasic>
  );
};
