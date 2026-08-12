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
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type { CustomerReviewItem } from '@/types/review';

export interface EditReviewModalProps {
  review: CustomerReviewItem;
  onClose: () => void;
  /** 확인 클릭 시 호출. API 연동은 호출 측에서 담당 */
  onSubmit: (review: { rating: number; content: string }) => void;
  /** 수정 요청 진행 중 — CTA·닫기 비활성 */
  isSubmitting?: boolean;
  className?: string;
}

/**
 * 리뷰 수정 모달.
 * 리뷰 상세와 동일한 레이아웃에 별점·후기 편집과 확인 CTA를 둔다.
 */
export const EditReviewModal = ({
  review,
  onClose,
  onSubmit,
  isSubmitting = false,
  className = '',
}: EditReviewModalProps) => {
  const titleId = useId();
  const quote = review.quote;
  const moverName = review.mover?.name?.trim() || '기사';
  const avatarSrc = review.mover?.profileImageUrl ?? undefined;
  const moveDateLabel = formatReviewMoveDate(quote?.moveDate ?? null);
  const priceLabel = formatQuotePriceLabel(quote?.price ?? null);

  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  const isUnchanged =
    rating === review.rating && content.trim() === review.content.trim();
  const isSubmittable =
    !isSubmitting &&
    !isUnchanged &&
    isReviewFormValid({ rating, content });

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit({ rating, content: content.trim() });
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={cn(
        MODAL_PANEL_CLASS,
        MODAL_PANEL_BOTTOM_SHEET_CLASS,
        'max-h-[min(90vh,52rem)] overflow-y-auto',
        className
      )}
    >
      <ModalHeader title="리뷰 수정" onClose={handleClose} titleId={titleId} />

      <ReviewFormFields
        moveType={quote?.moveType ?? null}
        isDesignated={quote?.isDesignated ?? false}
        moverName={moverName}
        moveDate={moveDateLabel}
        quotePrice={priceLabel}
        avatarSrc={avatarSrc}
        rating={rating}
        onRatingChange={setRating}
        content={content}
        onContentChange={setContent}
        ratingLabel="평점"
        contentLabel="상세 후기"
      />

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        확인
      </ModalCtaButton>
    </section>
  );
};
