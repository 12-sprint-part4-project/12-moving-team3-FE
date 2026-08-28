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
