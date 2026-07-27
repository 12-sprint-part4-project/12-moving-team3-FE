'use client';

import { useId, useState } from 'react';

import { TextArea } from '@/components/ui/Input/TextArea';

import { cn } from '@/lib/utils';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
} from './modalPanel';
import {
  RequestSummaryCard,
  type RequestSummaryMoveType,
} from './RequestSummaryCard';

/** 반려 사유 최소 글자 수 (Figma: 10자 이상일 때 버튼 활성화) */
const MIN_REASON_LENGTH = 10;

export interface RejectRequestModalProps {
  onClose: () => void;
  /** 반려하기 클릭 시 호출. API 연동은 호출 측에서 담당 */
  onSubmit: (payload: { reason: string }) => void;
  moveType?: RequestSummaryMoveType;
  isDesignated?: boolean;
  customerName: string;
  moveDate: string;
  departure: string;
  arrival: string;
  className?: string;
}

/**
 * 반려요청 모달 콘텐츠 (Figma: Component/modal/반려하기).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 * 사용 시 `<Modal placement="bottom">`과 조합한다 (모바일 하단 시트).
 */
export const RejectRequestModal = ({
  onClose,
  onSubmit,
  moveType = 'small',
  isDesignated = false,
  customerName,
  moveDate,
  departure,
  arrival,
  className = '',
}: RejectRequestModalProps) => {
  const titleId = useId();
  const [reason, setReason] = useState('');

  const isSubmittable = reason.trim().length >= MIN_REASON_LENGTH;

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit({ reason: reason.trim() });
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        MODAL_PANEL_CLASS,
        MODAL_PANEL_BOTTOM_SHEET_CLASS,
        className
      )}
    >
      <ModalHeader title="반려요청" onClose={onClose} titleId={titleId} />

      <div className="flex w-full flex-col gap-5 sm:gap-8">
        <RequestSummaryCard
          moveType={moveType}
          isDesignated={isDesignated}
          customerName={customerName}
          moveDate={moveDate}
          departure={departure}
          arrival={arrival}
        />

        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            반려 사유를 입력해 주세요
          </p>
          <TextArea
            size="sm"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="[&>div]:w-full [&>div>textarea]:sm:text-xl-regular"
            aria-label="반려 사유"
          />
        </div>
      </div>

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        반려하기
      </ModalCtaButton>
    </section>
  );
};
