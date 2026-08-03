import type { CustomerQuoteDetailViewModel } from '@/types/customerQuote';

export interface CustomerQuoteDetailInfoSectionProps {
  detail: CustomerQuoteDetailViewModel;
}

interface InfoRow {
  label: string;
  value: string;
}

/** 견적 정보 라벨·값 행 목록 생성 */
const buildInfoRows = (detail: CustomerQuoteDetailViewModel): InfoRow[] => [
  { label: '견적 요청일', value: detail.requestedAtLabel },
  { label: '서비스', value: detail.serviceLabel },
  { label: '이용일', value: detail.moveDateLabel },
  { label: '출발지', value: detail.departure },
  { label: '도착지', value: detail.arrival },
];

/** 고객 견적 상세 정보 섹션 */
export const CustomerQuoteDetailInfoSection = ({
  detail,
}: CustomerQuoteDetailInfoSectionProps) => {
  const rows = buildInfoRows(detail);

  return (
    <section className="flex w-full flex-col gap-5 lg:gap-10">
      <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
        견적 정보
      </h2>
      <dl className="flex w-full flex-col gap-4 rounded-2xl border border-line-100 bg-background-200 px-5 py-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-start gap-6 text-md-regular lg:gap-8 lg:text-2lg-regular"
          >
            <dt className="w-[4.0625rem] shrink-0 text-gray-300 lg:w-[5.625rem]">
              {row.label}
            </dt>
            <dd className="min-w-0 break-keep text-black-400">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
