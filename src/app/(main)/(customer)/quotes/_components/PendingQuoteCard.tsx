'use client';

import Link from 'next/link';

import { Button, getButtonClassName } from '@/components/Button/Button';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cn } from '@/lib/utils';
import type { PendingQuoteCardModel } from '@/types/customerQuote';

import { MoverQuoteProfile } from './MoverQuoteProfile';

export interface PendingQuoteCardProps {
  quote: PendingQuoteCardModel;
  /** 다른 카드 포함 확정 요청 진행 중 */
  isConfirming?: boolean;
  /** 이 카드의 확정 요청 진행 중 */
  isConfirmingThis?: boolean;
  onConfirm?: (quoteId: number) => void;
  className?: string;
}

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

/** 고객 대기 중 견적 카드 */
export const PendingQuoteCard = ({
  quote,
  isConfirming = false,
  isConfirmingThis = false,
  onConfirm,
  className = '',
}: PendingQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;

  /** 견적 확정 */
  const handleConfirm = () => {
    onConfirm?.(quote.quoteId);
  };

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-6 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-6 lg:px-6 lg:pt-7 lg:pb-[1.375rem]',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3.5 lg:gap-6">
        {/* 상태·이사 유형·지정 칩 */}
        <div className="flex w-full flex-wrap items-center gap-2 lg:gap-3">
          <MoveTypeChip type="quotePending" size="sm">
            견적 대기
          </MoveTypeChip>
          {quote.moveType ? (
            <MoveTypeChip type={quote.moveType} size="sm" />
          ) : null}
          {quote.isDesignated ? (
            <MoveTypeChip type="designated" size="sm" />
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-3.5 lg:gap-6">
          <MoverQuoteProfile mover={quote.mover} />

          {/* 이사일·출발·도착 */}
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
            <InfoField
              label="이사일"
              value={quote.moveDate}
              color="neutral"
              className="min-w-0 gap-2 lg:gap-3"
              labelClassName={FIELD_LABEL_CLASS}
              valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
            />
            <span
              aria-hidden
              className="hidden h-4 w-px shrink-0 bg-line-200 sm:block"
            />
            <InfoField
              label="출발"
              value={quote.departure}
              color="neutral"
              className="min-w-0 gap-2 lg:gap-3"
              labelClassName={FIELD_LABEL_CLASS}
              valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
            />
            <span
              aria-hidden
              className="hidden h-4 w-px shrink-0 bg-line-200 sm:block"
            />
            <InfoField
              label="도착"
              value={quote.arrival}
              color="neutral"
              className="min-w-0 gap-2 lg:gap-3"
              labelClassName={FIELD_LABEL_CLASS}
              valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
            />
          </div>
        </div>
      </div>

      {/* 견적 금액 */}
      <div className="flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4">
        <p className="text-md-medium text-black-400 lg:text-2lg-medium">
          견적 금액
        </p>
        <p className="text-2lg-bold text-black-400 lg:text-2xl-bold">
          {quote.priceLabel}
        </p>
      </div>

      {/* CTA */}
      <div className="flex w-full gap-2 lg:gap-[0.6875rem]">
        <Button
          size="md"
          variant="solid"
          className="flex-1"
          disabled={isConfirming}
          onClick={handleConfirm}
          aria-label={`${quote.mover.nickname} 기사님 견적 확정하기`}
        >
          {isConfirmingThis ? '확정 중...' : '견적 확정하기'}
        </Button>
        <Link
          href={detailHref}
          className={getButtonClassName({
            size: 'md',
            variant: 'outlined',
            className:
              'flex-1 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none',
          })}
          aria-label={`${quote.mover.nickname} 기사님 견적 상세보기`}
        >
          상세보기
        </Link>
      </div>
    </article>
  );
};
