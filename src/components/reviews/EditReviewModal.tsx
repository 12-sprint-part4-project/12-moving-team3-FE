'use client';

import { useId, useState } from 'react';

import { ReviewMoverSummaryCard } from '@/components/reviews/ReviewMoverSummaryCard';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { TextArea } from '@/components/ui/Input/TextArea';
import { ModalCtaButton } from '@/components/ui/Modal/ModalCtaButton';
import { ModalHeader } from '@/components/ui/Modal/ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
  MOVE_TYPE_CHIP_RESPONSIVE_CLASS,
} from '@/components/ui/Modal/modalPanel';
import { StarRating } from '@/components/ui/StarRating/StarRating';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';
import {
  type CustomerReviewItem,
  MAX_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
} from '@/types/review';

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
  const moveTypeUi = quote?.moveType
    ? API_MOVE_TYPE_TO_UI[quote.moveType]
    : null;
  const isDesignated = quote?.isDesignated ?? false;
  const moverName = review.mover?.name?.trim() || '기사';
  const avatarSrc = review.mover?.profileImageUrl ?? undefined;
  const moveDateLabel = formatReviewMoveDate(quote?.moveDate ?? null);
  const priceLabel = formatQuotePriceLabel(quote?.price ?? null);

  const [rating, setRating] = useState(review.rating);
  const [content, setContent] = useState(review.content);

  const trimmedLength = content.trim().length;
  const isUnchanged =
    rating === review.rating && content.trim() === review.content.trim();
  const isSubmittable =
    !isSubmitting &&
    !isUnchanged &&
    rating > 0 &&
    trimmedLength >= MIN_REVIEW_CONTENT_LENGTH &&
    trimmedLength <= MAX_REVIEW_CONTENT_LENGTH;

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

      <div className="flex w-full flex-col gap-5 sm:gap-8">
        {(moveTypeUi || isDesignated) && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {moveTypeUi ? (
              <MoveTypeChip
                type={moveTypeUi}
                size="sm"
                className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
              />
            ) : null}
            {isDesignated ? (
              <MoveTypeChip
                type="designated"
                size="sm"
                className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
              />
            ) : null}
          </div>
        )}

        <ReviewMoverSummaryCard
          moverName={moverName}
          moveDate={moveDateLabel}
          quotePrice={priceLabel}
          avatarSrc={avatarSrc}
        />

        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            평점
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            상세 후기
          </p>
          <TextArea
            size="sm"
            rows={4}
            value={content}
            maxLength={MAX_REVIEW_CONTENT_LENGTH}
            onChange={(event) =>
              setContent(event.target.value.slice(0, MAX_REVIEW_CONTENT_LENGTH))
            }
            placeholder="10자 이상 600자 이하로 작성해주세요"
            className="[&>div]:w-full [&>div>textarea]:sm:text-xl-regular"
            aria-label="상세 후기"
          />
        </div>
      </div>

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        확인
      </ModalCtaButton>
    </section>
  );
};
