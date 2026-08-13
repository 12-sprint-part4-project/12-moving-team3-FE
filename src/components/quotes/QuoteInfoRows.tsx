import { cn } from '@/lib/utils';
import type { QuoteInfoViewModel } from '@/types/customerQuote';

export type QuoteInfoRowsVariant = 'group' | 'customerDetail' | 'moverDetail';

const LIST_BASE =
  'flex w-full flex-col rounded-2xl bg-background-200 px-5 py-4';
const ROW_BASE = 'flex items-start';
const LABEL_BASE = 'shrink-0 text-gray-300';
const DETAIL_LIST =
  'gap-4 border border-line-100 md:px-8 md:py-6 lg:px-10 lg:py-8';
const DETAIL_ROW = 'text-md-regular lg:gap-8 lg:text-2lg-regular';
const DETAIL_LABEL = 'lg:w-[5.625rem]';

const VARIANT_CLASS = {
  group: {
    list: 'gap-2 md:gap-2 md:px-10 md:py-8 lg:gap-2.5',
    row: 'gap-[2.5rem] text-md-medium lg:gap-[2rem] lg:text-2lg-medium',
    label: 'w-[4.0625rem] lg:w-[5.75rem]',
  },
  customerDetail: {
    list: DETAIL_LIST,
    row: `gap-6 ${DETAIL_ROW}`,
    label: `w-[4.0625rem] ${DETAIL_LABEL}`,
  },
  moverDetail: {
    list: DETAIL_LIST,
    row: `gap-[2.5rem] ${DETAIL_ROW}`,
    label: `w-16 ${DETAIL_LABEL}`,
  },
} as const;

const VALUE_CLASS = 'min-w-0 break-keep text-black-400';

const toQuoteInfoRows = (info: QuoteInfoViewModel) => [
  { label: '견적 요청일', value: info.requestedAtLabel },
  { label: '서비스', value: info.serviceLabel },
  { label: '이용일', value: info.moveDateLabel },
  { label: '출발지', value: info.departure },
  { label: '도착지', value: info.arrival },
];

export interface QuoteInfoRowsProps {
  info: QuoteInfoViewModel;
  variant: QuoteInfoRowsVariant;
  className?: string;
}

/** 견적 요청일·서비스·이용일·출발지·도착지 행 */
export const QuoteInfoRows = ({
  info,
  variant,
  className = '',
}: QuoteInfoRowsProps) => {
  const rows = toQuoteInfoRows(info);
  const styles = VARIANT_CLASS[variant];

  return (
    <dl className={cn(LIST_BASE, styles.list, className)}>
      {rows.map((row) => (
        <div key={row.label} className={cn(ROW_BASE, styles.row)}>
          <dt className={cn(LABEL_BASE, styles.label)}>{row.label}</dt>
          <dd className={VALUE_CLASS}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

export interface QuoteInfoSectionProps {
  info: QuoteInfoViewModel;
  variant: Exclude<QuoteInfoRowsVariant, 'group'>;
  className?: string;
}

/** 견적 상세 정보 섹션 (제목 + 행) */
export const QuoteInfoSection = ({
  info,
  variant,
  className = '',
}: QuoteInfoSectionProps) => (
  <section className={cn('flex w-full flex-col gap-5 lg:gap-10', className)}>
    <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
      견적 정보
    </h2>
    <QuoteInfoRows info={info} variant={variant} />
  </section>
);
