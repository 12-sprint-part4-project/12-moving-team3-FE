import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { cn } from '@/lib/utils';
import type {
  CustomerQuoteDetailViewModel,
  CustomerQuoteMoverViewModel,
} from '@/types/customerQuote';

import { MoverQuoteProfile } from '../../_components/MoverQuoteProfile';

export interface CustomerQuoteDetailSummaryCardProps {
  detail: CustomerQuoteDetailViewModel;
  /** 로컬 찜 상태가 반영된 기사님 프로필 */
  mover: CustomerQuoteMoverViewModel;
  className?: string;
}

/** 고객 견적 상세 상단 요약 카드 */
export const CustomerQuoteDetailSummaryCard = ({
  detail,
  mover,
  className = '',
}: CustomerQuoteDetailSummaryCardProps) => (
  <article
    className={cn(
      'flex w-full flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:py-5',
      className
    )}
  >
    <div className="flex w-full flex-wrap items-center gap-2 lg:gap-3">
      {detail.isConfirmed ? (
        <MoveTypeChip type="quoteConfirmed" size="sm">
          확정 견적
        </MoveTypeChip>
      ) : (
        <MoveTypeChip type="quotePending" size="sm">
          견적 대기
        </MoveTypeChip>
      )}
      {detail.moveType ? (
        <MoveTypeChip type={detail.moveType} size="sm" />
      ) : null}
      {detail.isDesignated ? (
        <MoveTypeChip type="designated" size="sm" />
      ) : null}
    </div>

    {detail.comment ? (
      <p className="text-lg-semibold text-black-300 lg:text-xl-semibold">
        {detail.comment}
      </p>
    ) : null}

    <MoverQuoteProfile mover={mover} />
  </article>
);
