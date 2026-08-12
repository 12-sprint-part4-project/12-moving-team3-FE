'use client';

import { useId, useMemo, useState, type ChangeEvent } from 'react';

import { PriceInput } from '@/components/ui/Input/PriceInput';
import { TextArea } from '@/components/ui/Input/TextArea';

import {
  MAX_QUOTE_TEXT_LENGTH,
  MIN_QUOTE_TEXT_LENGTH,
  normalizeQuoteTextInput,
  quotePriceSchema,
  sendQuoteFormSchema,
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

export interface SendQuoteModalProps {
  onClose: () => void;
  /** 견적 보내기 클릭 시 호출. API 연동은 호출 측에서 담당 */
  onSubmit: (quote: { price: string; comment: string }) => void;
  moveType?: RequestSummaryMoveType;
  isDesignated?: boolean;
  /** 고객 이름 (예: '김코드') */
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
 * 견적 보내기 모달 콘텐츠 (Figma: Component/modal/견적보내기-card).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 * 사용 시 `<Modal placement="bottom">`과 조합한다 (모바일 하단 시트).
 */
export const SendQuoteModal = ({
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
}: SendQuoteModalProps) => {
  const titleId = useId();
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');

  const formResult = useMemo(
    () =>
      sendQuoteFormSchema.safeParse({
        price,
        comment,
      }),
    [price, comment]
  );

  const isSubmittable = !isSubmitting && formResult.success;

  const priceErrorMessage = useMemo(() => {
    if (!price) {
      return undefined;
    }
    const result = quotePriceSchema.safeParse(price);
    if (result.success) {
      return undefined;
    }
    return result.error.issues[0]?.message;
  }, [price]);

  const commentLength = comment.trim().length;
  const commentErrorMessage =
    commentLength > 0 && commentLength < MIN_QUOTE_TEXT_LENGTH
      ? `최소 ${MIN_QUOTE_TEXT_LENGTH}자 이상 입력해 주세요.`
      : undefined;

  const handleCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(normalizeQuoteTextInput(event.target.value));
  };

  const handleSubmit = () => {
    if (!formResult.success || isSubmitting) {
      return;
    }
    onSubmit({
      price: formResult.data.price,
      comment: formResult.data.comment,
    });
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
      <ModalHeader title="견적 보내기" onClose={onClose} titleId={titleId} />

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
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            견적가를 입력해 주세요
          </p>
          <PriceInput
            value={price}
            onValueChange={setPrice}
            placeholder="견적가 입력"
            errorMessage={priceErrorMessage}
            isError={Boolean(priceErrorMessage)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-end justify-between gap-2">
            <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
              코멘트를 입력해 주세요
            </p>
            <p className="text-sm-medium text-gray-400">
              {commentLength}/{MAX_QUOTE_TEXT_LENGTH}
            </p>
          </div>
          <TextArea
            size="sm"
            rows={3}
            value={comment}
            onChange={handleCommentChange}
            maxLength={MAX_QUOTE_TEXT_LENGTH}
            placeholder={`최소 ${MIN_QUOTE_TEXT_LENGTH}자 이상, 최대 ${MAX_QUOTE_TEXT_LENGTH}자 이내로 입력해주세요`}
            errorMessage={commentErrorMessage}
            className="[&>div]:min-h-28 [&>div]:w-full"
            aria-label="코멘트"
          />
        </div>
      </div>

      <ModalCtaButton
        disabled={!isSubmittable}
        onClick={handleSubmit}
        className="cursor-pointer disabled:cursor-default"
      >
        {isSubmitting ? '보내는 중...' : '견적 보내기'}
      </ModalCtaButton>
      {errorMessage ? (
        <p role="alert" className="text-center text-md-medium text-red-200">
          {errorMessage}
        </p>
      ) : null}
    </section>
  );
};
