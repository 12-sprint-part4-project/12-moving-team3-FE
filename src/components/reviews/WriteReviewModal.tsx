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
import { useTranslation } from '@/i18n/useTranslation';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { cn } from '@/lib/utils';
import { formatQuotePriceLabel } from '@/services/quoteApi';

import type { WritableQuoteItem } from '@/types/review';

export interface WriteReviewModalProps {
  quote: WritableQuoteItem;
  onClose: () => void;
  /** 등록 버튼 클릭 시 호출. API 연동은 호출 측(리뷰 도메인)에서 담당 */
  onSubmit: (review: { rating: number; content: string }) => void;
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
  quote,
  onClose,
  onSubmit,
  isSubmitting = false,
  className = '',
}: WriteReviewModalProps) => {
  const { t } = useTranslation();
  const titleId = useId();
  const moverName = quote.mover?.name?.trim() || t('reviews.fallbackMoverName');
  const avatarSrc = quote.mover?.profileImageUrl ?? undefined;
  const moveDateLabel = formatReviewMoveDate(quote.moveDate);
  const priceLabel = formatQuotePriceLabel(quote.price);

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const isSubmittable = !isSubmitting && isReviewFormValid({ rating, content });

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
      <ModalHeader
        title={t('reviews.modal.writeTitle')}
        onClose={onClose}
        titleId={titleId}
      />

      <ReviewFormFields
        moveType={quote.moveType}
        isDesignated={quote.isDesignated}
        moverName={moverName}
        moveDate={moveDateLabel}
        quotePrice={priceLabel}
        avatarSrc={avatarSrc}
        rating={rating}
        onRatingChange={setRating}
        content={content}
        onContentChange={setContent}
      />

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        {t('reviews.modal.submitCreate')}
      </ModalCtaButton>
    </section>
  );
};
