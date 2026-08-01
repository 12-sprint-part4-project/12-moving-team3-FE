import Link from 'next/link';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cn } from '@/lib/utils';
import type { SentQuoteCardModel } from '@/types/quote';

import { QuoteCardInfo } from './QuoteCardInfo';

export interface SentQuoteCardProps {
  quote: SentQuoteCardModel;
  className?: string;
}

/** 보낸 견적 카드 */
export const SentQuoteCard = ({
  quote,
  className = '',
}: SentQuoteCardProps) => {
  const detailHref = `/mover/quotes/${quote.id}`;

  const cardBody = (
    <>
      {/* 상태·이사 유형·지정 칩 렌더 */}
      <div className="flex w-full items-center gap-2 lg:gap-3">
        {quote.isConfirmed ? (
          <MoveTypeChip type="quoteConfirmed" size="sm">
            견적 확정
          </MoveTypeChip>
        ) : null}
        {quote.moveType ? (
          <MoveTypeChip type={quote.moveType} size="sm" />
        ) : null}
        {quote.isDesignated ? (
          <MoveTypeChip type="designated" size="sm" />
        ) : null}
      </div>

      <QuoteCardInfo
        customerName={quote.customerName}
        moveDate={quote.moveDate}
        departure={quote.departure}
        arrival={quote.arrival}
      />

      {/* 견적 금액 렌더 */}
      <div className="flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4">
        <p className="text-md-medium text-black-400 lg:text-2lg-medium">
          견적 금액
        </p>
        <p className="text-2lg-bold text-black-400 lg:text-2xl-bold">
          {quote.priceLabel}
        </p>
      </div>
    </>
  );

  return (
    <article
      className={cn(
        'relative flex w-full flex-col gap-6.5 overflow-hidden rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      {quote.isMoveCompleted ? (
        <div className="flex w-full flex-col gap-6.5 lg:gap-4">
          {cardBody}
        </div>
      ) : (
        <Link
          href={detailHref}
          className="flex w-full flex-col gap-6.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 lg:gap-4"
          aria-label={`${quote.customerName} 고객님 견적 상세보기`}
        >
          {cardBody}
        </Link>
      )}

      {/* 이사 완료 오버레이 렌더 */}
      {quote.isMoveCompleted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-300 bg-black-500/65">
          <p className="text-lg-semibold text-white lg:text-2lg-semibold">
            이사 완료된 견적이에요
          </p>
          <Link
            href={detailHref}
            aria-label={`${quote.customerName} 고객님 이사 완료 견적 상세보기`}
            className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 px-4 py-2 text-md-semibold text-blue-300 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-[1.125rem] lg:py-2.5 lg:text-lg-semibold"
          >
            견적 상세보기
          </Link>
        </div>
      ) : null}
    </article>
  );
};
