import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export interface UseLoadMoreOnViewParams {
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  rootMargin?: string;
}

/** 센티널이 보이면 다음 페이지를 불러온다 */
export const useLoadMoreOnView = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: UseLoadMoreOnViewParams) => {
  const { ref: loadMoreRef, inView } = useInView({
    rootMargin,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return loadMoreRef;
};
