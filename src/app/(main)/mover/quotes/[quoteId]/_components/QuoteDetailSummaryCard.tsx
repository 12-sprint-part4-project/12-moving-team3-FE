import { QuoteCardInfo } from '@/components/quotes/QuoteCardInfo';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

import type { QuoteDetailViewModel } from '@/types/quote';

export interface QuoteDetailSummaryCardProps {
  detail: QuoteDetailViewModel;
  className?: string;
}

/** 견적 상세 상단 요약 카드 */
export const QuoteDetailSummaryCard = ({
  detail,
  className = '',
}: QuoteDetailSummaryCardProps) => {
  const { t } = useTranslation();

  return (
    <article
      className={cn(
        'flex w-full max-w-[59.6875rem] flex-col gap-3.5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      <div className="flex w-full items-center gap-2 lg:gap-3">
        {detail.isConfirmed ? (
          <MoveTypeChip type="quoteConfirmed" size="sm">
            {t('quoteStatus.confirmed')}
          </MoveTypeChip>
        ) : null}
        {detail.isRejected ? (
          <MoveTypeChip type="quoteRejected" size="sm">
            {t('quoteStatus.rejected')}
          </MoveTypeChip>
        ) : null}
        {detail.moveType ? (
          <MoveTypeChip type={detail.moveType} size="sm" />
        ) : null}
        {detail.isDesignated ? (
          <MoveTypeChip type="designated" size="sm" />
        ) : null}
      </div>

      <QuoteCardInfo
        displayName={detail.customerName}
        moveDate={detail.moveDateLabel}
        departure={detail.summaryDeparture}
        arrival={detail.summaryArrival}
      />
    </article>
  );
};
