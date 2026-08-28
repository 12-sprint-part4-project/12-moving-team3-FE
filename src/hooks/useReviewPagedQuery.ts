import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { MOVER_REVIEWS_PAGE_SIZE } from '@/hooks/reviewQueryKeys';
import { getMoverAccessToken } from '@/services/moversAuth';

import type { ReviewPaginationMeta } from '@/types/review';

interface ReviewPagedResponseBase {
  meta: {
    pagination: ReviewPaginationMeta;
  };
}

export interface UseReviewPagedQueryOptions<
  TData extends ReviewPagedResponseBase,
  TItem,
> {
  queryKey: (page: number, limit: number) => readonly unknown[];
  queryFn: (params: { page: number; limit: number }) => Promise<TData>;
  selectItems: (data: TData) => TItem[];
  enabled?: boolean;
  limit?: number;
  /** true면 accessToken이 있을 때만 요청 (기본 true) */
  requireAccessToken?: boolean;
}

/**
 * 리뷰 도메인 페이지네이션 useQuery 공통 로직.
 * keepPreviousData · page/totalPages · isEmpty 를 한곳에서 처리한다.
 */
export const useReviewPagedQuery = <
  TData extends ReviewPagedResponseBase,
  TItem,
>({
  queryKey,
  queryFn,
  selectItems,
  enabled = true,
  limit,
  requireAccessToken = true,
}: UseReviewPagedQueryOptions<TData, TItem>) => {
  const pageSize = limit ?? MOVER_REVIEWS_PAGE_SIZE;
  const [page, setPage] = useState(1);
  const queryEnabled = requireAccessToken
    ? enabled && Boolean(getMoverAccessToken())
    : enabled;

  const query = useQuery({
    queryKey: queryKey(page, pageSize),
    queryFn: () => queryFn({ page, limit: pageSize }),
    enabled: queryEnabled,
    placeholderData: keepPreviousData,
  });

  const pagination = query.data?.meta.pagination;
  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.totalCount / pagination.pageSize))
    : 1;
  const items = query.data ? selectItems(query.data) : [];

  return {
    ...query,
    items,
    pagination,
    page,
    totalPages,
    setPage,
    isEmpty: !query.isPending && !query.isError && items.length === 0,
  };
};
