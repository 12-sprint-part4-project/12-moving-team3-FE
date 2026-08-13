'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Button } from '@/components/Button/Button';
import { QuoteDetailContentSkeleton } from '@/components/ui/Skeleton';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useCustomerQuoteDetail } from '@/hooks/useCustomerQuoteDetail';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { ApiError } from '@/lib/apiClient';
import { fadeIn, getMotionTransition } from '@/lib/motionVariants';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { toStartEstimateChatParams } from '@/lib/startEstimateChat';
import { cn } from '@/lib/utils';

import { ConfirmQuoteModal } from '../_components/ConfirmQuoteModal';
import { CUSTOMER_QUOTE_DETAIL_MOBILE_ACTION_PAD } from '../_components/customerQuotesLayout';
import { CustomerQuoteDetailActions } from './_components/CustomerQuoteDetailActions';
import { CustomerQuoteDetailContent } from './_components/CustomerQuoteDetailContent';
import { CUSTOMER_QUOTE_DETAIL_STATE_CLASS } from './_components/customerQuoteDetailStyles';

export interface CustomerQuoteDetailPageClientProps {
  quoteId: string;
}

/** 고객 견적 상세 페이지 클라이언트 */
const CustomerQuoteDetailPageClient = ({
  quoteId,
}: CustomerQuoteDetailPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const router = useRouter();
  const numericQuoteId = parsePositiveInt(quoteId);
  const { handleFavoriteClick, isMoverPending } = useFavoriteAction();

  const { detail, isPending, isError, error, refetch } = useCustomerQuoteDetail(
    numericQuoteId ?? 0
  );

  /** 견적 확정 후 이용 내역으로 이동 */
  const goToHistory = useCallback(() => {
    router.replace('/quotes/history');
  }, [router]);

  const {
    isConfirmModalOpen,
    isConfirming,
    openConfirmModal,
    closeConfirmModal,
    submitConfirm,
  } = useConfirmQuoteModal(goToHistory);

  /** `/quotes/[quoteId]` 보조 CTA — 확정 기사 상세에서 채팅 시작 */
  const { startEstimateChat, isChatPending } = useStartEstimateChat();

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '견적 상세를 불러오지 못했습니다.';

  const handleRetry = () => {
    void refetch();
  };

  if (numericQuoteId == null) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className={CUSTOMER_QUOTE_DETAIL_STATE_CLASS}
      >
        <p role="alert" className="text-lg-medium text-red-200">
          유효하지 않은 견적입니다.
        </p>
        <Link
          href="/quotes"
          className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
        >
          내 견적 관리로 돌아가기
        </Link>
      </motion.div>
    );
  }

  if (isPending) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
      >
        <QuoteDetailContentSkeleton />
      </motion.div>
    );
  }

  if (isError || !detail) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="show"
        transition={motionTransition}
        className={CUSTOMER_QUOTE_DETAIL_STATE_CLASS}
      >
        <p role="alert" className="text-center text-lg-medium text-red-200">
          {errorMessage}
        </p>
        <Button
          size="sm"
          variant="outlined"
          className="max-w-[10rem]"
          onClick={handleRetry}
        >
          다시 시도
        </Button>
        <Link
          href="/quotes"
          className="text-lg-semibold text-blue-300 underline-offset-2 hover:underline"
        >
          내 견적 관리로 돌아가기
        </Link>
      </motion.div>
    );
  }

  const handleChatClick = () => {
    startEstimateChat(toStartEstimateChatParams(detail, detail.mover.moverId));
  };

  const handleConfirmClick = () => {
    openConfirmModal(detail.quoteId);
  };

  const handleToggleFavorite = () => {
    handleFavoriteClick(detail.mover.moverId, !detail.mover.isFavorited);
  };

  const showMobileActionBar = detail.canConfirm || detail.canStartChat;

  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col',
        showMobileActionBar && CUSTOMER_QUOTE_DETAIL_MOBILE_ACTION_PAD
      )}
    >
      <CustomerQuoteDetailContent
        quoteId={quoteId}
        detail={detail}
        actions={{
          isConfirming,
          isChatPending,
          isFavoritePending: isMoverPending(detail.mover.moverId),
          onFavoriteClick: handleFavoriteClick,
          onConfirm: handleConfirmClick,
          onChatClick: handleChatClick,
          onToggleFavorite: handleToggleFavorite,
        }}
      />

      <CustomerQuoteDetailActions
        variant="mobile"
        canConfirm={detail.canConfirm}
        canStartChat={detail.canStartChat}
        isConfirming={isConfirming}
        isChatPending={isChatPending}
        isFavorited={detail.mover.isFavorited}
        isFavoritePending={isMoverPending(detail.mover.moverId)}
        onConfirm={handleConfirmClick}
        onChatClick={handleChatClick}
        onToggleFavorite={handleToggleFavorite}
      />

      <ConfirmQuoteModal
        open={isConfirmModalOpen}
        isConfirming={isConfirming}
        onClose={closeConfirmModal}
        onConfirm={submitConfirm}
      />
    </div>
  );
};

export default CustomerQuoteDetailPageClient;
