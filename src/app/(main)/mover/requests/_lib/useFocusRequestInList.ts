'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

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
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown>;
  /** 스크롤 후 URL에서 focus를 떼고 남길 필터 상태 */
  listFilters: RequestsListUrlState;
}

/** DOM에 카드가 붙을 때까지 재시도 (entrance 애니·커밋 지연 대비) */
const SCROLL_RETRY_MAX = 20;
const SCROLL_RETRY_INTERVAL_MS = 50;

/**
 * 알림 `?focus={id}` 딥링크 — 대상 카드가 나올 때까지 다음 페이지를 받고
 * `data-request-id` 요소로 scrollIntoView 한 뒤 focus 쿼리를 제거한다.
 */
export const useFocusRequestInList = ({
  focusRequestId,
  requests,
  isPending,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  listFilters,
}: UseFocusRequestInListParams) => {
  const router = useRouter();
  const targetIdRef = useRef(focusRequestId);
  const settledRef = useRef(false);
  const listFiltersRef = useRef(listFilters);
  listFiltersRef.current = listFilters;

  // 서버에서 새 focus로 진입하면 다시 시도
  if (focusRequestId !== targetIdRef.current) {
    targetIdRef.current = focusRequestId;
    settledRef.current = false;
  }

  useEffect(() => {
    const targetId = targetIdRef.current;
    if (targetId == null || settledRef.current) {
      return;
    }

    if (isPending) {
      return;
    }

    const clearFocusFromUrl = () => {
      router.replace(buildRequestsListHref(listFiltersRef.current), {
        scroll: false,
      });
    };

    const found = requests.some((request) => request.id === targetId);
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
          `[data-request-id="${targetId}"]`
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
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    router,
    focusRequestId,
  ]);
};
