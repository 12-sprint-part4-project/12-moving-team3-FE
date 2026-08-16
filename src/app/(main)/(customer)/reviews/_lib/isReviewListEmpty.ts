/** 리뷰 목록 empty 여부 (pending·error가 아닐 때) */
export const isReviewListEmpty = (list: {
  isPending: boolean;
  isError: boolean;
  isEmpty: boolean;
  pagination?: { totalCount: number } | null;
}) =>
  !list.isPending &&
  !list.isError &&
  (list.isEmpty || (list.pagination?.totalCount ?? 0) === 0);
