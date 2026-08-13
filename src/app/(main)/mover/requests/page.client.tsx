'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/ui/Modal/Modal';
import { RejectRequestModal } from '@/components/ui/Modal/RejectRequestModal';
import { SendQuoteModal } from '@/components/ui/Modal/SendQuoteModal';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useAuth } from '@/hooks/useAuth';
import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';
import { useReceivedEstimateRequests } from '@/hooks/useReceivedEstimateRequests';
import { useStartEstimateChat } from '@/hooks/useStartEstimateChat';
import { ApiError } from '@/lib/apiClient';
import {
  fadeIn,
  getMotionTransition,
  listItemVariants,
  listStagger,
} from '@/lib/motionVariants';
import {
  ALL_MOVE_TYPES,
  ALL_SCOPES,
  type ReceivedRequestCardModel,
  type RequestsFilterState,
} from '@/types/estimateRequest';

import { ReceivedRequestCard } from './_components/ReceivedRequestCard';
import { RequestsEmptyState } from './_components/RequestsEmptyState';
import { RequestsListToolbar } from './_components/RequestsListToolbar';
import { RequestsMobileFilterModal } from './_components/RequestsMobileFilterModal';
import { RequestsListSkeleton } from './_components/RequestsPageSkeleton';
import { RequestsSidebarFilter } from './_components/RequestsSidebarFilter';
import {
  isDefaultRequestsListUrlState,
  type RequestsListUrlState,
} from './_lib/requestsListSearchParams';
import { useFocusRequestInList } from './_lib/useFocusRequestInList';
import { useRequestsListUrlState } from './_lib/useRequestsListUrlState';

/** 데스크톱 필터 변경 API 조회 디바운스 지연(ms) */
const FILTER_DEBOUNCE_MS = 200;

export interface MoverRequestsPageClientProps {
  /** 서버 page searchParams에서 파싱한 초기 URL 상태 */
  initialUrlState: RequestsListUrlState;
  /** 알림 딥링크 `?focus=` — 해당 요청 카드까지 로드·스크롤 */
  focusRequestId?: number | null;
}

