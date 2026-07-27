'use client';

import { useId, useState } from 'react';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { TextArea } from '@/components/ui/Input/TextArea';

import { cn } from '@/lib/utils';

import { ModalCtaButton } from './ModalCtaButton';
import { ModalHeader } from './ModalHeader';
import {
  MODAL_PANEL_BOTTOM_SHEET_CLASS,
  MODAL_PANEL_CLASS,
  MOVE_TYPE_CHIP_RESPONSIVE_CLASS,
} from './modalPanel';

/** 반려 사유 최소 글자 수 (Figma: 10자 이상일 때 버튼 활성화) */
const MIN_REASON_LENGTH = 10;

type MoveTypeOption = 'small' | 'home' | 'office';

export interface RejectRequestModalProps {
  onClose: () => void;
  /** 반려하기 클릭 시 호출. API 연동은 호출 측에서 담당 */
  onSubmit: (payload: { reason: string }) => void;
  moveType?: MoveTypeOption;
  isDesignated?: boolean;
  customerName: string;
  moveDate: string;
  departure: string;
  arrival: string;
  className?: string;
}

/**
 * 반려요청 모달 콘텐츠 (Figma: Component/modal/반려하기).
 * Modal 셸에 대한 의존 없이 패널 UI만 렌더한다.
 * 사용 시 `<Modal placement="bottom">`과 조합한다 (모바일 하단 시트).
 */
export const RejectRequestModal = ({
  onClose,
  onSubmit,
  moveType = 'small',
  isDesignated = false,
  customerName,
  moveDate,
  departure,
  arrival,
  className = '',
}: RejectRequestModalProps) => {
  const titleId = useId();
  const [reason, setReason] = useState('');

  const isSubmittable = reason.trim().length >= MIN_REASON_LENGTH;

  const handleSubmit = () => {
    if (!isSubmittable) return;
    onSubmit({ reason: reason.trim() });
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
      <ModalHeader title="반려요청" onClose={onClose} titleId={titleId} />

      <div className="flex w-full flex-col gap-5 sm:gap-8">
        <div className="flex flex-col gap-3.5 sm:gap-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <MoveTypeChip
              type={moveType}
              size="sm"
              className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
            />
            {isDesignated && (
              <MoveTypeChip
                type="designated"
                size="sm"
                className={MOVE_TYPE_CHIP_RESPONSIVE_CLASS}
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-1.5 rounded-md border border-line-100 bg-white px-4 py-2.5 sm:gap-4 sm:rounded-lg sm:px-[1.125rem] sm:py-6 sm:shadow-[0.25rem_0.25rem_0.5rem] sm:shadow-shadow-gray-200/10">
            <p className="text-md-semibold text-black-300 sm:text-2xl-semibold">
              {customerName} 고객님
            </p>
            <div className="flex flex-col gap-2 sm:gap-3.5">
              <InfoField
                label="이사일"
                value={moveDate}
                color="neutral"
                className="gap-2 sm:gap-3"
                labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                valueClassName="text-md-medium text-black-300 sm:text-2lg-medium"
              />
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
                <InfoField
                  label="출발"
                  value={departure}
                  color="neutral"
                  className="gap-2 sm:gap-3"
                  labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                  valueClassName="text-md-medium text-black-300 sm:text-2lg-medium"
                />
                <span aria-hidden className="h-3.5 w-px bg-line-200 sm:h-4" />
                <InfoField
                  label="도착"
                  value={arrival}
                  color="neutral"
                  className="gap-2 sm:gap-3"
                  labelClassName="px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-2lg-regular"
                  valueClassName="text-md-medium text-black-300 sm:text-2lg-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg-semibold text-black-300 sm:text-xl-semibold">
            반려 사유를 입력해 주세요
          </p>
          <TextArea
            size="sm"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="최소 10자 이상 입력해주세요"
            className="[&>div]:w-full [&>div>textarea]:sm:text-xl-regular"
            aria-label="반려 사유"
          />
        </div>
      </div>

      <ModalCtaButton disabled={!isSubmittable} onClick={handleSubmit}>
        반려하기
      </ModalCtaButton>
    </section>
  );
};
