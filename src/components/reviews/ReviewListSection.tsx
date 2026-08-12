'use client';

import type { ReactNode } from 'react';

import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export interface ReviewListStatus {
  isPending: boolean;
  isError: boolean;
  showEmpty: boolean;
  pendingMessage: string;
  errorMessage: string;
  onRetry: () => void;
  emptyState: ReactNode;
}

export interface ReviewListPagination {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ReviewListSectionProps<T> {
  items: T[];
  status: ReviewListStatus;
  pagination: ReviewListPagination;
  renderItem: (item: T) => ReactNode;
}

/**
 * 이사 리뷰 탭 목록 공통 레이아웃.
 * 스피너·에러·empty·그리드·반응형 페이지네이션을 한곳에서 렌더한다.
 * 목록이 짧을 때도 페이지네이션은 패널 하단에 붙는다 (mt-auto).
 */
export const ReviewListSection = <T,>({
  items,
  status,
  pagination,
  renderItem,
}: ReviewListSectionProps<T>) => {
  const {
    isPending,
    isError,
    showEmpty,
    pendingMessage,
    errorMessage,
    onRetry,
    emptyState,
  } = status;
  const { page, totalPages, onPageChange } = pagination;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {isPending && items.length === 0 ? (
        <Spinner message={pendingMessage} />
      ) : null}

      {isError ? (
        <div className="flex flex-col items-start gap-3 py-10">
          <p className="text-md-medium text-gray-400">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-md-semibold text-blue-300 underline"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {!isError && showEmpty ? emptyState : null}

      {!isError && !showEmpty && items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-x-6 xl:gap-y-10">
            {items.map((item) => renderItem(item))}
          </div>

          <div className="mt-auto flex justify-center pt-6">
            <div className="contents xl:hidden">
              <Pagination
                size="sm"
                page={page}
                totalPages={Math.max(1, totalPages)}
                onPageChange={onPageChange}
              />
            </div>
            <div className="hidden xl:contents">
              <Pagination
                size="lg"
                page={page}
                totalPages={Math.max(1, totalPages)}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
