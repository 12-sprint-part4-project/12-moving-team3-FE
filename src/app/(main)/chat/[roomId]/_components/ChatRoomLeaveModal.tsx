'use client';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { useTranslation } from '@/i18n/useTranslation';

interface ChatRoomLeaveModalProps {
  isLeavePending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
}

/** 채팅방 나가기 재확인 모달 */
export const ChatRoomLeaveModal = ({
  isLeavePending,
  onClose,
  onConfirm,
  className,
}: ChatRoomLeaveModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title={t('chat.leave')}
        onClose={onClose}
        titleAlign="center"
        className={className}
        footer={
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outlined"
              size="sm"
              onClick={onClose}
              className="sm:flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="button"
              variant="solid"
              size="sm"
              disabled={isLeavePending}
              onClick={onConfirm}
              className="sm:flex-1"
            >
              {t('chat.leaveAction')}
            </Button>
          </div>
        }
      >
        <p className="px-6 pb-6 text-center text-2lg-medium text-black-300">
          {t('chat.leaveBody')}
        </p>
      </ModalBasic>
    </Modal>
  );
};
