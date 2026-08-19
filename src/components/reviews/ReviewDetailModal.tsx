'use client';

import { useId } from 'react';

import { Button } from '@/components/Button/Button';
import { ReviewMoverSummaryCard } from '@/components/reviews/ReviewMoverSummaryCard';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { ModalHeader } from '@/components/ui/Modal/ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
  MOVE_TYPE_CHIP_RESPONSIVE_CLASS,
} from '@/components/ui/Modal/modalPanel';
import { StarRating } from '@/components/ui/StarRating/StarRating';
import {
  formatReviewCreatedDate,
  formatReviewMoveDate,
} from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import { API_MOVE_TYPE_TO_UI } from '@/types/estimateRequest';

import type { CustomerReviewItem } from '@/types/review';

export interface ReviewDetailModalProps {
  review: CustomerReviewItem;
  onClose: () => void;
  /** 리뷰 수정 버튼 — 수정 모달 오픈은 호출 측에서 담당 */
  onEdit: () => void;
  /** 리뷰 삭제 버튼 — 삭제 확인 모달 오픈은 호출 측에서 담당 */
  onDelete: () => void;
  className?: string;
}

/**
 * 내가 작성한 리뷰 상세 모달.
 * Figma 미제공 — WriteReviewModal / 카드 패턴에 맞춰 전체 본문·별점을 표시한다.
 */
export const ReviewDetailModal = ({
  review,
  onClose,
  onEdit,
  onDelete,
  className = '',
}: ReviewDetailModalProps) => {
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
  const createdLabel = formatReviewMoveDate(
    formatReviewCreatedDate(review.createdAt)
  );

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
      <ModalHeader title="리뷰 상세" onClose={onClose} titleId={titleId} />

      <div className="flex w-full flex-col gap-5 tablet:gap-8">
        {(moveTypeUi || isDesignated) && (
          <div className="flex flex-wrap items-center gap-2 tablet:gap-3">
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

        <div className="flex flex-col gap-3 tablet:gap-4">
          <p className="text-lg-semibold text-black-300 tablet:text-xl-semibold">
            평점
          </p>
          <StarRating value={review.rating} readOnly />
        </div>

        <div className="flex flex-col gap-3 tablet:gap-4">
          <p className="text-lg-semibold text-black-300 tablet:text-xl-semibold">
            상세 후기
          </p>
          <p className="rounded-2xl bg-background-200 px-4 py-3.5 text-lg-regular whitespace-pre-wrap text-black-300 tablet:text-xl-regular">
            {review.content}
          </p>
        </div>

        <p className="flex items-center justify-end gap-2 text-md-regular text-gray-300">
          <span>작성일</span>
          <span>{createdLabel}</span>
        </p>

        <div className="flex w-full gap-2 tablet:gap-3">
          <Button
            variant="outlined"
            size="sm"
            className="tablet:h-16 tablet:text-xl-semibold"
            onClick={onDelete}
          >
            리뷰 삭제
          </Button>
          <Button
            variant="solid"
            size="sm"
            showIcon
            className="tablet:h-16 tablet:text-xl-semibold"
            onClick={onEdit}
          >
            리뷰 수정
          </Button>
        </div>
      </div>
    </section>
  );
};
