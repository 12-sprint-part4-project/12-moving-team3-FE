import { useTranslation } from '@/i18n/useTranslation';
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
    row: 'gap-4 text-md-medium lg:gap-6 lg:text-2lg-medium',
    label: 'w-auto min-w-[5.5rem] shrink-0 whitespace-nowrap lg:min-w-[6.5rem]',
  },
  customerDetail: {
    list: DETAIL_LIST,
    row: `gap-6 ${DETAIL_ROW}`,
    label: `min-w-[5.5rem] shrink-0 whitespace-nowrap ${DETAIL_LABEL}`,
  },
  moverDetail: {
    list: DETAIL_LIST,
    row: `gap-6 ${DETAIL_ROW}`,
    label: `min-w-[5.5rem] shrink-0 whitespace-nowrap ${DETAIL_LABEL}`,
  },
} as const;

const VALUE_CLASS = 'min-w-0 break-keep text-black-400';

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
  const { t } = useTranslation();
  const rows = [
    { label: t('quotes.requestedAt'), value: info.requestedAtLabel },
    { label: t('common.service'), value: info.serviceLabel },
    { label: t('quotes.usedOn'), value: info.moveDateLabel },
    { label: t('estimateRequest.departure'), value: info.departure },
    { label: t('estimateRequest.arrival'), value: info.arrival },
  ];
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
}: QuoteInfoSectionProps) => {
  const { t } = useTranslation();

  return (
    <section className={cn('flex w-full flex-col gap-5 lg:gap-10', className)}>
      <h2 className="text-lg-semibold text-black-400 lg:text-2xl-semibold">
        {t('quotes.info')}
      </h2>
      <QuoteInfoRows info={info} variant={variant} />
    </section>
  );
};
