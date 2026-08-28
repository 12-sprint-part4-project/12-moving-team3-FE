'use client';

import { useRef, useState } from 'react';

import { ReviewMoverSummaryCard } from '@/components/reviews/ReviewMoverSummaryCard';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { TextArea } from '@/components/ui/Input/TextArea';
import { MOVE_TYPE_CHIP_RESPONSIVE_CLASS } from '@/components/ui/Modal/modalPanel';
import { StarRating } from '@/components/ui/StarRating/StarRating';
import { useTranslation } from '@/i18n/useTranslation';
import { API_MOVE_TYPE_TO_UI, type ApiMoveType } from '@/types/estimateRequest';
import {
  MAX_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
} from '@/types/review';

import type { ChangeEvent } from 'react';

export interface ReviewFormFieldsProps {
  moveType?: ApiMoveType | null;
  isDesignated?: boolean;
  moverName: string;
  moveDate: string;
  quotePrice: string;
  avatarSrc?: string;
  rating: number;
  onRatingChange: (rating: number) => void;
  content: string;
  onContentChange: (content: string) => void;
  /** 평점 섹션 라벨 */
  ratingLabel?: string;
  /** 상세 후기 섹션 라벨 */
  contentLabel?: string;
}

/** 리뷰 본문 길이·평점 기본 유효성 (제출 중·변경 여부 등은 호출 측에서 추가) */
export const isReviewFormValid = ({
  rating,
  content,
}: {
  rating: number;
  content: string;
}): boolean => {
  const trimmedLength = content.trim().length;
  return (
    rating > 0 &&
    trimmedLength >= MIN_REVIEW_CONTENT_LENGTH &&
    trimmedLength <= MAX_REVIEW_CONTENT_LENGTH
  );
};

/** 작성·수정 모달 공통 — 칩·기사 요약·별점·상세 후기 */
export const ReviewFormFields = ({
  moveType = null,
  isDesignated = false,
  moverName,
  moveDate,
  quotePrice,
  avatarSrc,
  rating,
  onRatingChange,
  content,
  onContentChange,
  ratingLabel,
  contentLabel,
}: ReviewFormFieldsProps) => {
  const { t } = useTranslation();
  const resolvedRatingLabel = ratingLabel ?? t('reviews.form.ratingPrompt');
  const resolvedContentLabel = contentLabel ?? t('reviews.form.contentPrompt');
  const moveTypeUi = moveType ? API_MOVE_TYPE_TO_UI[moveType] : null;

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const raw = event.target.value;
    setOverMax(raw.length > MAX_REVIEW_CONTENT_LENGTH);
    onContentChange(raw.slice(0, MAX_REVIEW_CONTENT_LENGTH));
  };

  const [contentTouched, setContentTouched] = useState(false);
  const [overMax, setOverMax] = useState(false);

  const contentError = overMax
    ? t('reviews.form.contentMax')
    : contentTouched && content.trim().length < MIN_REVIEW_CONTENT_LENGTH
      ? t('reviews.form.contentMin')
      : undefined;

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="mb-7 flex flex-col gap-3.5 tablet:gap-6">
        {moveTypeUi || isDesignated ? (
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
        ) : null}

        <ReviewMoverSummaryCard
          moverName={moverName}
          moveDate={moveDate}
          quotePrice={quotePrice}
          avatarSrc={avatarSrc}
        />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg-semibold text-black-300 tablet:text-xl-semibold">
          {resolvedRatingLabel}
        </p>
        <StarRating value={rating} onChange={onRatingChange} />
        {rating < 1 ? (
          <p className="min-h-6 text-sm-medium text-red-200">
            {t('reviews.form.ratingRequired')}
          </p>
        ) : (
          <p className="min-h-6" />
        )}
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg-semibold text-black-300 tablet:text-xl-semibold">
          {resolvedContentLabel}
        </p>
        <TextArea
          size="sm"
          rows={4}
          value={content}
          onChange={handleContentChange}
          placeholder={t('reviews.form.contentPlaceholder')}
          className="[&>div]:w-full [&>div>textarea]:tablet:text-xl-regular"
          aria-label={t('reviews.form.contentAria')}
          onBlur={() => setContentTouched(true)}
          errorMessage={contentError}
        />
      </div>
    </div>
  );
};
