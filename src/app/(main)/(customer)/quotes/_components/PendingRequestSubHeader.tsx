import { SubHeader } from '@/components/ui/SubHeader/SubHeader';
import type { PendingRequestSummaryModel } from '@/types/customerQuote';

export interface PendingRequestSubHeaderProps {
  summary: PendingRequestSummaryModel;
}

/** `/quotes` 대기 탭 서브헤더. */
export const PendingRequestSubHeader = ({
  summary,
}: PendingRequestSubHeaderProps) => (
  // 활성 요청 이사 요약(서비스·요청일·출발/도착·이사일)
  <SubHeader
    size="responsive"
    moveType={summary.serviceLabel}
    requestedAt={summary.requestedAtLabel}
    from={summary.from}
    to={summary.to}
    moveDate={summary.moveDateLabel}
  />
);
