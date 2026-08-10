'use client';

import type { ReactNode } from 'react';

import { Pagination } from '@/components/ui/Pagination/Pagination';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export interface ReviewListSectionProps<T> {
  items: T[];
  isPending: boolean;
  isError: boolean;
  showEmpty: boolean;
  pendingMessage: string;
  errorMessage: string;
  onRetry: () => void;
  emptyState: ReactNode;
  renderItem: (item: T) => ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * 이사 리뷰 탭 목록 공통 레이아웃.
 * 스피너·에러·empty·그리드·반응형 페이지네이션을 한곳에서 렌더한다.
 */
export const ReviewListSection = <T,>({
  items,
  isPending,
  isError,
  showEmpty,
  pendingMessage,
  errorMessage,
  onRetry,
  emptyState,
  renderItem,
  page,
  totalPages,
  onPageChange,
}: ReviewListSectionProps<T>) => (
  <>
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

        <div className="flex justify-center pt-2">
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
  </>
);
