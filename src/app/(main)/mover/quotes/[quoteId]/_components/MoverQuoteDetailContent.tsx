'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { QuoteInfoSection } from '@/components/quotes/QuoteInfoRows';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { useTranslation } from '@/i18n/useTranslation';
import {
  fadeUp,
  getFadeUpMotionProps,
  getListStagger,
  getMotionTransition,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';

import { MoverQuoteDetailActions } from './MoverQuoteDetailActions';
import { QuoteDetailSummaryCard } from './QuoteDetailSummaryCard';
import {
  MOVER_QUOTE_DETAIL_DIVIDER_CLASS,
  MOVER_QUOTE_DETAIL_SECTION_CLASS,
  MOVER_QUOTE_DETAIL_SECTION_TITLE_CLASS,
  MOVER_QUOTES_PAGE_X_PADDING,
} from '../../_components/moverQuotesStyles';

import type { QuoteDetailViewModel } from '@/types/quote';

/** 상세 본문에 넘기는 채팅 액션 묶음 */
interface MoverQuoteDetailContentActions {
  isChatPending: boolean;
  onChatClick: () => void;
}

interface MoverQuoteDetailContentProps {
  detail: QuoteDetailViewModel;
  actions: MoverQuoteDetailContentActions;
  className?: string;
}

/** `/mover/quotes/[quoteId]` 상세 본문. - 요약·견적가·반려사유·공유·정보·데스크톱 CTA. */
export const MoverQuoteDetailContent = ({
  detail,
  actions,
  className = '',
}: MoverQuoteDetailContentProps) => {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const listStaggerVariants = getListStagger(shouldReduceMotion);
  const fadeUpMotion = getFadeUpMotionProps(motionTransition);

  const showRejectReason = Boolean(detail.rejectReason?.trim());
  const showComment = Boolean(detail.comment?.trim());
  const showDesktopActionDivider = detail.canStartChat;

  /** QuoteShareButtons용 공유 메타 */
  const quoteShareProps = {
    sharePath: `/mover/quotes/${detail.id}`,
    shareTitle: t('quotes.shareCustomerTitle', { name: detail.customerName }),
    shareDescription:
      detail.comment?.trim() || `${detail.serviceLabel} · ${detail.priceLabel}`,
  };

  // 좌측 본문 + 우측 데스크톱 aside(CTA·공유)
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:items-start lg:justify-between lg:gap-10 lg:py-10',
        !detail.isRejected && 'lg:grid-cols-[minmax(0,59.6875rem)_auto]',
        MOVER_QUOTES_PAGE_X_PADDING,
        className
      )}
    >
      {/* 메인 컬럼 — 요약·견적가/반려·공유(모바일)·견적 정보 */}
      <motion.div
        variants={listStaggerVariants}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10"
      >
        <motion.div {...fadeUpMotion}>
          <QuoteDetailSummaryCard detail={detail} />
        </motion.div>

        <motion.div
          {...fadeUpMotion}
          className={MOVER_QUOTE_DETAIL_DIVIDER_CLASS}
        />

        {/* 보낸 견적: 견적가 + 코멘트 / 반려: 반려 사유 */}
        {detail.isRejected ? (
          showRejectReason ? (
            <motion.section
              {...fadeUpMotion}
              className={MOVER_QUOTE_DETAIL_SECTION_CLASS}
            >
              <h2 className={MOVER_QUOTE_DETAIL_SECTION_TITLE_CLASS}>
                {t('quotes.rejectReason')}
              </h2>
              <p className="text-lg-regular whitespace-pre-wrap text-black-400 lg:text-2lg-regular">
                {detail.rejectReason}
              </p>
            </motion.section>
          ) : null
        ) : (
          <>
            <motion.section
              {...fadeUpMotion}
              className={MOVER_QUOTE_DETAIL_SECTION_CLASS}
            >
              <h2 className={MOVER_QUOTE_DETAIL_SECTION_TITLE_CLASS}>
                {t('quotes.priceAmount')}
              </h2>
              <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
                {detail.priceLabel}
              </p>
            </motion.section>

            {showComment ? (
              <>
                <motion.div
                  {...fadeUpMotion}
                  className={MOVER_QUOTE_DETAIL_DIVIDER_CLASS}
                />
                <motion.section
                  {...fadeUpMotion}
                  className={MOVER_QUOTE_DETAIL_SECTION_CLASS}
                >
                  <h2 className={MOVER_QUOTE_DETAIL_SECTION_TITLE_CLASS}>
                    {t('quotes.comment')}
                  </h2>
                  <p className="text-lg-regular whitespace-pre-wrap text-black-400 lg:text-2lg-regular">
                    {detail.comment}
                  </p>
                </motion.section>
              </>
            ) : null}
          </>
        )}

        {/* 공유 — 모바일만 (반려 제외) */}
        {!detail.isRejected ? (
          <motion.div
            {...fadeUpMotion}
            className="flex flex-col gap-6 lg:hidden"
          >
            <div className={MOVER_QUOTE_DETAIL_DIVIDER_CLASS} />
            <QuoteShareButtons {...quoteShareProps} />
          </motion.div>
        ) : null}

        <motion.div
          {...fadeUpMotion}
          className={MOVER_QUOTE_DETAIL_DIVIDER_CLASS}
        />

        <motion.div {...fadeUpMotion}>
          <QuoteInfoSection info={detail} variant="moverDetail" />
        </motion.div>
      </motion.div>

      {/* 사이드바(lg+) — 채팅 CTA + 공유 (반려 제외) */}
      {!detail.isRejected ? (
        <motion.aside
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          transition={motionTransition}
          className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex"
        >
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={motionTransition}
          >
            <MoverQuoteDetailActions
              variant="desktop"
              canStartChat={detail.canStartChat}
              isChatPending={actions.isChatPending}
              onChatClick={actions.onChatClick}
            />
          </motion.div>
          {showDesktopActionDivider ? (
            <div className={MOVER_QUOTE_DETAIL_DIVIDER_CLASS} />
          ) : null}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{
              ...motionTransition,
              delay: shouldReduceMotion ? 0 : 0.08,
            }}
          >
            <QuoteShareButtons {...quoteShareProps} />
          </motion.div>
        </motion.aside>
      ) : null}
    </div>
  );
};
