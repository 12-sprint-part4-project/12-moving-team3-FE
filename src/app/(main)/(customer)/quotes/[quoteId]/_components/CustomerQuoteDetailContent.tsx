'use client';

import { motion, useReducedMotion } from 'framer-motion';

import InfoIcon from '@/assets/icons/info.svg';
import { QuoteInfoSection } from '@/components/quotes/QuoteInfoRows';
import { QuoteShareButtons } from '@/components/QuoteShareButtons/QuoteShareButtons';
import { Toast } from '@/components/ui/Toast/Toast';
import {
  fadeUp,
  getListStagger,
  getMotionTransition,
} from '@/lib/motionVariants';
import { cn } from '@/lib/utils';
import { toMoverCardModelFromCustomerQuoteMover } from '@/services/customerQuoteApi';
import type { CustomerQuoteDetailViewModel } from '@/types/customerQuote';

import { CUSTOMER_QUOTE_DETAIL_PAGE_X_PADDING } from '../../_components/customerQuotesLayout';
import { CustomerQuoteDetailActions } from './CustomerQuoteDetailActions';
import { CustomerQuoteDetailSummaryCard } from './CustomerQuoteDetailSummaryCard';
import { CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS } from './customerQuoteDetailStyles';

const SECTION_CLASS = 'flex w-full flex-col gap-4 lg:gap-8';
const SECTION_TITLE_CLASS =
  'text-lg-semibold text-black-400 lg:text-2xl-semibold';

/** 상세 본문에 넘기는 확정·채팅·찜 액션 묶음 */
interface CustomerQuoteDetailContentActions {
  isConfirming: boolean;
  isChatPending: boolean;
  isFavoritePending: boolean;
  onFavoriteClick: (moverId: string, nextFavorited: boolean) => void;
  onConfirm: () => void;
  onChatClick: () => void;
  onToggleFavorite: () => void;
}

interface CustomerQuoteDetailContentProps {
  quoteId: string;
  detail: CustomerQuoteDetailViewModel;
  actions: CustomerQuoteDetailContentActions;
  className?: string;
}

/** `/quotes/[quoteId]` 상세 본문. - 요약·견적가·코멘트·공유·정보·데스크톱 CTA. */
export const CustomerQuoteDetailContent = ({
  quoteId,
  detail,
  actions,
  className = '',
}: CustomerQuoteDetailContentProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const listStaggerVariants = getListStagger(shouldReduceMotion);
  const showComment = Boolean(detail.comment);
  const showUnconfirmedBanner = detail.showUnconfirmedBanner;
  /** 사이드바에 CTA가 있을 때만 공유 위 구분선 */
  const showDesktopActionDivider = detail.canConfirm || detail.canStartChat;
  /** QuoteShareButtons용 공유 메타 */
  const quoteShareProps = {
    sharePath: `/quotes/${quoteId}`,
    shareTitle: `${detail.mover.name} 기사님 견적서`,
    shareDescription:
      detail.comment?.trim() ||
      detail.mover.shortDescription ||
      `${detail.serviceLabel} · ${detail.priceLabel}`,
    shareImageUrl: detail.mover.profileImageUrl,
  };
  /** 요약 카드 MoverProfileBlock용 */
  const moverCard = toMoverCardModelFromCustomerQuoteMover(detail.mover);

  // 좌측 본문 + 우측 데스크톱 aside(CTA·공유)
  return (
    <div
      className={cn(
        'mx-auto grid w-full max-w-[1920px] flex-1 grid-cols-1 gap-6 py-6 md:gap-8 md:py-8 lg:grid-cols-[minmax(0,59.6875rem)_20.5rem] lg:items-start lg:justify-between lg:gap-10 lg:py-10',
        CUSTOMER_QUOTE_DETAIL_PAGE_X_PADDING,
        className
      )}
    >
      {/* 메인 컬럼 — 요약·견적가·코멘트·공유(모바일)·견적 정보·미확정 배너 */}
      <motion.div
        variants={listStaggerVariants}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className="col-start-1 flex w-full max-w-[59.6875rem] flex-col gap-6 md:gap-8 lg:gap-10"
      >
        <motion.div variants={fadeUp} transition={motionTransition}>
          <CustomerQuoteDetailSummaryCard
            detail={detail}
            mover={moverCard}
            onFavoriteClick={actions.onFavoriteClick}
            isFavoritePending={actions.isFavoritePending}
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={motionTransition}
          className={CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS}
        />

        {/* 견적가 */}
        <motion.section
          variants={fadeUp}
          transition={motionTransition}
          className={SECTION_CLASS}
        >
          <h2 className={SECTION_TITLE_CLASS}>견적가</h2>
          <p className="text-2lg-bold text-black-400 lg:text-3xl-bold">
            {detail.priceLabel}
          </p>
        </motion.section>

        {showComment ? (
          <>
            <motion.div
              variants={fadeUp}
              transition={motionTransition}
              className={CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS}
            />
            {/* 코멘트 */}
            <motion.section
              variants={fadeUp}
              transition={motionTransition}
              className={SECTION_CLASS}
            >
              <h2 className={SECTION_TITLE_CLASS}>코멘트</h2>
              <p className="text-lg-regular whitespace-pre-wrap text-black-400 lg:text-2lg-regular">
                {detail.comment}
              </p>
            </motion.section>
          </>
        ) : null}

        {/* 공유 — 모바일만 */}
        <motion.div
          variants={fadeUp}
          transition={motionTransition}
          className="flex flex-col gap-6 lg:hidden"
        >
          <div className={CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS} />
          <QuoteShareButtons {...quoteShareProps} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={motionTransition}
          className={CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS}
        />

        {/* 견적 정보 */}
        <motion.div variants={fadeUp} transition={motionTransition}>
          <QuoteInfoSection info={detail} variant="customerDetail" />
        </motion.div>

        {showUnconfirmedBanner ? (
          <motion.div variants={fadeUp} transition={motionTransition}>
            <Toast
              icon={InfoIcon}
              content="확정하지 않은 견적이에요!"
              className="w-full justify-center"
            />
          </motion.div>
        ) : null}
      </motion.div>

      {/* 사이드바(lg+) — 확정·채팅 CTA + 공유 */}
      <motion.aside
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 12 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={motionTransition}
        className="col-start-1 hidden w-full flex-col gap-10 lg:col-start-2 lg:row-span-1 lg:row-start-1 lg:flex lg:w-[20.5rem]"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={motionTransition}
        >
          <CustomerQuoteDetailActions
            variant="desktop"
            canConfirm={detail.canConfirm}
            canStartChat={detail.canStartChat}
            isConfirming={actions.isConfirming}
            isChatPending={actions.isChatPending}
            isFavorited={detail.mover.isFavorited}
            isFavoritePending={actions.isFavoritePending}
            onConfirm={actions.onConfirm}
            onChatClick={actions.onChatClick}
            onToggleFavorite={actions.onToggleFavorite}
          />
        </motion.div>
        {showDesktopActionDivider ? (
          <div className={CUSTOMER_QUOTE_DETAIL_DIVIDER_CLASS} />
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
    </div>
  );
};
