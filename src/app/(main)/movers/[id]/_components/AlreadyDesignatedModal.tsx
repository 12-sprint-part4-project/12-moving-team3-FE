'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';

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
  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose}>
      <ModalBasic
        title="지정 견적 요청하기"
        onClose={onClose}
        footer={<ModalCtaButton onClick={onClose}>확인</ModalCtaButton>}
      >
        <p className="text-2lg-medium text-black-300">
          이미 이 기사님에게 지정 견적을 요청했어요.
        </p>
      </ModalBasic>
    </Modal>
  );
};
