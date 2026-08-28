import { describe, expect, it } from 'vitest';

import { getChatLastMessagePreview } from './chatMessagePreview';

import type { ChatLastMessage } from '@/types/chat';

const createLastMessage = (
  overrides: Partial<ChatLastMessage> = {}
): ChatLastMessage => ({
  messageId: 1,
  senderId: 'user-1',
  content: '안녕하세요',
  messageType: 'TEXT',
  createdAt: '2026-08-15T00:00:00.000Z',
  ...overrides,
});

describe('getChatLastMessagePreview', () => {
  it('lastMessage가 null이면 대화를 시작해 보세요', () => {
    expect(getChatLastMessagePreview(null)).toBe('대화를 시작해 보세요');
  });

  it('IMAGE면 사진', () => {
    expect(
      getChatLastMessagePreview(
        createLastMessage({ messageType: 'IMAGE', content: '' })
      )
    ).toBe('사진');
  });

  it('일반 TEXT content는 그대로 미리보기로 표시한다', () => {
    expect(getChatLastMessagePreview(createLastMessage())).toBe('안녕하세요');
  });

  it('필터 토큰 content는 미리보기 라벨로 치환한다', () => {
    expect(
      getChatLastMessagePreview(
        createLastMessage({ content: '연락처 [전화번호]' })
      )
    ).toBe('연락처 연락처');
  });

  it('TEXT content가 비어 있으면 대화를 시작해 보세요', () => {
    expect(
      getChatLastMessagePreview(createLastMessage({ content: '   ' }))
    ).toBe('대화를 시작해 보세요');
  });
});
