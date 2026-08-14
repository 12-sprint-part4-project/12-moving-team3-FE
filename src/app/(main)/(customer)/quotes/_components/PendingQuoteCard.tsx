'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/Button/Button';
import { MoverProfileBlock } from '@/components/movers/MoverProfileBlock';
import { QuotePriceRow } from '@/components/quotes/QuotePriceRow';
import { QuoteStatusChipRow } from '@/components/quotes/QuoteStatusChips';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cardHover } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import type { PendingQuoteCardModel } from '@/types/customerQuote';
import type { MoverCardModel } from '@/types/mover';

export interface PendingQuoteCardProps {
  quote: PendingQuoteCardModel;
  /** MoverProfileBlock용으로 변환된 기사 카드 모델 */
  mover: MoverCardModel;
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

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

const CTA_CLASS =
  'h-12 min-w-0 flex-1 rounded-lg text-lg-semibold lg:h-16 lg:rounded-2xl lg:text-xl-semibold';

/** `/quotes` 대기 견적 카드. - 확정·채팅·상세보기 CTA. */
export const PendingQuoteCard = ({
  quote,
  mover,
  isConfirming = false,
  isConfirmingThis = false,
  isChatPending = false,
  onConfirm,
  onChatClick,
  onFavoriteClick,
  isFavoritePending = false,
  className = '',
}: PendingQuoteCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const detailHref = `/quotes/${quote.quoteId}`;

  const handleConfirm = () => {
    onConfirm?.(quote.quoteId);
  };

  const handleChatClick = () => {
    onChatClick?.(quote);
  };

  // 칩·프로필·이사정보·견적가·CTA(확정/채팅/상세)
  return (
    <motion.article
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'flex w-full flex-col gap-2 rounded-2xl border border-line-100 bg-white px-3 pt-5 pb-3.5 shadow-request-card lg:gap-6 lg:px-6 lg:pt-7 lg:pb-5.5',
        className
      )}
    >
      {/* 상태 칩 + 기사 프로필 + 이사일/출발/도착 */}
      <div className="flex w-full flex-col gap-3.5 lg:gap-6">
        <QuoteStatusChipRow
          status="pending"
          moveType={quote.moveType}
          isDesignated={quote.isDesignated}
          shortDesignatedLabel="지정 견적"
        />

        <div className="flex w-full flex-col gap-3.5 lg:gap-6">
          <MoverProfileBlock
            mover={mover}
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

      <QuotePriceRow priceLabel={quote.priceLabel} />

      {/* CTA — 확정·채팅 / 상세보기 */}
      <div className="flex w-full flex-col gap-2 lg:gap-3">
        <div className="flex w-full gap-2 lg:gap-3">
          <Button
            size="md"
            variant="solid"
            className={CTA_CLASS}
            disabled={isConfirming}
            onClick={handleConfirm}
            aria-label={`${mover.name} 기사님 견적 확정하기`}
          >
            {isConfirmingThis ? '확정 중...' : '견적 확정하기'}
          </Button>
          {quote.canStartChat ? (
            <Button
              size="md"
              variant="outlined"
              className={CTA_CLASS}
              disabled={isConfirming || isChatPending}
              onClick={handleChatClick}
              aria-label={`${mover.name} 기사님과 채팅하기`}
            >
              {isChatPending ? '연결 중...' : '채팅하기'}
            </Button>
          ) : null}
        </div>
        <Link
          href={detailHref}
          className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center py-2 text-center text-md-medium text-blue-300 hover:underline focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none active:text-blue-200 lg:text-lg-medium"
          aria-label={`${mover.name} 기사님 견적 상세보기`}
        >
          상세보기
        </Link>
      </div>
    </motion.article>
  );
};
