import type { CommentListParams, PostListParams } from '@/types/community';
import type { ReceivedEstimateRequestsParams } from '@/types/estimateRequest';
import type { MoversListParams } from '@/types/mover';
import type { QuoteListStatus } from '@/types/quote';

/** 인증 — /me 캐시 무효화·로그아웃 시 제거 */
export const AUTH_QUERY_KEYS = {
  all: ['auth'] as const,
  me: () => [...AUTH_QUERY_KEYS.all, 'me'] as const,
};

/** 채팅 — 방 목록·상세·메시지·미읽음 */
export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  room: (roomId: number) => [...chatQueryKeys.all, 'room', roomId] as const,
  /** roomId 무관 전체 방 상세 캐시 — 알림 SSE 등 크로스 도메인 invalidate용 */
  roomsAll: () => [...chatQueryKeys.all, 'room'] as const,
  messages: (roomId: number) =>
    [...chatQueryKeys.all, 'messages', roomId] as const,
  unread: () => [...chatQueryKeys.all, 'unread'] as const,
};

/** 알림 — GET /api/notifications 단일 목록 */
export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationQueryKeys.all, 'list'] as const,
  list: () => [...notificationQueryKeys.lists()] as const,
};

/** 커뮤니티 — 게시글·댓글·이웃글 */
export const communityQueryKeys = {
  all: ['community'] as const,
  lists: () => [...communityQueryKeys.all, 'list'] as const,
  list: (query: PostListParams) =>
    [...communityQueryKeys.lists(), query] as const,
  details: () => [...communityQueryKeys.all, 'detail'] as const,
  detail: (postId: number) =>
    [...communityQueryKeys.details(), postId] as const,
  comments: () => [...communityQueryKeys.all, 'comments'] as const,
  commentLists: () => [...communityQueryKeys.comments(), 'list'] as const,
  commentListsByPost: (postId: number) =>
    [...communityQueryKeys.commentLists(), postId] as const,
  commentList: (postId: number, query: CommentListParams) =>
    [...communityQueryKeys.commentLists(), postId, query] as const,
  neighborLists: () => [...communityQueryKeys.all, 'neighbors'] as const,
  neighbors: (postId: number, query: PostListParams) =>
    [...communityQueryKeys.neighborLists(), postId, query] as const,
};

/** 기사님 찾기 — 목록·상세. cursor는 페이지네이션이라 list 키에서 제외 */
export const moverQueryKeys = {
  all: ['movers'] as const,
  lists: () => [...moverQueryKeys.all, 'list'] as const,
  list: (params: Omit<MoversListParams, 'cursor'>) =>
    [...moverQueryKeys.lists(), params] as const,
  details: () => [...moverQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...moverQueryKeys.details(), id] as const,
};

/** 찜한 기사님 — movers 루트 하위로 묶어 기사님 캐시와 함께 무효화 */
export const favoriteQueryKeys = {
  all: [...moverQueryKeys.all, 'favorites'] as const,
  lists: () => [...favoriteQueryKeys.all, 'list'] as const,
  list: (limit: number) => [...favoriteQueryKeys.lists(), limit] as const,
  preview: (limit: number) =>
    [...favoriteQueryKeys.all, 'preview', limit] as const,
};

/** 일반 유저 견적서 — 대기·과거·상세 */
export const customerQuoteQueryKeys = {
  all: ['customer-quotes'] as const,
  pending: () => [...customerQuoteQueryKeys.all, 'pending'] as const,
  past: (params: { limit: number; filter?: string }) =>
    [...customerQuoteQueryKeys.all, 'past', params] as const,
  details: () => [...customerQuoteQueryKeys.all, 'detail'] as const,
  detail: (quoteId: number) =>
    [...customerQuoteQueryKeys.details(), quoteId] as const,
};

/** 일반 유저 견적 요청 — 활성 DRAFT·상세 */
export const customerEstimateRequestQueryKeys = {
  all: ['customer-estimate-request'] as const,
  active: () => [...customerEstimateRequestQueryKeys.all, 'active'] as const,
  detail: (estimateRequestId: number) =>
    [
      ...customerEstimateRequestQueryKeys.all,
      'detail',
      estimateRequestId,
    ] as const,
};

/** 기사님 받은 견적 요청 목록 */
export const estimateRequestQueryKeys = {
  all: ['estimate-requests'] as const,
  receivedLists: () => [...estimateRequestQueryKeys.all, 'received'] as const,
  receivedList: (params: Omit<ReceivedEstimateRequestsParams, 'cursor'>) =>
    [...estimateRequestQueryKeys.receivedLists(), params] as const,
};

/** 지정 견적 — 기사님별 지정 여부 */
export const designatedEstimateQueryKeys = {
  all: ['designated-estimate'] as const,
  existence: (moverId: string) =>
    [...designatedEstimateQueryKeys.all, 'existence', moverId] as const,
};

/** 기사님 보낸/반려 견적 목록 */
export const moverQuoteQueryKeys = {
  all: ['mover-quotes'] as const,
  lists: () => [...moverQuoteQueryKeys.all, 'list'] as const,
  list: (status: QuoteListStatus, page: number, limit: number) =>
    [...moverQuoteQueryKeys.lists(), { status, page, limit }] as const,
};

/** 기사님 견적 상세 — mover-quotes 루트 하위 */
export const moverQuoteDetailQueryKeys = {
  all: [...moverQuoteQueryKeys.all, 'detail'] as const,
  detail: (quoteId: number) =>
    [...moverQuoteDetailQueryKeys.all, quoteId] as const,
};

/** 리뷰 — 공개·작성가능·고객·기사님 수신 */
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

/** 기사님 본인 프로필 */
export const moverProfileQueryKeys = {
  all: ['mover-profile'] as const,
  me: (userId: string) => [...moverProfileQueryKeys.all, 'me', userId] as const,
};

/** 일반 유저 본인 프로필 */
export const customerProfileQueryKeys = {
  all: ['customer-profile'] as const,
  me: (userId: string) =>
    [...customerProfileQueryKeys.all, 'me', userId] as const,
};
