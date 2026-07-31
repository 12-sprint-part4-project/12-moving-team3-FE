'use client';

import { useId, useMemo, useState, type ChangeEvent } from 'react';

import { TextArea } from '@/components/ui/Input/TextArea';

import {
  MAX_QUOTE_TEXT_LENGTH,
  MIN_QUOTE_TEXT_LENGTH,
  normalizeQuoteTextInput,
  rejectRequestFormSchema,
} from '@/lib/quoteModalSchema';
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
  /** 제출 진행 중 여부 */
  isSubmitting?: boolean;
  /** 제출 실패 메시지 */
  errorMessage?: string;
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
  moveType,
  isDesignated = false,
  customerName,
  moveDate,
  departure,
  arrival,
  isSubmitting = false,
  errorMessage,
  className = '',
}: RejectRequestModalProps) => {
  const titleId = useId();
  const [reason, setReason] = useState('');

  const formResult = useMemo(
    () => rejectRequestFormSchema.safeParse({ reason }),
    [reason]
  );

  const isSubmittable = !isSubmitting && formResult.success;

  const reasonLength = reason.trim().length;
  const reasonErrorMessage =
    reasonLength > 0 && reasonLength < MIN_QUOTE_TEXT_LENGTH
      ? `최소 ${MIN_QUOTE_TEXT_LENGTH}자 이상 입력해 주세요.`
      : undefined;

  const handleReasonChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(normalizeQuoteTextInput(event.target.value));
  };

  const handleSubmit = () => {
    if (!formResult.success || isSubmitting) {
      return;
    }
    onSubmit({ reason: formResult.data.reason });
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        MODAL_PANEL_CLASS,
        MODAL_PANEL_BOTTOM_SHEET_CLASS,
        'gap-4 sm:gap-6',
        className
      )}
    >
      <ModalHeader title="반려요청" onClose={onClose} titleId={titleId} />

      <div className="flex w-full flex-col gap-4 sm:gap-5">
        <RequestSummaryCard
          moveType={moveType}
          isDesignated={isDesignated}
          customerName={customerName}
          moveDate={moveDate}
          departure={departure}
          arrival={arrival}
        />

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-2">
            <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
              반려 사유를 입력해 주세요
            </p>
            <p className="text-sm-medium text-gray-400">
              {reasonLength}/{MAX_QUOTE_TEXT_LENGTH}
            </p>
          </div>
          <TextArea
            size="sm"
            rows={3}
            value={reason}
            onChange={handleReasonChange}
            maxLength={MAX_QUOTE_TEXT_LENGTH}
            placeholder={`최소 ${MIN_QUOTE_TEXT_LENGTH}자 이상, 최대 ${MAX_QUOTE_TEXT_LENGTH}자 이내로 입력해주세요`}
            errorMessage={reasonErrorMessage}
            className="[&>div]:min-h-28 [&>div]:w-full"
            aria-label="반려 사유"
          />
        </div>
      </div>

      <ModalCtaButton
        disabled={!isSubmittable}
        onClick={handleSubmit}
        className="cursor-pointer disabled:cursor-default"
      >
        {isSubmitting ? '반려 중...' : '반려하기'}
      </ModalCtaButton>
      {errorMessage ? (
        <p role="alert" className="text-center text-md-medium text-red-200">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
};
