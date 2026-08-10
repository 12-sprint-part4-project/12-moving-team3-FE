'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/Button/Button';
import { FilterButton } from '@/components/ui/Filter/FilterButton';
import { TextFieldSearch } from '@/components/ui/Input/TextFieldSearch';
import { Modal } from '@/components/ui/Modal/Modal';
import { RejectRequestModal } from '@/components/ui/Modal/RejectRequestModal';
import { SendQuoteModal } from '@/components/ui/Modal/SendQuoteModal';
import { Sort } from '@/components/ui/Sort/Sort';
import { Spinner } from '@/components/ui/Spinner/Spinner';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useQuoteSubmission } from '@/hooks/useQuoteSubmission';
import { useReceivedEstimateRequests } from '@/hooks/useReceivedEstimateRequests';
import { ApiError } from '@/lib/apiClient';
import {
  ALL_MOVE_TYPES,
  ALL_SCOPES,
  type MoveTypeOption,
  type ReceivedRequestCardModel,
  type RequestScopeOption,
  type RequestsFilterState,
  type RequestsSortValue,
} from '@/types/estimateRequest';

import { ReceivedRequestCard } from './_components/ReceivedRequestCard';
import { RequestsEmptyState } from './_components/RequestsEmptyState';
import { RequestsFilterResetButton } from './_components/RequestsFilterResetButton';
import { RequestsMobileFilterModal } from './_components/RequestsMobileFilterModal';
import { RequestsSidebarFilter } from './_components/RequestsSidebarFilter';
import {
  buildRequestsListHref,
  DEFAULT_REQUESTS_LIST_URL_STATE,
  isDefaultRequestsListUrlState,
  isRequestsSortValue,
  parseRequestsListSearchParams,
  type RequestsListUrlState,
} from './_lib/requestsListSearchParams';
import { useRequestsListSearch } from './_lib/useRequestsListSearch';

/** 정렬 옵션 정의 */
const SORT_OPTIONS: { label: string; value: RequestsSortValue }[] = [
  { label: '이사 빠른순', value: 'moveDateAsc' },
  { label: '요청일 빠른순', value: 'requestDateAsc' },
];

/** 데스크톱 필터 변경 API 조회 디바운스 지연(ms) */
const FILTER_DEBOUNCE_MS = 200;

