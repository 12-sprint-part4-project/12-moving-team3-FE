import { describe, expect, it } from 'vitest';

import {
  getChatRouteDirection,
  isChatListPath,
  isChatRoomPath,
} from '@/lib/chatRouteTransition';

describe('isChatListPath', () => {
  it('/chat 만 목록으로 본다', () => {
    expect(isChatListPath('/chat')).toBe(true);
    expect(isChatListPath('/chat/1')).toBe(false);
    expect(isChatListPath('/chat/')).toBe(false);
  });
});

describe('isChatRoomPath', () => {
  it('한 세그먼트 roomId만 방으로 본다', () => {
    expect(isChatRoomPath('/chat/12')).toBe(true);
    expect(isChatRoomPath('/chat/abc')).toBe(true);
    expect(isChatRoomPath('/chat')).toBe(false);
    expect(isChatRoomPath('/chat/12/extra')).toBe(false);
  });
});

describe('getChatRouteDirection', () => {
  it('레이아웃 첫 마운트: 목록은 0, 방은 1', () => {
    expect(getChatRouteDirection(null, '/chat')).toBe(0);
    expect(getChatRouteDirection(null, '/chat/3')).toBe(1);
  });

  it('목록 → 방이면 1 (드롭다운·목록 클릭 공통)', () => {
    expect(getChatRouteDirection('/chat', '/chat/3')).toBe(1);
  });

  it('방 → 목록이면 -1', () => {
    expect(getChatRouteDirection('/chat/3', '/chat')).toBe(-1);
  });

  it('방 → 다른 방이면 1', () => {
    expect(getChatRouteDirection('/chat/3', '/chat/9')).toBe(1);
  });

  it('같은 경로면 0', () => {
    expect(getChatRouteDirection('/chat', '/chat')).toBe(0);
    expect(getChatRouteDirection('/chat/3', '/chat/3')).toBe(0);
  });
});
