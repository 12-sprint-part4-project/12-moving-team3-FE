/** BE 기본·최대 pageSize와 동일 */
export const MOVER_REVIEWS_PAGE_SIZE = 6;

/** 리뷰 도메인 공통 queryKey (등록·수정·삭제 후 invalidate용) */
export const reviewQueryKeys = {
  all: ['reviews'] as const,
  publicByMover: (moverId: string) =>
    [...reviewQueryKeys.all, 'public', moverId] as const,
  publicList: (moverId: string, page: number, limit: number) =>
    [...reviewQueryKeys.publicByMover(moverId), { page, limit }] as const,
  writable: () => [...reviewQueryKeys.all, 'writable'] as const,
  writableList: (page: number, limit: number) =>
    [...reviewQueryKeys.writable(), { page, limit }] as const,
  customer: () => [...reviewQueryKeys.all, 'customer'] as const,
  customerList: (page: number, limit: number) =>
    [...reviewQueryKeys.customer(), { page, limit }] as const,
  moverReceived: () => [...reviewQueryKeys.all, 'mover'] as const,
  moverReceivedList: (page: number, limit: number) =>
    [...reviewQueryKeys.moverReceived(), { page, limit }] as const,
};
