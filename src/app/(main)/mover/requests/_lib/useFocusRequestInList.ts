'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import {
  buildRequestsListHref,
  type RequestsListUrlState,
} from './requestsListSearchParams';

interface UseFocusRequestInListParams {
  /** 알림 딥링크 `?focus=` 로 넘어온 견적 요청 id. 없으면 noop */
  focusRequestId: number | null;
  /** 현재까지 로드된 목록 */
  requests: ReadonlyArray<{ id: number }>;
  isPending: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  /** 캐시된 목록만 보지 않도록 focus 진입 시 목록을 다시 받는다 */
  refetch: () => Promise<unknown>;
  /** 스크롤 후 URL에서 focus를 떼고 남길 필터 상태 */
  listFilters: RequestsListUrlState;
}

/** DOM에 카드가 붙을 때까지 재시도 (entrance 애니·커밋 지연 대비) */
const SCROLL_RETRY_MAX = 20;
const SCROLL_RETRY_INTERVAL_MS = 50;

/**
 * 알림 `?focus={id}` 딥링크 — 목록을 다시 받은 뒤 대상 카드가 나올 때까지
 * 다음 페이지를 받고 `data-request-id` 요소로 scrollIntoView 한 다음 focus 쿼리를 제거한다.
 */
export const useFocusRequestInList = ({
  focusRequestId,
  requests,
  isPending,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  refetch,
  listFilters,
}: UseFocusRequestInListParams) => {
  const router = useRouter();
  const settledRef = useRef(false);
  const listFiltersRef = useRef(listFilters);
  const refetchRef = useRef(refetch);
  const freshForFocusIdRef = useRef<number | null>(null);
  const [freshTick, setFreshTick] = useState(0);

  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  // 새 focus로 진입하면 캐시를 무시하고 목록을 다시 받는다
  useEffect(() => {
    settledRef.current = false;
    freshForFocusIdRef.current = null;

    if (focusRequestId == null) {
      return;
    }

    let cancelled = false;
    void refetchRef.current().finally(() => {
      if (cancelled) {
        return;
      }
      freshForFocusIdRef.current = focusRequestId;
      setFreshTick((tick) => tick + 1);
    });

    return () => {
      cancelled = true;
    };
  }, [focusRequestId]);

  // clearFocus 시 최신 필터를 쓰도록 동기화 (렌더 중 ref 쓰기 금지)
  useEffect(() => {
    listFiltersRef.current = listFilters;
  }, [listFilters]);

  useEffect(() => {
    if (focusRequestId == null || settledRef.current) {
      return;
    }

    if (freshForFocusIdRef.current !== focusRequestId) {
      return;
    }

    if (isPending || isFetching) {
      return;
    }

    const clearFocusFromUrl = () => {
      router.replace(buildRequestsListHref(listFiltersRef.current), {
        scroll: false,
      });
    };

    const found = requests.some((request) => request.id === focusRequestId);
    if (found) {
      // settled는 스크롤 성공(또는 재시도 소진) 후에만 true.
      // 미리 true로 두면 effect cleanup이 타이머를 끊었을 때 영구 스킵됨.
      let cancelled = false;
      let timeoutId = 0;
      let attempt = 0;

      const tryScroll = () => {
        if (cancelled || settledRef.current) {
          return;
        }

        const element = document.querySelector<HTMLElement>(
          `[data-request-id="${focusRequestId}"]`
        );

        if (element) {
          settledRef.current = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          clearFocusFromUrl();
          return;
        }

        attempt += 1;
        if (attempt >= SCROLL_RETRY_MAX) {
          settledRef.current = true;
          clearFocusFromUrl();
          return;
        }

        timeoutId = window.setTimeout(tryScroll, SCROLL_RETRY_INTERVAL_MS);
      };

      tryScroll();

      return () => {
        cancelled = true;
        window.clearTimeout(timeoutId);
      };
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
      return;
    }

    if (!hasNextPage && !isFetchingNextPage) {
      settledRef.current = true;
      clearFocusFromUrl();
    }
  }, [
    requests,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    router,
    focusRequestId,
    freshTick,
  ]);
};
