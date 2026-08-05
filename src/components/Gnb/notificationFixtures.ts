import type { NotificationItem } from '@/types/notification';

/**
 * Storybook·UI 검증용 알림 mock 12종.
 * content/payload는 BE `notification.templates.ts` 치환 결과와 동일하게 맞춤.
 */
export const NOTIFICATION_FIXTURES: NotificationItem[] = [
  {
    id: 1,
    type: 'NEW_QUOTE_REQUEST_ARRIVED',
    content: '김고객 고객님의 소형이사 견적 요청이 도착했어요',
    payload: { customerName: '김고객', moveTypeLabel: '소형이사' },
    isRead: false,
    createdAt: '2026-08-05T01:00:00.000Z',
    quoteId: null,
    estimateRequestId: 101,
  },
  {
    id: 2,
    type: 'NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED',
    content: '이고객 고객님의 가정이사 지정 견적 요청이 도착했어요',
    payload: { customerName: '이고객', moveTypeLabel: '가정이사' },
    isRead: false,
    createdAt: '2026-08-05T00:55:00.000Z',
    quoteId: null,
    estimateRequestId: 102,
  },
  {
    id: 3,
    type: 'NEW_QUOTE_OFFER_ARRIVED',
    content: '김코드 기사님의 소형이사 견적이 도착했어요',
    payload: { moverName: '김코드', moveTypeLabel: '소형이사' },
    isRead: false,
    createdAt: '2026-08-05T00:50:00.000Z',
    quoteId: 201,
    estimateRequestId: 103,
  },
  {
    id: 4,
    type: 'NEW_DESIGNATED_QUOTE_OFFER_ARRIVED',
    content: '박이사 기사님의 사무실이사 지정 견적이 도착했어요',
    payload: { moverName: '박이사', moveTypeLabel: '사무실이사' },
    isRead: true,
    createdAt: '2026-08-05T00:45:00.000Z',
    quoteId: 202,
    estimateRequestId: 104,
  },
  {
    id: 5,
    type: 'QUOTE_CONFIRMED',
    content: '김코드 기사님의 견적이 확정되었어요',
    payload: { moverName: '김코드' },
    isRead: false,
    createdAt: '2026-08-05T00:40:00.000Z',
    quoteId: 203,
    estimateRequestId: 105,
  },
  {
    id: 6,
    type: 'DESIGNATED_QUOTE_REJECTED',
    content: '최반려 기사님이 지정 견적 요청을 반려했어요',
    payload: { moverName: '최반려' },
    isRead: true,
    createdAt: '2026-08-05T00:35:00.000Z',
    quoteId: 204,
    estimateRequestId: 106,
  },
  {
    id: 7,
    type: 'CUSTOMER_MOVE_DAY_REMINDER',
    content: '내일은 경기(일산) → 서울(영등포) 이사 예정일이에요.',
    payload: {
      departureRegion: '경기(일산)',
      arrivalRegion: '서울(영등포)',
    },
    isRead: false,
    createdAt: '2026-08-04T15:00:00.000Z',
    quoteId: null,
    estimateRequestId: 107,
  },
  {
    id: 8,
    type: 'MOVER_MOVE_DAY_REMINDER',
    content: '내일은 서울(강남) → 부산(해운대) 이사 예정일이에요.',
    payload: {
      departureRegion: '서울(강남)',
      arrivalRegion: '부산(해운대)',
    },
    isRead: false,
    createdAt: '2026-08-04T14:55:00.000Z',
    quoteId: null,
    estimateRequestId: 108,
  },
  {
    id: 9,
    type: 'REVIEW_REQUESTED',
    content: '가정이사 이용 후기를 남겨주세요',
    payload: { moveTypeLabel: '가정이사' },
    isRead: true,
    createdAt: '2026-08-04T12:00:00.000Z',
    quoteId: 205,
    estimateRequestId: 109,
  },
  {
    id: 10,
    type: 'REVIEW_WRITTEN',
    content: '박리뷰 고객님이 리뷰를 남겼어요',
    payload: { customerName: '박리뷰' },
    isRead: false,
    createdAt: '2026-08-04T11:00:00.000Z',
    quoteId: 206,
    estimateRequestId: 110,
  },
  {
    id: 11,
    type: 'COMMUNITY_COMMENT',
    content: '댓글작성자님이 댓글을 남겼어요',
    payload: { authorName: '댓글작성자' },
    isRead: true,
    createdAt: '2026-08-04T10:00:00.000Z',
    quoteId: null,
    estimateRequestId: null,
  },
  {
    id: 12,
    type: 'SANCTION_NOTIFIED',
    content: '계정에 제재가 적용되었습니다',
    payload: {},
    isRead: false,
    createdAt: '2026-08-04T09:00:00.000Z',
    quoteId: null,
    estimateRequestId: null,
  },
];

/** 드롭다운 목록 스토리용 — 읽음/안읽음이 섞인 일부 샘플 */
export const NOTIFICATION_LIST_FIXTURE: NotificationItem[] =
  NOTIFICATION_FIXTURES.filter((item) =>
    [
      'NEW_QUOTE_OFFER_ARRIVED',
      'QUOTE_CONFIRMED',
      'CUSTOMER_MOVE_DAY_REMINDER',
      'NEW_DESIGNATED_QUOTE_REQUEST_ARRIVED',
      'REVIEW_WRITTEN',
    ].includes(item.type)
  );