/** 받은 요청 페이지 클라이언트 — 검색·정렬·필터·목록 조회 */
const MoverRequestsPageClient = ({
  initialUrlState,
  focusRequestId = null,
}: MoverRequestsPageClientProps) => {
  const shouldReduceMotion = useReducedMotion();
  const motionTransition = getMotionTransition(shouldReduceMotion);
  const { user } = useAuth();
  const { startEstimateChat, isChatPending } = useStartEstimateChat();
  const [pendingChatRequestId, setPendingChatRequestId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!isChatPending) {
      setPendingChatRequestId(null);
    }
  }, [isChatPending]);

  const {
    listFilters,
    selectedMoveTypes,
    selectedScopes,
    sortValue,
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
  const [sendQuoteTarget, setSendQuoteTarget] =
    useState<ReceivedRequestCardModel | null>(null);
  const [rejectTarget, setRejectTarget] =
    useState<ReceivedRequestCardModel | null>(null);
  const [exitingIds, setExitingIds] = useState<Set<number>>(() => new Set());

  const handleQueryChange = useCallback((keyword: string) => {
    setQueryKeyword(keyword);
  }, []);

  const debouncedMoveTypes = useDebouncedValue(
    selectedMoveTypes,
    FILTER_DEBOUNCE_MS
  );
  const debouncedScopes = useDebouncedValue(selectedScopes, FILTER_DEBOUNCE_MS);

  /** 정렬·필터 변경 시에만 목록 entrance 애니메이션 (검색어 제외) */
  const listAnimationKey = useMemo(
    () =>
      [sortValue, debouncedMoveTypes.join(','), debouncedScopes.join(',')].join(
        '|'
      ),
    [sortValue, debouncedMoveTypes, debouncedScopes]
  );

  const handleExitComplete = (id: number) => {
    setExitingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleProposalSuccess = () => {
    setSendQuoteTarget((target) => {
      if (target) {
        setExitingIds((prev) => new Set(prev).add(target.id));
      }
      return null;
    });
  };

  const handleRejectionSuccess = () => {
    setRejectTarget((target) => {
      if (target) {
        setExitingIds((prev) => new Set(prev).add(target.id));
      }
      return null;
    });
  };

  const {
    submitErrorMessage,
    clearSubmitError,
    proposalMutation,
    rejectionMutation,
  } = useQuoteSubmission({
    onProposalSuccess: handleProposalSuccess,
    onRejectionSuccess: handleRejectionSuccess,
  });

  /** 받은 요청 목록·필터 건수 조회 */
  const {
    requests,
    totalCount,
    moveTypeCounts,
    scopeCounts,
    isPending,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
    isEmpty,
  } = useReceivedEstimateRequests({
    keyword: queryKeyword,
    moveTypes: debouncedMoveTypes,
    scopes: debouncedScopes,
    sort: sortValue,
  });

  const displayRequests = useMemo(
    () => requests.filter((request) => !exitingIds.has(request.id)),
    [exitingIds, requests]
  );

  const { ref: loadMoreRef, inView } = useInView({
    rootMargin: '200px 0px',
  });

  /** 하단 진입 시 다음 페이지 요청 */
  useEffect(() => {
    if (!inView || !hasNextPage || isFetchingNextPage) {
      return;
    }
    void fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 알림 `?focus=` — 대상 카드가 보일 때까지 페이지 로드 후 스크롤
  useFocusRequestInList({
    focusRequestId,
    requests,
    isPending,
    isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    fetchNextPage,
    listFilters: {
      ...listFilters,
      keyword: queryKeyword,
    },
  });

  /** 필터 버튼 활성 여부 판별 */
  const isFilterActive =
    selectedMoveTypes.length !== ALL_MOVE_TYPES.length ||
    selectedScopes.length !== ALL_SCOPES.length;

  const isFilteredEmpty =
    isEmpty &&
    (!isDefaultRequestsListUrlState({
      ...listFilters,
      keyword: queryKeyword,
      moveTypes: debouncedMoveTypes,
      scopes: debouncedScopes,
    }) ||
      debouncedMoveTypes.length === 0);

  const showListFetching = isFetching && !isPending && !isFetchingNextPage;
  /**
   * 목록 entrance/stagger 애니메이션은 "펜딩 중(=기존 data 유지 + isFetching=true)"에는
   * 실행하지 않는다. 타이핑/필터 변경 시 목록이 계속 흔들리는 현상을 막기 위함이다.
   */
  const shouldAnimateList = !showListFetching;

  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '받은 요청 목록을 불러오지 못했습니다.';

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

  /** 견적 보내기 모달 열기 */
  const handleOpenSendQuoteModal = (request: ReceivedRequestCardModel) => {
    clearSubmitError();
    setSendQuoteTarget(request);
  };

  /** 반려 모달 열기 — 지정 견적 요청만 허용 */
  const handleOpenRejectModal = (request: ReceivedRequestCardModel) => {
    if (!request.isDesignated) {
      return;
    }
    clearSubmitError();
    setRejectTarget(request);
  };

  /** `/mover/requests` — 로그인 기사 id로 고객과 1:1 방 생성 후 채팅 이동 */
  const handleChatClick = (request: ReceivedRequestCardModel) => {
    if (!user?.id) {
      return;
    }

    setPendingChatRequestId(request.id);
    startEstimateChat({
      moverId: user.id,
      isDesignated: request.isDesignated,
      estimateRequestId: request.id,
      designatedMoverId: request.designatedMoverId,
    });
  };

  /** 견적 보내기 모달 닫기 */
  const handleCloseSendQuoteModal = () => {
    if (proposalMutation.isPending) {
      return;
    }
    clearSubmitError();
    setSendQuoteTarget(null);
  };

  /** 반려 모달 닫기 */
  const handleCloseRejectModal = () => {
    if (rejectionMutation.isPending) {
      return;
    }
    clearSubmitError();
    setRejectTarget(null);
  };

  /** 견적 보내기 API 요청 */
  const handleSendQuoteSubmit = (quote: { price: string; comment: string }) => {
    if (!sendQuoteTarget || proposalMutation.isPending) {
      return;
    }

    clearSubmitError();
    proposalMutation.mutate({
      estimateRequestId: sendQuoteTarget.id,
      price: Number(quote.price),
      comment: quote.comment,
    });
  };

  /** 반려 API 요청 */
  const handleRejectSubmit = (payload: { reason: string }) => {
    if (!rejectTarget || rejectionMutation.isPending) {
      return;
    }

    clearSubmitError();
    rejectionMutation.mutate({
      estimateRequestId: rejectTarget.id,
      rejectReason: payload.reason,
    });
  };

  /** 목록 재조회 */
  const handleRetry = () => {
    void refetch();
  };

  return (
    <>
      {/* 사이드 필터 + 목록 레이아웃 */}
      <div className="mx-auto flex w-full max-w-[1920px] flex-col gap-6 px-6 py-6 md:px-[4.5rem] md:py-8 lg:px-10 xl:flex-row xl:items-start xl:gap-8 xl:px-16 min-[90rem]:gap-12 min-[90rem]:px-[16.25rem]">
        {/* 데스크톱 사이드 필터 렌더 */}
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
          {/* 검색·건수·정렬 툴바 렌더 */}
          <RequestsListToolbar
            listFilters={listFilters}
            onCommitKeyword={commitSearchKeyword}
            onQueryChange={handleQueryChange}
            onResetAll={handleResetAll}
            resetSignal={resetSignal}
            totalCount={totalCount}
            showListFetching={showListFetching}
            sortValue={sortValue}
            onSortChange={handleSortChange}
            isFilterActive={isFilterActive}
            onFilterOpen={() => setIsFilterModalOpen(true)}
          />
          {/* 로딩·에러·빈목록·목록 상태 분기 */}
          {isPending && requests.length === 0 ? (
            <RequestsListSkeleton />
          ) : isError && requests.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16">
              <p
                role="alert"
                className="text-center text-lg-medium text-red-200"
              >
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
            </div>
          ) : isEmpty ? (
            <RequestsEmptyState
              variant={isFilteredEmpty ? 'filtered' : 'initial'}
              onReset={isFilteredEmpty ? handleResetAll : undefined}
            />
          ) : (
            // 요청 카드 목록 렌더
            <div className="relative">
              <AnimatePresence>
                {showListFetching ? (
                  <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    transition={motionTransition}
                    className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-white/40"
                    aria-hidden
                  />
                ) : null}
              </AnimatePresence>

              <motion.ul
                key={shouldAnimateList ? listAnimationKey : 'requests-list'}
                variants={shouldAnimateList ? listStagger : undefined}
                initial={shouldAnimateList ? 'hidden' : false}
                animate={shouldAnimateList ? 'show' : undefined}
                className="flex w-full flex-col gap-6 lg:gap-12"
              >
                {shouldAnimateList ? (
                  <AnimatePresence mode="popLayout">
                    {displayRequests.map((request) => (
                      <motion.li
                        key={request.id}
                        layout
                        variants={listItemVariants}
                        initial={false}
                        animate="show"
                        exit="exit"
                        transition={motionTransition}
                        onAnimationComplete={(definition) => {
                          if (definition === 'exit') {
                            handleExitComplete(request.id);
                          }
                        }}
                        data-request-id={request.id}
                        className="overflow-hidden"
                      >
                        <ReceivedRequestCard
                          request={request}
                          onSendQuote={handleOpenSendQuoteModal}
                          onReject={handleOpenRejectModal}
                          onChatClick={handleChatClick}
                          isChatPending={pendingChatRequestId === request.id}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                ) : (
                  displayRequests.map((request) => (
                    <motion.li
                      key={request.id}
                      layout={false}
                      data-request-id={request.id}
                      className="overflow-hidden"
                    >
                      <ReceivedRequestCard
                        request={request}
                        onSendQuote={handleOpenSendQuoteModal}
                        onReject={handleOpenRejectModal}
                        onChatClick={handleChatClick}
                        isChatPending={pendingChatRequestId === request.id}
                      />
                    </motion.li>
                  ))
                )}
              </motion.ul>
              {/* 무한 스크롤 감지 영역 렌더 */}
              {hasNextPage || isFetchingNextPage ? (
                <div
                  ref={loadMoreRef}
                  className="flex w-full justify-center py-6"
                >
                  <AnimatePresence>
                    {isFetchingNextPage ? (
                      <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        transition={motionTransition}
                      >
                        <Spinner message="더 불러오는 중..." className="py-4" />
                      </motion.div>
                    ) : (
                      <span className="sr-only">스크롤하여 더 보기</span>
                    )}
                  </AnimatePresence>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      {/* 모바일 필터 모달 렌더 */}
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
      {/* 견적 보내기 모달 렌더 */}
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
            isSubmitting={proposalMutation.isPending}
            errorMessage={submitErrorMessage ?? undefined}
          />
        ) : null}
      </Modal>
      {/* 반려 모달 렌더 */}
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
            isSubmitting={rejectionMutation.isPending}
            errorMessage={submitErrorMessage ?? undefined}
          />
        ) : null}
      </Modal>
    </>
  );
};

export default MoverRequestsPageClient;
