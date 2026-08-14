'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { QuoteDetailErrorState } from '@/components/quotes/QuoteDetailErrorState';
import { QuoteDetailContentSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useMoverQuoteDetail } from '@/hooks/useMoverQuoteDetail';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { getFadeInMotionProps, getMotionTransition } from '@/lib/motionVariants';
import { parsePositiveInt } from '@/lib/parsePositiveInt';
import { cn } from '@/lib/utils';

import { MoverQuoteDetailActions } from './_components/MoverQuoteDetailActions';
import { MoverQuoteDetailContent } from './_components/MoverQuoteDetailContent';

export interface MoverQuoteDetailPageClientProps {
  quoteId: string;
}

/** `/mover/quotes/[quoteId]` 클라이언트. - 견적 상세 페이지 */
const MoverQuoteDetailPageClient = ({
  quoteId,
}: MoverQuoteDetailPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();

  const numericQuoteId = parsePositiveInt(quoteId);
  const { user } = useAuth();
  const { detail, isPending, isError, error, refetch } =
    useMoverQuoteDetail(numericQuoteId ?? 0);
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
        backHref="/mover/quotes"
      />
    );
  }

  // 로딩 — 상세 스켈레톤
  if (isPending) {
    return (
      <motion.div {...getFadeInMotionProps(motionTransition)}>
        <QuoteDetailContentSkeleton aside="share" />
      </motion.div>
    );
  }

  // 에러 — 재시도 + 목록 복귀
  if (isError || !detail) {
    return (
      <QuoteDetailErrorState
        message={errorMessage}
        backHref="/mover/quotes"
        onRetry={handleRetry}
      />
    );
  }

  /** 보낸 견적 상세 → 해당 고객과 방 열고 `/chat/{roomId}` */
  const handleChatClick = () => {
    startEstimateChatFromSource(
      {
        isDesignated: detail.isDesignated,
        estimateRequestId: detail.estimateRequestId,
        designatedMoverId: detail.designatedMoverId,
        quoteId: detail.id,
      },
      user?.id
    );
  };

  /** 채팅 CTA가 있으면 모바일 하단 고정바 + 본문 패딩 */
  const showMobileActionBar = detail.canStartChat;

  // 본문 + 모바일 하단 CTA
  return (
    <div
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col',
        showMobileActionBar && 'pb-[4.625rem] lg:pb-0'
      )}
    >
      {/* 상세 본문(요약·견적가·공유·정보·데스크톱 CTA) */}
      <MoverQuoteDetailContent
        detail={detail}
        actions={{
          isChatPending,
          onChatClick: handleChatClick,
        }}
      />

      {/* 모바일 하단 고정 액션바 */}
      <MoverQuoteDetailActions
        variant="mobile"
        canStartChat={detail.canStartChat}
        isChatPending={isChatPending}
        onChatClick={handleChatClick}
      />
    </div>
  );
};

export default MoverQuoteDetailPageClient;
