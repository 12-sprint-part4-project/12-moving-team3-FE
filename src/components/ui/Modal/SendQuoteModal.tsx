'use client';

import { useId, useState } from 'react';

import { TextArea } from '@/components/ui/Input/TextArea';
import { TextFieldOutlined } from '@/components/ui/Input/TextFieldOutlined';

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

/** 코멘트 최소 글자 수 (Figma: 10자 이상일 때 버튼 활성화) */
const MIN_COMMENT_LENGTH = 10;

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
  moveType = 'small',
  isDesignated = false,
  customerName,
  moveDate,
  departure,
  arrival,
  className = '',
}: SendQuoteModalProps) => {
  const titleId = useId();
  const [price, setPrice] = useState('');
  const [comment, setComment] = useState('');

  const isSubmittable =
    price.trim().length > 0 && comment.trim().length >= MIN_COMMENT_LENGTH;

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit({ price: price.trim(), comment: comment.trim() });
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
      <ModalHeader title="견적 보내기" onClose={onClose} titleId={titleId} />

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
            견적가를 입력해 주세요
          </p>
          {/* Figma outlined 필드이지만 배경은 background-200. 공용 Outlined에 배경만 덮어쓴다. */}
          <TextFieldOutlined
            size="sm"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            placeholder="견적가 입력"
            inputMode="numeric"
            aria-label="견적가"
            className="[&>div]:w-full [&>div]:border-transparent [&>div]:bg-background-200 [&>div]:focus-within:border-blue-300"
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            코멘트를 입력해 주세요
          </p>
          <TextArea
            size="sm"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="[&>div]:w-full [&>div>textarea]:sm:text-xl-regular"
            aria-label="코멘트"
          />
        </div>
      </div>

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        견적 보내기
      </ModalCtaButton>
    </section>
  );
};
