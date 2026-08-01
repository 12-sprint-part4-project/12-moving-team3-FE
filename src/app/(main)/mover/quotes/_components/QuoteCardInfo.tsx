import { InfoField } from '@/components/ui/InfoField/InfoField';
import { cn } from '@/lib/utils';

export interface QuoteCardInfoProps {
  customerName: string;
  moveDate: string;
  departure: string;
  arrival: string;
  className?: string;
}

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

/** 견적 카드 공통 — 고객명·이사일·출발·도착 정보 */
export const QuoteCardInfo = ({
  customerName,
  moveDate,
  departure,
  arrival,
  className = '',
}: QuoteCardInfoProps) => (
  <div
    className={cn(
      'flex w-full flex-col gap-3.5 lg:gap-4.5 lg:rounded-md lg:py-4 lg:shadow-request-card-body',
      className
    )}
  >
    <div className="flex flex-col gap-3.5 lg:gap-4.5">
      <h3 className="text-lg-semibold text-black-300 lg:text-xl-semibold">
        {customerName}
        <span className="ml-1 lg:ml-2">고객님</span>
      </h3>

      {/* 모바일·태블릿 이사일 렌더 */}
      <div className="lg:hidden">
        <InfoField
          label="이사일"
          value={moveDate}
          color="neutral"
          className="gap-2"
          labelClassName={FIELD_LABEL_CLASS}
          valueClassName={FIELD_VALUE_CLASS}
        />
      </div>
    </div>

    <div className="h-px w-full bg-line-100" />

    {/* 모바일·태블릿 출발·도착 렌더 */}
    <div className="flex flex-wrap items-center gap-3.5 lg:hidden">
      <InfoField
        label="출발"
        value={departure}
        color="neutral"
        className="gap-2"
        labelClassName={FIELD_LABEL_CLASS}
        valueClassName={FIELD_VALUE_CLASS}
      />
      <span aria-hidden className="h-3.5 w-px bg-line-200" />
      <InfoField
        label="도착"
        value={arrival}
        color="neutral"
        className="gap-2"
        labelClassName={FIELD_LABEL_CLASS}
        valueClassName={FIELD_VALUE_CLASS}
      />
    </div>

    {/* 데스크톱 이사일·출발·도착 렌더 */}
    <div className="hidden min-w-0 flex-wrap items-center gap-x-4 gap-y-2 lg:flex">
      <InfoField
        label="이사일"
        value={moveDate}
        color="neutral"
        className="min-w-0 gap-3"
        labelClassName={FIELD_LABEL_CLASS}
        valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
      />
      <span
        aria-hidden
        className="hidden h-4 w-px shrink-0 bg-line-200 xl:block"
      />
      <InfoField
        label="출발"
        value={departure}
        color="neutral"
        className="min-w-0 gap-3"
        labelClassName={FIELD_LABEL_CLASS}
        valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
      />
      <span
        aria-hidden
        className="hidden h-4 w-px shrink-0 bg-line-200 xl:block"
      />
      <InfoField
        label="도착"
        value={arrival}
        color="neutral"
        className="min-w-0 gap-3"
        labelClassName={FIELD_LABEL_CLASS}
        valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
      />
    </div>
  </div>
);
