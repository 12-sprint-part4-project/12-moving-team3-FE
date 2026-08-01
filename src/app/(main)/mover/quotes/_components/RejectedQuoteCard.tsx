import Link from 'next/link';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cn } from '@/lib/utils';
import type { RejectedQuoteCardModel } from '@/types/quote';

import { QuoteCardInfo } from './QuoteCardInfo';

export interface RejectedQuoteCardProps {
  quote: RejectedQuoteCardModel;
  className?: string;
}

/** 반려 요청 카드 */
export const RejectedQuoteCard = ({
  quote,
  className = '',
}: RejectedQuoteCardProps) => {
  const detailHref = `/mover/quotes/${quote.id}`;

  return (
    <article
      className={cn(
        'relative flex w-full flex-col gap-3.5 overflow-hidden rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      <div className="flex w-full flex-col gap-3.5 lg:gap-4" aria-hidden="true">
        {/* 이사 유형·지정 칩 렌더 */}
        <div className="flex w-full items-center gap-2 lg:gap-3">
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
      </div>

      {/* 반려 오버레이 렌더 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-300 bg-black-500/65">
        <p className="text-lg-semibold text-white lg:text-2lg-semibold">
          반려된 요청이에요
        </p>
        <Link
          href={detailHref}
          aria-label={`${quote.customerName} 고객님 반려 견적 상세보기`}
          className="inline-flex items-center justify-center rounded-2xl border border-blue-200 bg-blue-100 px-4 py-2 text-md-semibold text-blue-300 transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none lg:px-[1.125rem] lg:py-2.5 lg:text-lg-semibold"
        >
          견적 상세보기
        </Link>
      </div>
    </article>
  );
};
