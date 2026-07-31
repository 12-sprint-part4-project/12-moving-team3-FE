import { Button } from '@/components/Button/Button';
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
      <div className="flex w-full flex-col gap-3.5 lg:gap-[1.125rem] lg:rounded-md lg:px-[1.125rem] lg:py-4 lg:shadow-request-card-body">
        <div className="flex flex-col gap-3.5 lg:gap-[1.125rem]">
          <h3 className="text-lg-semibold text-black-300 lg:text-xl-semibold">
            {request.customerName}
            <span className="ml-1 lg:ml-2">고객님</span>
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
        <div className="hidden min-w-0 flex-wrap items-center gap-x-4 gap-y-2 lg:flex">
          <InfoField
            label="이사일"
            value={request.moveDate}
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
            value={request.departure}
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
            value={request.arrival}
            color="neutral"
            className="min-w-0 gap-3"
            labelClassName={FIELD_LABEL_CLASS}
            valueClassName={cn(FIELD_VALUE_CLASS, 'min-w-0 break-keep')}
          />
        </div>
      </div>

      {/* 견적 보내기·반려 버튼 렌더 (사이즈별 분리) */}
      <div className="flex w-full min-w-0 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-4">
        <div className="w-full min-w-0 lg:hidden">
          <Button
            size="sm"
            variant="solid"
            showIcon
            onClick={handleSendQuote}
            className="cursor-pointer"
          >
            견적 보내기
          </Button>
        </div>
        <div className="hidden w-full min-w-0 lg:block lg:flex-1">
          <Button
            size="md"
            variant="solid"
            showIcon
            onClick={handleSendQuote}
            className="cursor-pointer"
          >
            견적 보내기
          </Button>
        </div>
        <div className="w-full min-w-0 lg:hidden">
          <Button
            size="sm"
            variant="outlined"
            onClick={handleReject}
            className="cursor-pointer"
          >
            반려
          </Button>
        </div>
        <div className="hidden w-full min-w-0 lg:block lg:flex-1">
          <Button
            size="md"
            variant="outlined"
            onClick={handleReject}
            className="cursor-pointer"
          >
            반려
          </Button>
        </div>
      </div>
    </article>
  );
};
