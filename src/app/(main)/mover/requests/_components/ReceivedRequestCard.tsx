import {
  Button,
  type ButtonSize,
  type ButtonVariant,
} from '@/components/Button/Button';
import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';

import { cn } from '@/lib/utils';

import type { ReceivedRequestCardModel } from '@/types/estimateRequest';

export interface ReceivedRequestCardProps {
  request: ReceivedRequestCardModel;
  onSendQuote?: (request: ReceivedRequestCardModel) => void;
  onReject?: (request: ReceivedRequestCardModel) => void;
  className?: string;
}

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

/** 받은 요청 카드 — 고객·경로 정보와 액션 버튼 표시 */
export const ReceivedRequestCard = ({
  request,
  onSendQuote,
  onReject,
  className = '',
}: ReceivedRequestCardProps) => {
  /** 견적 보내기 클릭 전달 */
  const handleSendQuote = () => {
    onSendQuote?.(request);
  };

  /** 반려 클릭 전달 */
  const handleReject = () => {
    onReject?.(request);
  };

  /** 지정 견적만 반려 가능 — 일반 요청은 견적 보내기만 표시 */
  type CardAction = {
    label: string;
    variant: ButtonVariant;
    showIcon: boolean;
    onClick: () => void;
  };

  const rejectActions: CardAction[] = request.isDesignated
    ? [
        {
          label: '반려',
          variant: 'outlined',
          showIcon: false,
          onClick: handleReject,
        },
      ]
    : [];

  const CARD_ACTIONS: CardAction[] = [
    {
      label: '견적 보내기',
      variant: 'solid',
      showIcon: true,
      onClick: handleSendQuote,
    },
    ...rejectActions,
  ];

  /** size별 액션 버튼 공통 렌더 */
  const renderCardActions = (size: ButtonSize) =>
    CARD_ACTIONS.map((action) => (
      <div
        key={`${size}-${action.label}`}
        className={
          size === 'sm'
            ? 'w-full min-w-0 lg:hidden'
            : 'hidden w-full min-w-0 lg:block lg:flex-1'
        }
      >
        <Button
          size={size}
          variant={action.variant}
          showIcon={action.showIcon}
          onClick={action.onClick}
          className="cursor-pointer"
        >
          {action.label}
        </Button>
      </div>
    ));

  return (
    <article
      className={cn(
        'flex w-full flex-col gap-5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        className
      )}
    >
      {/* 이사 유형·지정 칩과 경과 시간 렌더 */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          {request.moveType ? (
            <MoveTypeChip type={request.moveType} size="sm" />
          ) : null}
          {request.isDesignated ? (
            <MoveTypeChip type="designated" size="sm" />
          ) : null}
        </div>
        <p className="text-xs-regular whitespace-nowrap text-gray-500 lg:text-md-regular">
          {request.requestedAgo}
        </p>
      </div>

      {/* 고객·이사일·출발·도착 정보 렌더 */}
      <div className="flex w-full flex-col gap-3.5 lg:gap-4.5 lg:rounded-md lg:px-4.5 lg:py-4 lg:shadow-request-card-body">
        <div className="flex flex-col gap-3.5 lg:gap-4.5">
          <h3 className="flex flex-wrap items-baseline gap-x-1.5 text-lg-semibold text-black-300 lg:gap-x-2 lg:text-xl-semibold">
            <span>
              {request.customerName}
              <span className="ml-1 lg:ml-2">고객님</span>
            </span>
            <span className="text-md-medium text-gray-500 lg:text-lg-medium">
              (지정: {request.quoteCount.designated} / 일반:{' '}
              {request.quoteCount.general})
            </span>
          </h3>

          {/* 모바일·태블릿 이사일 렌더 */}
          <div className="lg:hidden">
            <InfoField
              label="이사일"
              value={request.moveDate}
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
            value={request.departure}
            color="neutral"
            className="gap-2"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={FIELD_VALUE_CLASS}
          />
          <span aria-hidden className="h-3.5 w-px bg-line-200" />
          <InfoField
            label="도착"
            value={request.arrival}
            color="neutral"
            className="gap-2"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={FIELD_VALUE_CLASS}
          />
        </div>

        {/* 데스크톱 이사일·출발·도착 렌더 */}
        <div className="hidden min-w-0 items-center gap-x-4 lg:flex lg:flex-nowrap">
          <InfoField
            label="이사일"
            value={request.moveDate}
            color="neutral"
            className="shrink-0 gap-3"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={cn(FIELD_VALUE_CLASS, 'whitespace-nowrap')}
          />
          <span
            aria-hidden
            className="hidden h-4 w-px shrink-0 bg-line-200 xl:block"
          />
          <InfoField
            label="출발"
            value={
              <span className="block truncate" title={request.departure}>
                {request.departure}
              </span>
            }
            color="neutral"
            className="min-w-0 gap-3 overflow-hidden"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={FIELD_VALUE_CLASS}
          />
          <span
            aria-hidden
            className="hidden h-4 w-px shrink-0 bg-line-200 xl:block"
          />
          <InfoField
            label="도착"
            value={
              <span className="block truncate" title={request.arrival}>
                {request.arrival}
              </span>
            }
            color="neutral"
            className="min-w-0 gap-3 overflow-hidden"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={FIELD_VALUE_CLASS}
          />
        </div>
      </div>

      {/* 견적 보내기·반려 버튼 렌더 (사이즈별 분리) */}
      <div className="flex w-full min-w-0 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-4">
        {renderCardActions('sm')}
        {renderCardActions('md')}
      </div>
    </article>
  );
};
