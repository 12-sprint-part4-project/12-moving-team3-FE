'use client';

import { useId, useState } from 'react';

import ProfileIcon from '@/assets/icons/profile.svg';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { TextArea } from '@/components/ui/Input/TextArea';
import { StarRating } from '@/components/ui/StarRating/StarRating';

import { cn } from '@/lib/utils';
import {
  API_MOVE_TYPE_TO_UI,
  type ApiMoveType,
} from '@/types/estimateRequest';
import {
  MAX_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
} from '@/types/review';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
  MOVE_TYPE_CHIP_RESPONSIVE_CLASS,
} from './modalPanel';

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
  className = '',
}: WriteReviewModalProps) => {
  const titleId = useId();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const trimmedLength = content.trim().length;
  const isSubmittable =
    rating > 0 &&
    trimmedLength >= MIN_REVIEW_CONTENT_LENGTH &&
    trimmedLength <= MAX_REVIEW_CONTENT_LENGTH;

  const moveTypeUi = moveType ? API_MOVE_TYPE_TO_UI[moveType] : null;

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

      <div className="flex w-full flex-col gap-5 sm:gap-8">
        <div className="flex flex-col gap-3.5 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {moveTypeUi ? (
              <MoveTypeChip
                type={moveTypeUi}
                size="sm"
                className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
              />
            ) : null}
            {isDesignated && (
              <MoveTypeChip
                type="designated"
                size="sm"
                className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
              />
            )}
          </div>

          {/* 기사님 요약 카드 */}
          <div className="flex w-full items-center gap-3 rounded-xl border border-line-100 bg-white px-3.5 py-3 shadow-[0.25rem_0.25rem_0.5rem] shadow-shadow-gray-200/10 sm:gap-4 sm:rounded-2xl sm:px-[1.125rem] sm:py-6">
            <div className="size-[2.875rem] shrink-0 overflow-hidden rounded-full sm:size-14">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element -- 프로필 이미지 CDN 도메인이 아직 확정되지 않아 next/image 대신 img 사용
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
                  value={moveDate}
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
                  value={quotePrice}
                  color="neutral"
                  className="gap-1 sm:gap-3"
                  labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                  valueClassName="text-md-bold text-black-300 sm:text-2lg-bold"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            평점을 선택해 주세요
          </p>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            상세 후기를 작성해 주세요
          </p>
          {/* size=sm 기준 마크업 + sm:에서 타이포만 md 스펙으로 올린다 (이중 TextArea 방지) */}
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
        리뷰 등록
      </ModalCtaButton>
    </section>
  );
};
