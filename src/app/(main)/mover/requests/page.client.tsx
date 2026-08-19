'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useState } from 'react';

import { QuotesListErrorState } from '@/components/quotes/QuotesListErrorState';
import { QuotesLoadMoreSentinel } from '@/components/quotes/QuotesLoadMoreSentinel';
import { Modal } from '@/components/ui/Modal/Modal';
import { RejectRequestModal } from '@/components/ui/Modal/RejectRequestModal';
import { SendQuoteModal } from '@/components/ui/Modal/SendQuoteModal';
import { RequestsListSkeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import {
  getFadeInPresenceProps,
  getMotionTransition,
  listStagger,
} from '@/lib/motionVariants';

import { MOVER_REQUESTS_LAYOUT_CLASS } from './_components/moverRequestsStyles';
import { ReceivedRequestListItem } from './_components/ReceivedRequestListItem';
import { RequestsEmptyState } from './_components/RequestsEmptyState';
import { RequestsListToolbar } from './_components/RequestsListToolbar';
import { RequestsMobileFilterModal } from './_components/RequestsMobileFilterModal';
import { RequestsSidebarFilter } from './_components/RequestsSidebarFilter';
import { useRequestsCardExit } from './_lib/useRequestsCardExit';
import { useRequestsListUrlState } from './_lib/useRequestsListUrlState';
import { useRequestsReceivedList } from './_lib/useRequestsReceivedList';
import { useRequestsRejectModal } from './_lib/useRequestsRejectModal';
import { useRequestsSendQuoteModal } from './_lib/useRequestsSendQuoteModal';
import { useRequestsSortPrefetch } from './_lib/useRequestsSortPrefetch';

import type { RequestsListUrlState } from './_lib/requestsListSearchParams';
import type {
  ReceivedRequestCardModel,
  RequestsFilterState,
} from '@/types/estimateRequest';

export interface MoverRequestsPageClientProps {
  /** 서버 page searchParams에서 파싱한 초기 URL 상태 */
  initialUrlState: RequestsListUrlState;
  /** 알림 딥링크 `?focus=` — 해당 요청 카드까지 로드·스크롤 */
  focusRequestId?: number | null;
}

/** `/mover/requests` 클라이언트. - 검색·정렬·필터·목록·모달 오케스트레이션 */
const MoverRequestsPageClient = ({
  initialUrlState,
  focusRequestId = null,
}: MoverRequestsPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);

  const {
    listFilters,
    selectedMoveTypes,
    selectedScopes,
    commitSearchKeyword,
    handleMoveTypesChange,
    handleScopesChange,
    handleSortChange,
    handleFilterSubmit: applyFilterState,
    resetListFilters,
  } = useRequestsListUrlState(initialUrlState);

  const [queryKeyword, setQueryKeyword] = useState(initialUrlState.keyword);
  const [resetSignal, setResetSignal] = useState(0);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const { prefetchSort, prefetchAllSorts } = useRequestsSortPrefetch({
    listFilters,
    queryKeyword,
  });

  const { user } = useAuth();
  const { startEstimateChatFromSource, pendingChatTargetId } =
    useStartEstimateChat();

  const { exitingIds, handleExitComplete, markExiting } = useRequestsCardExit();
  const {
    sendQuoteTarget,
    sendQuoteErrorMessage,
    isProposalPending,
    handleOpenSendQuoteModal,
    handleCloseSendQuoteModal,
    handleSendQuoteSubmit,
  } = useRequestsSendQuoteModal(markExiting);
  const {
    rejectTarget,
    rejectErrorMessage,
    isRejectionPending,
    handleOpenRejectModal,
    handleCloseRejectModal,
    handleRejectSubmit,
  } = useRequestsRejectModal(markExiting);

  /** `/mover/requests` — 로그인 기사 id로 고객과 1:1 방 생성 후 채팅 이동 */
  const handleChatClick = (request: ReceivedRequestCardModel) => {
    startEstimateChatFromSource(
      {
        isDesignated: request.isDesignated,
        estimateRequestId: request.id,
        designatedMoverId: request.designatedMoverId,
      },
      user?.id,
      request.id
    );
  };

  const {
    requests,
    displayRequests,
    totalCount,
    moveTypeCounts,
    scopeCounts,
    isPending,
    isFetchingNextPage,
    isError,
    isEmpty,
    isFilteredEmpty,
    hasNextPage,
    loadMoreRef,
    listAnimationKey,
    errorMessage,
    showListFetching,
    handleRetry,
  } = useRequestsReceivedList({
    listFilters,
    queryKeyword,
    focusRequestId,
    exitingIds,
  });

  const handleQueryChange = useCallback((keyword: string) => {
    setQueryKeyword(keyword);
  }, []);

  /** 검색·이사유형·필터·정렬 전체 초기화 */
  const handleResetAll = () => {
    setResetSignal((signal) => signal + 1);
    setQueryKeyword('');
    resetListFilters();
  };

  /** 모바일 필터 적용 */
  const handleFilterSubmit = (next: RequestsFilterState) => {
    applyFilterState(next);
    setIsFilterModalOpen(false);
  };

  /** 필터 모달 닫기 */
  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  return (
    <>
      {/* 사이드 필터 + 목록 레이아웃 */}
      <div className={MOVER_REQUESTS_LAYOUT_CLASS}>
        {/* 데스크톱 사이드 필터 */}
        <RequestsSidebarFilter
          className="hidden w-full max-w-[20.5rem] shrink-0 xl:flex"
          selectedMoveTypes={selectedMoveTypes}
          selectedScopes={selectedScopes}
          moveTypeCounts={moveTypeCounts}
          scopeCounts={scopeCounts}
          onMoveTypesChange={handleMoveTypesChange}
          onScopesChange={handleScopesChange}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-6 lg:gap-8">
          {/* 검색·건수·정렬 툴바 */}
          <RequestsListToolbar
            listFilters={listFilters}
            onCommitKeyword={commitSearchKeyword}
            onQueryChange={handleQueryChange}
            onResetAll={handleResetAll}
            resetSignal={resetSignal}
            totalCount={totalCount}
            showListFetching={showListFetching}
            onSortChange={handleSortChange}
            onSortOpen={prefetchAllSorts}
            onSortOptionPrefetch={prefetchSort}
            onFilterOpen={() => setIsFilterModalOpen(true)}
          />
          {/* 로딩·에러·빈목록·목록 */}
          {isPending && requests.length === 0 ? (
            <RequestsListSkeleton />
          ) : isError && requests.length === 0 ? (
            <QuotesListErrorState
              message={errorMessage}
              onRetry={handleRetry}
              withMotion={false}
            />
          ) : isEmpty ? (
            <RequestsEmptyState
              variant={isFilteredEmpty ? 'filtered' : 'initial'}
              onReset={isFilteredEmpty ? handleResetAll : undefined}
            />
          ) : (
            <div className="relative">
              <AnimatePresence>
                {showListFetching ? (
                  <motion.div
                    {...getFadeInPresenceProps(motionTransition)}
                    className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/40"
                    aria-hidden
                  />
                ) : null}
              </AnimatePresence>

              <motion.ul
                key={listAnimationKey}
                variants={listStagger}
                initial="hidden"
                animate="show"
                className="flex w-full flex-col gap-6 lg:gap-12"
              >
                <AnimatePresence mode="popLayout">
                  {displayRequests.map((request) => (
                    <ReceivedRequestListItem
                      key={request.id}
                      request={request}
                      shouldAnimate
                      onSendQuote={handleOpenSendQuoteModal}
                      onReject={handleOpenRejectModal}
                      onChatClick={handleChatClick}
                      isChatPending={pendingChatTargetId === request.id}
                      onExitComplete={handleExitComplete}
                    />
                  ))}
                </AnimatePresence>
              </motion.ul>

              {hasNextPage || isFetchingNextPage ? (
                <QuotesLoadMoreSentinel
                  loadMoreRef={loadMoreRef}
                  isFetchingNextPage={isFetchingNextPage}
                  className="py-6"
                />
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* 모바일 필터 모달 */}
      <Modal
        isOpen={isFilterModalOpen}
        placement="bottom"
        onClose={handleCloseFilterModal}
      >
        <RequestsMobileFilterModal
          onClose={handleCloseFilterModal}
          onSubmit={handleFilterSubmit}
          defaultMoveTypes={selectedMoveTypes}
          defaultScopes={selectedScopes}
          moveTypeCounts={moveTypeCounts}
          scopeCounts={scopeCounts}
        />
      </Modal>

      {/* 견적 보내기 모달 */}
      <Modal
        isOpen={Boolean(sendQuoteTarget)}
        placement="bottom"
        onClose={handleCloseSendQuoteModal}
      >
        {sendQuoteTarget ? (
          <SendQuoteModal
            onClose={handleCloseSendQuoteModal}
            onSubmit={handleSendQuoteSubmit}
            moveType={sendQuoteTarget.moveType ?? undefined}
            isDesignated={sendQuoteTarget.isDesignated}
            customerName={sendQuoteTarget.customerName}
            moveDate={sendQuoteTarget.moveDate}
            departure={sendQuoteTarget.departure}
            arrival={sendQuoteTarget.arrival}
            isSubmitting={isProposalPending}
            errorMessage={sendQuoteErrorMessage ?? undefined}
          />
        ) : null}
      </Modal>

      {/* 반려 모달 */}
      <Modal
        isOpen={Boolean(rejectTarget)}
        placement="bottom"
        onClose={handleCloseRejectModal}
      >
        {rejectTarget ? (
          <RejectRequestModal
            onClose={handleCloseRejectModal}
            onSubmit={handleRejectSubmit}
            moveType={rejectTarget.moveType ?? undefined}
            isDesignated={rejectTarget.isDesignated}
            customerName={rejectTarget.customerName}
            moveDate={rejectTarget.moveDate}
            departure={rejectTarget.departure}
            arrival={rejectTarget.arrival}
            isSubmitting={isRejectionPending}
            errorMessage={rejectErrorMessage ?? undefined}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default MoverRequestsPageClient;
