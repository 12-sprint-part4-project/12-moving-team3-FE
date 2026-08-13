'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

import { MoverProfileBlock } from '@/components/movers/MoverProfileBlock';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cardHover } from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';
import type { ReceivedQuoteCardModel } from '@/types/customerQuote';
import type { MoveTypeOption } from '@/types/estimateRequest';

export interface ReceivedQuoteCardProps {
  quote: ReceivedQuoteCardModel;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isFavoritePending?: boolean;
  className?: string;
}

/** 짧은 이사 유형 라벨 */
const MOVE_TYPE_SHORT_LABEL: Record<MoveTypeOption, string> = {
  small: '소형',
  home: '가정',
  office: '사무실',
};

/** 고객 받았던 견적 카드 */
export const ReceivedQuoteCard = ({
  quote,
  onFavoriteClick,
  isFavoritePending = false,
  className = '',
}: ReceivedQuoteCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const detailHref = `/quotes/${quote.quoteId}`;

  return (
    <motion.article
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'relative flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:py-5',
        className
      )}
    >
      <div className="flex w-full flex-wrap items-center gap-2 lg:hidden">
        {quote.isConfirmed ? (
          <MoveTypeChip type="quoteConfirmed" size="sm">
            확정 견적
          </MoveTypeChip>
        ) : null}
        {quote.moveType ? (
          <MoveTypeChip type={quote.moveType} size="sm">
            {MOVE_TYPE_SHORT_LABEL[quote.moveType]}
          </MoveTypeChip>
        ) : null}
        {quote.isDesignated ? (
          <MoveTypeChip type="designated" size="sm" />
        ) : null}
      </div>

      <div className="hidden w-full flex-wrap items-center gap-3 lg:flex">
        {quote.isConfirmed ? (
          <MoveTypeChip type="quoteConfirmed" size="md">
            확정 견적
          </MoveTypeChip>
        ) : null}
        {quote.moveType ? (
          <MoveTypeChip type={quote.moveType} size="md" />
        ) : null}
        {quote.isDesignated ? (
          <MoveTypeChip type="designated" size="md" />
        ) : null}
      </div>

      {quote.shortDescription ? (
        <p className="text-lg-semibold text-black-300 lg:text-xl-semibold">
          {quote.shortDescription}
        </p>
      ) : null}

      <MoverProfileBlock
        mover={toMoverCardModelFromCustomerQuoteMover(quote.mover)}
        disableNavigation
        onFavoriteClick={onFavoriteClick}
        isFavoritePending={isFavoritePending}
      />

      <div className="flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4">
        <p className="text-md-medium text-black-400 lg:text-2lg-medium">
          견적 금액
        </p>
        <p className="text-2lg-bold text-black-400 lg:text-2xl-bold">
          {quote.priceLabel}
        </p>
      </div>

      {/* stretched link — 찜 버튼(z-10)과 형제로 두어 Link 안 버튼 중첩 방지 */}
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2"
        aria-label={`${quote.mover.name} 기사님 견적 상세보기`}
      />
    </motion.article>
  );
};
