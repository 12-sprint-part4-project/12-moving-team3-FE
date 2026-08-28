import { describe, expect, it } from 'vitest';

import { resolveChatRoomStatusChip } from './resolveChatRoomStatusChip';

describe('resolveChatRoomStatusChip', () => {
  it('COMMUNITY는 community 칩을 반환한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'COMMUNITY',
        quoteStatus: 'PENDING',
        estimateRequestStatus: 'EXPIRED',
      })
    ).toEqual({ kind: 'community' });
  });

  it('EXPIRED 견적 요청은 quoteStatus보다 closedEstimate를 우선한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'GENERAL',
        quoteStatus: 'PENDING',
        estimateRequestStatus: 'EXPIRED',
      })
    ).toEqual({ kind: 'closedEstimate', estimateRequestStatus: 'EXPIRED' });
  });

  it.each(['CANCELED', 'COMPLETED'] as const)(
    '%s 견적 요청도 closedEstimate를 반환한다',
    (estimateRequestStatus) => {
      expect(
        resolveChatRoomStatusChip({
          roomType: 'GENERAL',
          quoteStatus: 'PENDING',
          estimateRequestStatus,
        })
      ).toEqual({ kind: 'closedEstimate', estimateRequestStatus });
    }
  );

  it('DESIGNATED 방의 종료 견적 요청은 designated보다 closedEstimate를 우선한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'DESIGNATED',
        quoteStatus: null,
        estimateRequestStatus: 'COMPLETED',
      })
    ).toEqual({
      kind: 'closedEstimate',
      estimateRequestStatus: 'COMPLETED',
    });
  });

  it('estimateRequestStatus가 null이고 quoteStatus가 PENDING이면 quote를 반환한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'GENERAL',
        quoteStatus: 'PENDING',
        estimateRequestStatus: null,
      })
    ).toEqual({ kind: 'quote', quoteStatus: 'PENDING' });
  });

  it('지정 요청 + 견적 미연결 + SUBMITTED면 designated를 반환한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'DESIGNATED',
        quoteStatus: null,
        estimateRequestStatus: 'SUBMITTED',
      })
    ).toEqual({ kind: 'designated' });
  });

  it('견적 미연결 GENERAL 방은 none을 반환한다', () => {
    expect(
      resolveChatRoomStatusChip({
        roomType: 'GENERAL',
        quoteStatus: null,
        estimateRequestStatus: null,
      })
    ).toEqual({ kind: 'none' });
  });
});
