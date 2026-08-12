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
  // replace 시 최신 필터만 쓰면 됨 — effect deps에 넣어 재실행하지 않음
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

    const found = requests.some((request) => request.id === targetId);
    if (found) {
      settledRef.current = true;

      const frameId = window.requestAnimationFrame(() => {
        const element = document.querySelector<HTMLElement>(
          `[data-request-id="${targetId}"]`
        );
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        router.replace(buildRequestsListHref(listFiltersRef.current), {
          scroll: false,
        });
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
      return;
    }

    if (!hasNextPage && !isFetchingNextPage) {
      settledRef.current = true;
      router.replace(buildRequestsListHref(listFiltersRef.current), {
        scroll: false,
      });
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
