'use client';

import { useId } from 'react';

import ProfileIcon from '@/assets/icons/profile.svg';
import { Button } from '@/components/Button/Button';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
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

        <div className="flex w-full items-center gap-3 rounded-xl border border-line-100 bg-white px-3.5 py-3 shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10 sm:gap-4 sm:rounded-2xl sm:px-[1.125rem] sm:py-6">
          <div className="size-[2.875rem] shrink-0 overflow-hidden rounded-full sm:size-14">
            {avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- 프로필 CDN 도메인 미확정
              <img
                src={avatarSrc}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <ProfileIcon className="size-full" aria-hidden />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-1.5 sm:gap-4">
            <p className="text-md-semibold text-black-300 sm:text-2xl-semibold">
              {moverName} 기사님
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <InfoField
                label="이사일"
                value={moveDateLabel}
                color="neutral"
                className="gap-1 sm:gap-3"
                labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                valueClassName="text-md-medium text-black-300 sm:text-2lg-medium"
              />
              <span
                aria-hidden
                className="hidden h-3.5 w-px bg-line-200 sm:block sm:h-4"
              />
              <InfoField
                label="견적가"
                value={priceLabel}
                color="neutral"
                className="gap-1 sm:gap-3"
                labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                valueClassName="text-md-bold text-black-300 sm:text-2lg-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            평점
          </p>
          <StarRating value={review.rating} readOnly />
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            상세 후기
          </p>
          <p className="whitespace-pre-wrap rounded-2xl bg-background-200 px-4 py-3.5 text-lg-regular text-black-300 sm:text-xl-regular">
            {review.content}
          </p>
        </div>

        <p className="flex items-center justify-end gap-2 text-md-regular text-gray-300">
          <span>작성일</span>
          <span>{createdLabel}</span>
        </p>

        <div className="flex w-full gap-2 sm:gap-3">
          <Button
            variant="outlined"
            size="sm"
            className="sm:h-16 sm:text-xl-semibold"
            onClick={onDelete}
          >
            리뷰 삭제
          </Button>
          <Button
            variant="solid"
            size="sm"
            showIcon
            className="sm:h-16 sm:text-xl-semibold"
            onClick={onEdit}
          >
            리뷰 수정
          </Button>
        </div>
      </div>
    </section>
  );
};
