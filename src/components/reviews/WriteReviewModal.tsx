'use client';

import { useId, useState } from 'react';

import {
  isReviewFormValid,
  ReviewFormFields,
} from '@/components/reviews/ReviewFormFields';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { ModalHeader } from '@/components/ui/Modal/ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
} from '@/components/ui/Modal/modalPanel';
import { cn } from '@/lib/utils';
import type { ApiMoveType } from '@/types/estimateRequest';

export interface WriteReviewModalProps {
  onClose: () => void;
  /** 등록 버튼 클릭 시 호출. API 연동은 호출 측(리뷰 도메인)에서 담당 */
  onSubmit: (review: { rating: number; content: string }) => void;
  /** 이사 유형 (API ApiMoveType). null이면 칩 미표시 */
  moveType?: ApiMoveType | null;
  /** 지정 견적 요청 칩 표시 여부 */
  isDesignated?: boolean;
  /** 기사님 이름 (예: '김코드') */
  moverName: string;
  /** 이사일 (예: '2024. 07. 01') */
  moveDate: string;
  /** 견적가 표시 문자열 (예: '210,000원') */
  quotePrice: string;
  /** 프로필 이미지 URL. 없으면 기본 ProfileIcon */
  avatarSrc?: string;
  /** 등록 요청 진행 중 — CTA 비활성 */
  isSubmitting?: boolean;
  className?: string;
}

/**
 * 리뷰 쓰기 모달 콘텐츠 (Figma: Component/modal/리뷰쓰기).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 * 사용 시 `<Modal placement="bottom">`과 조합한다 (모바일 하단 시트).
 */
export const WriteReviewModal = ({
  onClose,
  onSubmit,
  moveType = null,
  isDesignated = false,
  moverName,
  moveDate,
  quotePrice,
  avatarSrc,
  isSubmitting = false,
  className = '',
}: WriteReviewModalProps) => {
  const titleId = useId();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const isSubmittable =
    !isSubmitting && isReviewFormValid({ rating, content });

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit({ rating, content: content.trim() });
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
      <ModalHeader title="리뷰 쓰기" onClose={onClose} titleId={titleId} />

      <ReviewFormFields
        moveType={moveType}
        isDesignated={isDesignated}
        moverName={moverName}
        moveDate={moveDate}
        quotePrice={quotePrice}
        avatarSrc={avatarSrc}
        rating={rating}
        onRatingChange={setRating}
        content={content}
        onContentChange={setContent}
      />

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        리뷰 등록
      </ModalCtaButton>
    </section>
  );
};
