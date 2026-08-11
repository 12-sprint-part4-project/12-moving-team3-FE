import { describe, expect, it } from 'vitest';

import {
  isHtmlContent,
  normalizeCommunityPostContentForRender,
  stripCommunityPostContent,
} from './communityPostContent';

describe('isHtmlContent', () => {
  it('HTML 태그로 시작하면 true', () => {
    expect(isHtmlContent('<p>내용</p>')).toBe(true);
    expect(isHtmlContent('<h1>제목</h1>')).toBe(true);
  });

  it('Markdown이면 false', () => {
    expect(isHtmlContent('# 제목')).toBe(false);
    expect(isHtmlContent('내용')).toBe(false);
    expect(isHtmlContent('[링크](https://example.com)')).toBe(false);
  });

  it('Markdown 자동 링크(<https://...>)는 false', () => {
    expect(isHtmlContent('<https://example.com>')).toBe(false);
    expect(isHtmlContent('<http://example.com>')).toBe(false);
  });
});

describe('stripCommunityPostContent — HTML 포맷', () => {
  it('HTML 태그를 제거하고 텍스트만 남긴다', () => {
    expect(stripCommunityPostContent('<p>안녕하세요</p>')).toBe('안녕하세요');
  });

  it('HTML 엔티티를 디코딩한다', () => {
    expect(stripCommunityPostContent('<p>테스트&nbsp;내용</p>')).toBe('테스트 내용');
  });

  it('링크 텍스트를 남긴다', () => {
    expect(
      stripCommunityPostContent('<p><a href="https://a.com">링크</a></p>')
    ).toBe('링크');
  });
});

describe('stripCommunityPostContent — Legacy Markdown 포맷', () => {
  it('HTML 엔티티와 태그를 제거한다', () => {
    expect(
      stripCommunityPostContent('게시글 테스트&nbsp;<a href="https://a.com">링크</a>')
    ).toBe('게시글 테스트 링크');
  });

  it('markdown 링크는 라벨만 남긴다', () => {
    expect(stripCommunityPostContent('[링크](https://example.com)')).toBe('링크');
  });

  it('Markdown 자동 링크는 URL을 plain text로 남긴다', () => {
    expect(stripCommunityPostContent('<https://example.com>')).toBe('https://example.com');
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

  it('각괄호 자동 링크를 markdown 링크로 변환한다', () => {
    expect(
      normalizeCommunityPostContentForRender('<https://example.com>')
    ).toBe('[https://example.com](https://example.com)');
  });

  it('줄바꿈 문자를 유지한다', () => {
    expect(normalizeCommunityPostContentForRender('첫줄\n둘째줄')).toBe(
      '첫줄\n둘째줄'
    );
    expect(normalizeCommunityPostContentForRender('첫줄\n\n둘째줄')).toBe(
      '첫줄\n\n둘째줄'
    );
    expect(normalizeCommunityPostContentForRender('첫줄  \n둘째줄')).toBe(
      '첫줄  \n둘째줄'
    );
  });
});
