'use client';

import Link from 'next/link';

import { Button } from '@/components/Button/Button';
import { MoverProfileBlock } from '@/components/movers/MoverProfileBlock';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cn } from '@/lib/utils';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';
import type { PendingQuoteCardModel } from '@/types/customerQuote';
import type { MoveTypeOption } from '@/types/estimateRequest';

export interface PendingQuoteCardProps {
  quote: PendingQuoteCardModel;
  /** 다른 카드 포함 확정 요청 진행 중 */
  isConfirming?: boolean;
  /** 이 카드의 확정 요청 진행 중 */
  isConfirmingThis?: boolean;
  /** 채팅방 생성 진행 중 */
  isChatPending?: boolean;
  onConfirm?: (quoteId: number) => void;
  onChatClick?: (quote: PendingQuoteCardModel) => void;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isFavoritePending?: boolean;
  className?: string;
}

/** Figma Mobile Card-list/대기중인내역 — 짧은 이사 유형 라벨 */
const MOVE_TYPE_SHORT_LABEL: Record<MoveTypeOption, string> = {
  small: '소형',
  home: '가정',
  office: '사무실',
};

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

const CTA_CLASS =
  'h-12 min-w-0 flex-1 rounded-lg text-lg-semibold lg:h-16 lg:rounded-2xl lg:text-xl-semibold';

/**
 * `/quotes` 대기 중인 견적 카드.
 * 하단 CTA: 1줄 [견적 확정하기 solid][채팅하기 outlined] / 2줄 [상세보기 텍스트].
 * 지정 견적인데 designatedMoverId 없으면 채팅 CTA 숨김.
 */
export const PendingQuoteCard = ({
  quote,
  isConfirming = false,
  isConfirmingThis = false,
  isChatPending = false,
  onConfirm,
  onChatClick,
  onFavoriteClick,
  isFavoritePending = false,
  className = '',
}: PendingQuoteCardProps) => {
  const detailHref = `/quotes/${quote.quoteId}`;
  const canStartChat =
    !quote.isDesignated || quote.designatedMoverId != null;

  /** 견적 확정 */
  const handleConfirm = () => {
    onConfirm?.(quote.quoteId);
  };

  /** 채팅하기 */
  const handleChatClick = () => {
    onChatClick?.(quote);
  };

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-2 rounded-2xl border border-line-100 bg-white px-3 pt-5 pb-3.5 shadow-request-card lg:gap-6 lg:px-6 lg:pt-7 lg:pb-5.5',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3.5 lg:gap-6">
        <div className="flex w-full flex-wrap items-center gap-2 lg:hidden">
          <MoveTypeChip type="quotePending" size="sm">
            견적 대기
          </MoveTypeChip>
          {quote.moveType ? (
            <MoveTypeChip type={quote.moveType} size="sm">
              {MOVE_TYPE_SHORT_LABEL[quote.moveType]}
            </MoveTypeChip>
          ) : null}
          {quote.isDesignated ? (
            <MoveTypeChip type="designated" size="sm">
              지정 견적
            </MoveTypeChip>
          ) : null}
        </div>

        <div className="hidden w-full flex-wrap items-center gap-3 lg:flex">
          <MoveTypeChip type="quotePending" size="md">
            견적 대기
          </MoveTypeChip>
          {quote.moveType ? (
            <MoveTypeChip type={quote.moveType} size="md" />
          ) : null}
          {quote.isDesignated ? (
            <MoveTypeChip type="designated" size="md" />
          ) : null}
        </div>

        <div className="flex w-full flex-col gap-3.5 lg:gap-6">
          <MoverProfileBlock
            mover={toMoverCardModelFromCustomerQuoteMover(quote.mover)}
            disableNavigation
            onFavoriteClick={onFavoriteClick}
            isFavoritePending={isFavoritePending}
          />

          {/* 이사일 · 출발 · 도착 — Mobile: 2행 / Desktop: 1행 */}
          <div className="flex w-full flex-col gap-3.5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-4">
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
              className="hidden h-4 w-px shrink-0 bg-line-200 lg:block"
            />
            <div className="flex min-w-0 flex-wrap items-center gap-x-3.5 gap-y-2 lg:gap-x-4">
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
                className="h-3.5 w-px shrink-0 bg-line-200 lg:h-4"
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

      {/* CTA — 1줄 확정·채팅 / 2줄 상세보기(텍스트) */}
      <div className="flex w-full flex-col gap-2 lg:gap-3">
        <div className="flex w-full gap-2 lg:gap-3">
          <Button
            size="md"
            variant="solid"
            className={CTA_CLASS}
            disabled={isConfirming}
            onClick={handleConfirm}
            aria-label={`${quote.mover.name} 기사님 견적 확정하기`}
          >
            {isConfirmingThis ? '확정 중...' : '견적 확정하기'}
          </Button>
          {canStartChat ? (
            <Button
              size="md"
              variant="outlined"
              className={CTA_CLASS}
              disabled={isConfirming || isChatPending}
              onClick={handleChatClick}
              aria-label={`${quote.mover.name} 기사님과 채팅하기`}
            >
              {isChatPending ? '연결 중...' : '채팅하기'}
            </Button>
          ) : null}
        </div>
        <Link
          href={detailHref}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center py-2 text-center text-md-medium text-blue-300 hover:underline focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none active:text-blue-200 lg:text-lg-medium"
          aria-label={`${quote.mover.name} 기사님 견적 상세보기`}
        >
          상세보기
        </Link>
      </div>
    </article>
  );
};
