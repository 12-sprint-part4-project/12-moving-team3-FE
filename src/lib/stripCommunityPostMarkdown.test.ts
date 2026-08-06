import { describe, expect, it } from 'vitest';

import {
  normalizeCommunityPostContentForRender,
  stripCommunityPostMarkdown,
} from './stripCommunityPostMarkdown';

describe('stripCommunityPostMarkdown', () => {
  it('HTML 엔티티와 태그를 제거한다', () => {
    expect(
      stripCommunityPostMarkdown('게시글 테스트&nbsp;<a href="https://a.com">링크</a>')
    ).toBe('게시글 테스트 링크');
  });

  it('markdown 링크는 라벨만 남긴다', () => {
    expect(stripCommunityPostMarkdown('[링크](https://example.com)')).toBe('링크');
  });
});

describe('normalizeCommunityPostContentForRender', () => {
  it('HTML anchor를 markdown 링크로 변환한다', () => {
    expect(
      normalizeCommunityPostContentForRender(
        '<p>본문 <a href="https://example.com">예시</a></p>'
      )
    ).toBe('본문 [예시](https://example.com)');
  });

  it('빈 링크 라벨은 URL을 사용한다', () => {
    expect(
      normalizeCommunityPostContentForRender('[](https://example.com)')
    ).toBe('[https://example.com](https://example.com)');
  });
});
