import { describe, expect, it } from 'vitest';

import {
  chatPartnerDisplayName,
  chatRoomDocumentTitle,
  CHAT_PAGE_DOCUMENT_TITLE,
} from './chatPartnerDisplayName';

describe('chatPartnerDisplayName', () => {
  it('displayName을 우선한다', () => {
    expect(
      chatPartnerDisplayName({
        displayName: '김기사',
        nickname: '기사',
        name: '김',
      })
    ).toBe('김기사');
  });

  it('displayName 없으면 nickname → name → 상대방', () => {
    expect(
      chatPartnerDisplayName({
        displayName: '',
        nickname: '길동',
        name: '홍길동',
      })
    ).toBe('길동');

    expect(
      chatPartnerDisplayName({
        displayName: '',
        nickname: '',
        name: '홍길동',
      })
    ).toBe('홍길동');

    expect(
      chatPartnerDisplayName({
        displayName: '',
        nickname: '',
        name: '',
      })
    ).toBe('상대방');
  });

  it('공백만 있는 이름은 건너뛰고 다음 이름을 사용한다', () => {
    expect(
      chatPartnerDisplayName({
        displayName: '  ',
        nickname: ' 길동 ',
        name: '홍길동',
      })
    ).toBe('길동');

    expect(
      chatPartnerDisplayName({
        displayName: '   ',
        nickname: '   ',
        name: '   ',
      })
    ).toBe('상대방');
  });
});

describe('chatRoomDocumentTitle', () => {
  it('상대 표시명과 무빙을 포함한다', () => {
    expect(
      chatRoomDocumentTitle({
        displayName: '김기사',
        nickname: '',
        name: '',
      })
    ).toBe('김기사님과의 채팅 | 무빙');
  });
});

describe('CHAT_PAGE_DOCUMENT_TITLE', () => {
  it('채팅 페이지 기본 타이틀', () => {
    expect(CHAT_PAGE_DOCUMENT_TITLE).toBe('채팅 | 무빙');
  });
});
