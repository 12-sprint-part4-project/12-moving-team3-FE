import { MoverProfileBlock } from '@/components/movers/MoverProfileBlock';
import { QuoteStatusChips } from '@/components/quotes/QuoteStatusChips';
import { cn } from '@/lib/utils';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';
import type {
  CustomerQuoteDetailViewModel,
  CustomerQuoteMoverViewModel,
} from '@/types/customerQuote';

export interface CustomerQuoteDetailSummaryCardProps {
  detail: CustomerQuoteDetailViewModel;
  /** 찜 상태가 반영된 기사님 프로필 */
  mover: CustomerQuoteMoverViewModel;
  onFavoriteClick?: (moverId: string, nextFavorited: boolean) => void;
  isFavoritePending?: boolean;
  className?: string;
}

/** 고객 견적 상세 상단 요약 카드 */
export const CustomerQuoteDetailSummaryCard = ({
  detail,
  mover,
  onFavoriteClick,
  isFavoritePending = false,
  className = '',
}: CustomerQuoteDetailSummaryCardProps) => (
  <article
    className={cn(
      'flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:py-5',
      className
    )}
  >
    <div className="flex w-full flex-wrap items-center gap-2 lg:gap-3">
      <QuoteStatusChips
        status={detail.isConfirmed ? 'confirmed' : 'pending'}
        moveType={detail.moveType}
        isDesignated={detail.isDesignated}
        size="sm"
        statusLabel={detail.isConfirmed ? '견적 확정' : undefined}
      />
    </div>

    {mover.shortDescription ? (
      <p className="text-lg-semibold text-black-300 lg:text-xl-semibold">
        {mover.shortDescription}
      </p>
    ) : null}

    <MoverProfileBlock
      mover={toMoverCardModelFromCustomerQuoteMover(mover)}
      disableNavigation
      onFavoriteClick={onFavoriteClick}
      isFavoritePending={isFavoritePending}
    />
  </article>
);
