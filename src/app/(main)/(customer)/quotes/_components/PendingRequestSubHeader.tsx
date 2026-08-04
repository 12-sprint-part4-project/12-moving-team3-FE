import { SubHeader } from '@/components/ui/SubHeader/SubHeader';
import type { PendingRequestSummaryModel } from '@/types/customerQuote';

export interface PendingRequestSubHeaderProps {
  summary: PendingRequestSummaryModel;
}

/** 반응형 요청 견적 서브 헤더 */
export const PendingRequestSubHeader = ({
  summary,
}: PendingRequestSubHeaderProps) => {
  const sharedProps = {
    moveType: summary.serviceLabel,
    requestedAt: summary.requestedAtLabel,
    from: summary.from,
    to: summary.to,
    moveDate: summary.moveDateLabel,
  };

  return (
    <>
      <div className="md:hidden">
        <SubHeader size="sm" {...sharedProps} />
      </div>
      <div className="hidden md:block lg:hidden">
        <SubHeader size="md" {...sharedProps} />
      </div>
      <div className="hidden lg:block">
        <SubHeader size="lg" {...sharedProps} />
      </div>
    </>
  );
};
