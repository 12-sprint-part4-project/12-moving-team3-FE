'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { QuoteDetailErrorState } from '@/components/quotes/QuoteDetailErrorState';
import { QuoteDetailContentSkeleton } from '@/components/ui/Skeleton';
import { useConfirmQuoteModal } from '@/hooks/useConfirmQuoteModal';
import { useCustomerQuoteDetail } from '@/hooks/useCustomerQuoteDetail';
import { useFavoriteAction } from '@/hooks/useFavoriteAction';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { getFadeInMotionProps, getMotionTransition } from '@/lib/motionVariants';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { cn } from '@/lib/utils';

import { ConfirmQuoteModal } from '../_components/ConfirmQuoteModal';
import { CustomerQuoteDetailActions } from './_components/CustomerQuoteDetailActions';
import { CustomerQuoteDetailContent } from './_components/CustomerQuoteDetailContent';

export interface CustomerQuoteDetailPageClientProps {
  quoteId: string;
}

/** `/quotes/[quoteId]` 클라이언트. - 상세 견적 페이지 */
const CustomerQuoteDetailPageClient = ({
  quoteId,
}: CustomerQuoteDetailPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const numericQuoteId = parsePositiveInt(quoteId);
  const { handleFavoriteClick, isMoverPending } = useFavoriteAction();
  const { detail, isPending, isError, error, refetch } = useCustomerQuoteDetail(
    numericQuoteId ?? 0
  );
  /** 견적 확정 성공 후 이용 내역으로 이동 */
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
  const { startEstimateChatFromSource, isChatPending } = useStartEstimateChat();

  const motionTransition = getMotionTransition(shouldReduceMotion);
  const errorMessage = resolveApiErrorMessage(
    error,
    '견적 상세를 불러오지 못했습니다.'
  );

  const handleRetry = () => {
    void refetch();
  };

  // 잘못된 quoteId — 안내 + 목록 복귀 링크
  if (numericQuoteId == null) {
    return (
      <QuoteDetailErrorState
        message="유효하지 않은 견적입니다."
        backHref="/quotes"
      />
    );
  }

  // 로딩 — 상세 스켈레톤
  if (isPending) {
    return (
      <motion.div {...getFadeInMotionProps(motionTransition)}>
        <QuoteDetailContentSkeleton />
      </motion.div>
    );
  }

  // 에러 — 재시도 + 목록 복귀
  if (isError || !detail) {
    return (
      <QuoteDetailErrorState
        message={errorMessage}
        backHref="/quotes"
        onRetry={handleRetry}
      />
    );
  }

  /** 상세 채팅하기 — 방 생성 후 `/chat/{roomId}` 이동 */
  const handleChatClick = () => {
    startEstimateChatFromSource(detail, detail.mover.moverId);
  };

  /** 확정 CTA → 재확인 모달 오픈 */
  const handleConfirmClick = () => {
    openConfirmModal(detail.quoteId);
  };

  /** 상세 프로필 찜 토글 */
  const handleToggleFavorite = () => {
    handleFavoriteClick(detail.mover.moverId, !detail.mover.isFavorited);
  };

  /** 확정·채팅 중 하나라도 있으면 모바일 하단 고정바 + 본문 패딩 */
  const showMobileActionBar = detail.canConfirm || detail.canStartChat;

  // 본문 + 모바일 하단 CTA + 확정 모달
  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col',
        showMobileActionBar && 'pb-[4.625rem] lg:pb-0'
      )}
    >
      {/* 상세 본문(요약·견적가·공유·정보·데스크톱 CTA) */}
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

      {/* 모바일 하단 고정 액션바 */}
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

      {/* 견적 확정 재확인 모달 */}
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
