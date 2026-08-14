'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { MoveTypeChip } from '@/components/ui/Chip/MoveTypeChip';
import { InfoField } from '@/components/ui/InfoField/InfoField';
import {
  cardHover,
  fadeUp,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import {
  RequestCardActionButton,
  type RequestCardAction,
} from './RequestCardActionButton';

import type { ReceivedRequestCardModel } from '@/types/estimateRequest';

export interface ReceivedRequestCardProps {
  request: ReceivedRequestCardModel;
  onSendQuote?: (request: ReceivedRequestCardModel) => void;
  onReject?: (request: ReceivedRequestCardModel) => void;
  onChatClick?: (request: ReceivedRequestCardModel) => void;
  isChatPending?: boolean;
  className?: string;
}

const FIELD_LABEL_CLASS =
  'px-1.5 py-0.5 text-md-medium text-gray-400 lg:py-1 lg:text-2lg-regular lg:text-gray-500';
const FIELD_VALUE_CLASS = 'text-md-medium text-black-300 lg:text-2lg-medium';

/**
 * `/mover/requests` 받은 요청 카드 (견적 보내기 전).
 * CTA: [견적 보내기][+반려(지정만)][채팅하기] — 고객과 GENERAL/DESIGNATED 방 오픈.
 */
export const ReceivedRequestCard = ({
  request,
  onSendQuote,
  onReject,
  onChatClick,
  isChatPending = false,
  className = '',
}: ReceivedRequestCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  /** 견적 보내기 클릭 전달 */
  const handleSendQuote = () => {
    onSendQuote?.(request);
  };

  /** 반려 클릭 전달 */
  const handleReject = () => {
    onReject?.(request);
  };

  /** 채팅하기 클릭 전달 */
  const handleChatClick = () => {
    onChatClick?.(request);
  };

  const canStartChat =
    !request.isDesignated || request.designatedMoverId != null;

  /** 지정 견적만 반려 가능 — 일반 요청은 견적 보내기만 표시 */
  const rejectActions: RequestCardAction[] = request.isDesignated
    ? [
        {
          key: 'reject',
          label: '반려',
          variant: 'outlined',
          showIcon: false,
          onClick: handleReject,
        },
      ]
    : [];

  const chatActions: RequestCardAction[] = canStartChat
    ? [
        {
          key: 'chat',
          label: isChatPending ? '연결 중...' : '채팅하기',
          variant: 'outlined',
          showIcon: false,
          disabled: isChatPending,
          onClick: handleChatClick,
        },
      ]
    : [];

  const cardActions: RequestCardAction[] = [
    {
      key: 'send-quote',
      label: '견적 보내기',
      variant: 'solid',
      showIcon: true,
      onClick: handleSendQuote,
    },
    ...rejectActions,
    ...chatActions,
  ];

  return (
    <motion.article
      layout
      {...(shouldReduceMotion ? {} : cardHover)}
      className={cn(
        'relative flex w-full flex-col gap-5 rounded-2xl border border-line-100 bg-white px-3.5 py-4 shadow-request-card lg:gap-4 lg:px-6 lg:pt-5 lg:pb-3',
        request.isDesignated && 'border-red-100',
        className
      )}
    >
      {request.isDesignated ? (
        <motion.div
          aria-hidden
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={motionTransition}
          className="absolute top-0 left-0 h-full w-1 origin-top rounded-l-2xl bg-red-200"
        />
      ) : null}

      <motion.div
        variants={listStagger}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-5 lg:gap-4"
      >
        <motion.div
          variants={fadeUp}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2 lg:gap-3">
            {request.moveType ? (
              <MoveTypeChip type={request.moveType} size="sm" />
            ) : null}
            {request.isDesignated ? (
              <motion.div
                animate={
                  shouldReduceMotion ? undefined : { scale: [1, 1.04, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 2, repeat: 3, ease: 'easeInOut' }
                }
              >
                <MoveTypeChip type="designated" size="sm" />
              </motion.div>
            ) : null}
          </div>
          <p className="text-xs-regular whitespace-nowrap text-gray-500 lg:text-md-regular">
            {request.requestedAgo}
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex w-full flex-col gap-3.5 lg:gap-4.5 lg:rounded-md lg:px-4.5 lg:py-4 lg:shadow-request-card-body"
        >
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
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="flex w-full min-w-0 flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-4"
        >
          {cardActions.map((action) => (
            <RequestCardActionButton
              key={`sm-${action.key}`}
              size="sm"
              action={action}
            />
          ))}
          {cardActions.map((action) => (
            <RequestCardActionButton
              key={`md-${action.key}`}
              size="md"
              action={action}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.article>
  );
};
