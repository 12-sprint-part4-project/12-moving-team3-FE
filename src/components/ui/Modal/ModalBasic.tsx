'use client';

import { useId, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { ModalHeader } from './ModalHeader';
import { MODAL_PANEL_CLASS } from './modalPanel';

export interface ModalBasicProps {
  title: string;
  onClose: () => void;
  /** 헤더와 footer 사이 본문 */
  children: ReactNode;
  /** 하단 CTA 등. 없으면 미렌더 */
  footer?: ReactNode;
  className?: string;
}

/**
 * 기본 모달 콘텐츠 레이아웃 (Figma: 지정 견적 요청하기 등 단순 안내형).
 * 패널 + 헤더(제목/닫기) + children + 선택적 footer만 담당한다.
 * dimmer/포탈은 Modal 셸이 담당한다.
 *
 * 사용 예:
 * ```tsx
 * <Modal onClose={handleClose}>
 *   <ModalBasic
 *     title="지정 견적 요청하기"
 *     onClose={handleClose}
 *     footer={<ModalCtaButton onClick={...}>일반 견적 요청 하기</ModalCtaButton>}
 *   >
 *     <p className="text-2lg-medium text-black-300">...</p>
 *   </ModalBasic>
 * </Modal>
 * ```
 */
export const ModalBasic = ({
  title,
  onClose,
  children,
  footer,
  className = '',
}: ModalBasicProps) => {
  const titleId = useId();

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(MODAL_PANEL_CLASS, className)}
    >
      <ModalHeader title={title} onClose={onClose} titleId={titleId} />

      {children}

      {footer}
    </section>
  );
};