/** 받은 요청 페이지 클라이언트 — 검색·정렬·필터·목록 조회 */
const MoverRequestsPageClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listFilters = useMemo(
    () => parseRequestsListSearchParams(searchParams),
    [searchParams]
  );

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [sendQuoteTarget, setSendQuoteTarget] =
    useState<ReceivedRequestCardModel | null>(null);
  const [rejectTarget, setRejectTarget] =
    useState<ReceivedRequestCardModel | null>(null);

  const selectedMoveTypes = listFilters.moveTypes;
  const selectedScopes = listFilters.scopes;
  const sortValue = listFilters.sort;

  const replaceListFilters = useCallback(
    (next: RequestsListUrlState) => {
      router.replace(buildRequestsListHref(next), { scroll: false });
    },
    [router]
  );

  const commitSearchKeyword = useCallback(
    (keyword: string) => {
      const current = parseRequestsListSearchParams(searchParams);
      router.replace(
        buildRequestsListHref({ ...current, keyword }),
        { scroll: false }
      );
    },
    [router, searchParams]
  );

  const {
    searchInputValue,
    queryKeyword,
    handleSearchChange,
    handleSearch,
    handleSearchClear,
    setSearchDraft,
  } = useRequestsListSearch({
    urlKeyword: listFilters.keyword,
    onCommitKeyword: commitSearchKeyword,
  });

  const debouncedMoveTypes = useDebouncedValue(
    selectedMoveTypes,
    FILTER_DEBOUNCE_MS
  );
  const debouncedScopes = useDebouncedValue(selectedScopes, FILTER_DEBOUNCE_MS);

  const handleMoveTypesChange = useCallback(
    (moveTypes: MoveTypeOption[]) => {
      replaceListFilters({ ...listFilters, moveTypes });
    },
    [listFilters, replaceListFilters]
  );

  const handleScopesChange = useCallback(
    (scopes: RequestScopeOption[]) => {
      replaceListFilters({ ...listFilters, scopes });
    },
    [listFilters, replaceListFilters]
  );

  const {
    submitErrorMessage,
    clearSubmitError,
    proposalMutation,
    rejectionMutation,
  } = useQuoteSubmission({
    onProposalSuccess: () => setSendQuoteTarget(null),
    onRejectionSuccess: () => setRejectTarget(null),
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

  /** 목록 하단 진입 여부 감지 */
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

  /** 필터 버튼 활성 여부 판별 */
  const isFilterActive =
    selectedMoveTypes.length !== ALL_MOVE_TYPES.length ||
    selectedScopes.length !== ALL_SCOPES.length;

  /** 검색·필터·정렬 중 하나라도 기본값과 다르면 초기화 가능 */
  const canResetFilters = !isDefaultRequestsListUrlState({
    ...listFilters,
    keyword: searchInputValue.trim(),
  });

  /** 에러 메시지 결정 */
  const errorMessage =
    error instanceof ApiError
      ? error.message
      : '받은 요청 목록을 불러오지 못했습니다.';

  /** 검색·이사유형·필터·정렬 전체 초기화 */
  const handleResetAll = () => {
    setSearchDraft('');
    replaceListFilters({ ...DEFAULT_REQUESTS_LIST_URL_STATE });
  };

  /** 정렬 값 변경 */
  const handleSortChange = (value: string) => {
    if (isRequestsSortValue(value)) {
      replaceListFilters({ ...listFilters, sort: value });
    }
  };

  /** 모바일 필터 적용 */
  const handleFilterSubmit = (next: RequestsFilterState) => {
    replaceListFilters({
      ...listFilters,
      moveTypes: next.moveTypes,
      scopes: next.scopes,
    });
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

  /** 페이지 가로 패딩 클래스 정의 */
  const pageXPadding =
    'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

  return (
    <div className="flex w-full flex-col overflow-x-hidden bg-white">
      {/* 페이지 타이틀 영역 렌더 */}
      <div
        className={`border-b border-line-100 bg-white py-4 shadow-page-title md:py-6 lg:py-8 ${pageXPadding}`}
      >
        <h1 className="text-2lg-semibold text-black-400 lg:text-2xl-semibold">
          받은 요청
        </h1>
      </div>

      {/* 사이드 필터 + 목록 레이아웃 렌더 */}
      <div
        className={`mx-auto flex w-full max-w-[1920px] flex-col gap-6 py-6 md:py-8 xl:flex-row xl:items-start xl:gap-8 min-[90rem]:gap-12 ${pageXPadding}`}
      >
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
          <div className="flex w-full flex-col gap-4 lg:gap-6">
            <TextFieldSearch
              size="sm"
              className="w-full max-w-none lg:h-16 lg:gap-2 lg:px-6 lg:py-3.5 lg:[&_button]:size-9 lg:[&_input]:text-xl-regular lg:[&_svg]:size-9"
              placeholder="고객명 또는 출발지·도착지로 검색해 보세요"
              value={searchInputValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              onClear={handleSearchClear}
              aria-label="고객명·출발지·도착지 검색"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="shrink-0 text-lg-medium text-black-400">
                전체 {totalCount}건
                {isFetching && !isPending && !isFetchingNextPage ? (
                  <span className="ml-2 text-md-regular text-gray-400">
                    업데이트 중...
                  </span>
                ) : null}
              </p>

              <div className="flex min-w-0 items-center gap-2">
                <RequestsFilterResetButton
                  onClick={handleResetAll}
                  disabled={!canResetFilters}
                />
                {/* 모바일 정렬 렌더 */}
                <div className="flex items-center md:hidden">
                  <Sort
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onValueChange={handleSortChange}
                    size="sm"
                  />
                </div>
                {/* 태블릿·데스크톱 정렬 렌더 */}
                <div className="hidden items-center md:flex">
                  <Sort
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onValueChange={handleSortChange}
                    size="md"
                  />
                </div>
                {/* 모바일·태블릿 필터 버튼 렌더 */}
                <FilterButton
                  aria-label="필터 열기"
                  active={isFilterActive}
                  className="cursor-pointer xl:hidden"
                  onClick={() => setIsFilterModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* 로딩·에러·빈목록·목록 상태 분기 */}
          {isPending ? (
            <Spinner message="목록 불러오는 중..." />
          ) : isError ? (
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
            <RequestsEmptyState />
          ) : (
            <>
              {/* 요청 카드 목록 렌더 */}
              <ul className="flex w-full flex-col gap-6 lg:gap-12">
                {requests.map((request) => (
                  <li key={request.id}>
                    <ReceivedRequestCard
                      request={request}
                      onSendQuote={handleOpenSendQuoteModal}
                      onReject={handleOpenRejectModal}
                    />
                  </li>
                ))}
              </ul>

              {/* 무한 스크롤 감지 영역 렌더 */}
              {hasNextPage || isFetchingNextPage ? (
                <div
                  ref={loadMoreRef}
                  className="flex w-full justify-center py-6"
                >
                  {isFetchingNextPage ? (
                    <Spinner message="더 불러오는 중..." className="py-4" />
                  ) : (
                    <span className="sr-only">스크롤하여 더 보기</span>
                  )}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* 모바일 필터 모달 렌더 */}
      {isFilterModalOpen ? (
        <Modal placement="bottom" onClose={handleCloseFilterModal}>
          <RequestsMobileFilterModal
            onClose={handleCloseFilterModal}
            onSubmit={handleFilterSubmit}
            defaultMoveTypes={selectedMoveTypes}
            defaultScopes={selectedScopes}
            moveTypeCounts={moveTypeCounts}
            scopeCounts={scopeCounts}
          />
        </Modal>
      ) : null}

      {/* 견적 보내기 모달 렌더 */}
      {sendQuoteTarget ? (
        <Modal placement="bottom" onClose={handleCloseSendQuoteModal}>
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
        </Modal>
      ) : null}

      {/* 반려 모달 렌더 */}
      {rejectTarget ? (
        <Modal placement="bottom" onClose={handleCloseRejectModal}>
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
        </Modal>
      ) : null}
    </div>
  );
};

export default MoverRequestsPageClient;
