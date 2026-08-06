import DOMPurify from 'dompurify';

const COMMUNITY_POST_HTML_ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'h1',
  'h2',
  'ul',
  'ol',
  'li',
  'a',
] as const;

const COMMUNITY_POST_HTML_ALLOWED_ATTR = ['href', 'target', 'rel'] as const;

/** Tiptap 본문 HTML — 상세 렌더용 sanitize */
export const sanitizeCommunityPostHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...COMMUNITY_POST_HTML_ALLOWED_TAGS],
    ALLOWED_ATTR: [...COMMUNITY_POST_HTML_ALLOWED_ATTR],
  });

/** 공유·미리보기용 plain text */
export const stripCommunityPostHtml = (html: string): string =>
  DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).trim();
