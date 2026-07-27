'use client';

import { useId } from 'react';

import { cn } from '@/lib/utils';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import { MODAL_PANEL_CLASS } from './modalPanel';

export interface DesignatedQuoteRequestModalProps {
  onClose: () => void;
  /** '일반 견적 요청 하기' 클릭 시 호출 (일반 견적 요청 플로우로 이동) */
  onConfirm: () => void;
  className?: string;
}

/**
 * 지정 견적 요청 안내 모달 콘텐츠 (Figma: Component/modal 지정 견적 요청하기).
 * 일반 견적 요청을 먼저 진행하라는 안내 + CTA만 담는다.
 */
export const DesignatedQuoteRequestModal = ({
  onClose,
  onConfirm,
  className = '',
}: DesignatedQuoteRequestModalProps) => {
  const titleId = useId();

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(MODAL_PANEL_CLASS, className)}
    >
      <ModalHeader
        title="지정 견적 요청하기"
        onClose={onClose}
        titleId={titleId}
      />

      <p className="text-2lg-medium text-black-300">
        일반 견적 요청을 먼저 진행해 주세요.
      </p>

      <ModalCtaButton onClick={onConfirm}>일반 견적 요청 하기</ModalCtaButton>
    </section>
  );
};
