'use client';

import { useRouter } from 'next/navigation';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalBasic } from '@/components/ui/Modal/ModalBasic';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';

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
        title="지정 견적 요청하기"
        onClose={onClose}
        footer={
          <ModalCtaButton onClick={handleGoToEstimateRequest}>
            일반 견적 요청 하기
          </ModalCtaButton>
        }
      >
        <p className="text-2lg-medium text-black-300">
          일반 견적 요청을 먼저 진행해 주세요.
        </p>
      </ModalBasic>
    </Modal>
  );
};
