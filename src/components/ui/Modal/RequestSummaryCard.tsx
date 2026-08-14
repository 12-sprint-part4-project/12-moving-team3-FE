'use client';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cn } from '@/lib/utils';

import { MOVE_TYPE_CHIP_RESPONSIVE_CLASS } from './modalPanel';

export type RequestSummaryMoveType = 'small' | 'home' | 'office';

export interface RequestSummaryCardProps {
  moveType?: RequestSummaryMoveType;
  isDesignated?: boolean;
  customerName: string;
  moveDate: string;
  departure: string;
  arrival: string;
  className?: string;
}

/** InfoField에 공통으로 얹는 모달 요약 카드 타이포 */
const FIELD_CLASS = 'gap-2 sm:gap-3';
const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium sm:py-1 sm:text-lg-regular';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 sm:text-lg-medium';

/**
 * 견적 보내기·반려요청 모달에서 쓰는 요청 요약 UI.
 * 이사 유형 칩 + 고객/이사일/출발/도착 카드를 한곳에서 관리한다.
 */
export const RequestSummaryCard = ({
  moveType,
  isDesignated = false,
  customerName,
  moveDate,
  departure,
  arrival,
  className = '',
}: RequestSummaryCardProps) => {
  const hasChips = Boolean(moveType) || isDesignated;

  return (
    <div className={cn('flex flex-col gap-3.5 sm:gap-6', className)}>
      {hasChips ? (
        <div className="flex items-center gap-2 sm:gap-3">
          {moveType ? (
            <MoveTypeChip
              type={moveType}
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

      <div className="flex w-full flex-col gap-1.5 rounded-md border border-line-100 bg-white px-4 py-2.5 sm:gap-4 sm:rounded-lg sm:px-[1.125rem] sm:py-6 sm:shadow-[0.25rem_0.25rem_0.5rem] sm:shadow-shadow-gray-200/10">
        <p className="text-md-semibold text-black-300 sm:text-xl-semibold">
          {customerName} 고객님
        </p>
        <div className="flex flex-col gap-2 sm:gap-3.5">
          <InfoField
            label="이사일"
            value={moveDate}
            color="neutral"
            className={FIELD_CLASS}
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={FIELD_VALUE_CLASS}
          />
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            <InfoField
              label="출발"
              value={departure}
              color="neutral"
              className={FIELD_CLASS}
              labelClassName={FIELD_LABEL_CLASS}
              valueClassName={FIELD_VALUE_CLASS}
            />
            <span aria-hidden className="h-3.5 w-px bg-line-200 sm:h-4" />
            <InfoField
              label="도착"
              value={arrival}
              color="neutral"
              className={FIELD_CLASS}
              labelClassName={FIELD_LABEL_CLASS}
              valueClassName={FIELD_VALUE_CLASS}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
