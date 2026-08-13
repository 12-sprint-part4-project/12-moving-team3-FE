/**
 * 게시글 content 포맷 판별 및 변환 유틸
 *
 * 포맷 전환 이력
 * - Legacy: @tiptap/markdown → Markdown 직렬화 → react-markdown 렌더링
 * - Current: editor.getHTML() → HTML 저장 → DOMPurify + dangerouslySetInnerHTML 렌더링
 *
 * XSS 방어는 BE의 sanitize-html 처리에 의존하며,
 * 프론트에서 DOMPurify를 추가 레이어로 적용합니다.
 */

// ─── 포맷 판별 ────────────────────────────────────────────────

/** HTML 태그 시작 패턴 — Markdown 자동 링크(<https://...>)를 HTML로 오판하지 않도록 실제 태그 형식만 인정 */
const HTML_TAG_START_PATTERN = /^<\/?[a-z][\w:-]*(?:\s[^>]*|\/?)>/i;

/** HTML 포맷 여부 — Tiptap getHTML()은 항상 <p>로 시작 */
export const isHtmlContent = (content: string): boolean =>
  HTML_TAG_START_PATTERN.test(content.trimStart());

// ─── HTML → plain text ────────────────────────────────────────

const HTML_BLOCK_TAG_PATTERN = /<\/?(p|li|h[1-6]|blockquote|br)[^>]*>/gi;
const HTML_TAG_PATTERN = /<[^>]+>/g;
const HTML_ENTITY_PATTERN = /&(?:nbsp|amp|lt|gt|quot|#39);/gi;
const WHITESPACE_PATTERN = /\s+/g;

const HTML_ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

const decodeHtmlEntities = (text: string): string =>
  text.replace(HTML_ENTITY_PATTERN, (e) => HTML_ENTITY_MAP[e.toLowerCase()] ?? e);

const stripHtmlToPlainText = (html: string): string =>
  decodeHtmlEntities(
    html
      .replace(HTML_BLOCK_TAG_PATTERN, ' ')
      .replace(HTML_TAG_PATTERN, '')
  )
    .replace(WHITESPACE_PATTERN, ' ')
    .trim();

// ─── Legacy Markdown → plain text ────────────────────────────

const stripMarkdownToPlain = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

// ─── Legacy 렌더링 파이프라인 (하위 호환) ─────────────────────

/** HTML anchor → markdown 링크 */
const convertHtmlAnchorsToMarkdown = (html: string): string =>
  html.replace(
    /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href: string, innerHtml: string) => {
      const label = decodeHtmlEntities(innerHtml.replace(/<[^>]+>/g, '')).trim();
      return `[${label || href}](${href})`;
    }
  );

const stripRemainingHtml = (text: string): string =>
  text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?p>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ');

const fixEmptyMarkdownLinks = (markdown: string): string =>
  markdown.replace(/\[(\s*)\]\(([^)]+)\)/g, '[$2]($2)');

const normalizeAutolinkAngles = (markdown: string): string =>
  markdown.replace(/<(https?:\/\/[^>\s]+)>/g, '[$1]($1)');

/**
 * Legacy Markdown/혼합 content → react-markdown 입력용 정규화
 * HTML 포맷 게시글에는 사용하지 않습니다.
 */
export const normalizeCommunityPostContentForRender = (
  content: string
): string => {
  let markdown = decodeHtmlEntities(content);
  markdown = convertHtmlAnchorsToMarkdown(markdown);
  markdown = normalizeAutolinkAngles(markdown);
  markdown = stripRemainingHtml(markdown);
  markdown = fixEmptyMarkdownLinks(markdown);
  return markdown.replace(/\n{3,}/g, '\n\n').trim();
};

// ─── 통합 plain text 추출 (목록·공유 미리보기용) ───────────────

/** HTML / Legacy Markdown 모두 처리하는 plain text 변환 */
export const stripCommunityPostContent = (content: string): string => {
  if (isHtmlContent(content)) {
    return stripHtmlToPlainText(content);
  }
  return stripMarkdownToPlain(normalizeCommunityPostContentForRender(content));
};

/** 첫 번째 단락/줄만 추출 — 목록 카드 본문 미리보기용 */
export const stripCommunityPostContentPreview = (content: string): string => {
  if (isHtmlContent(content)) {
    const firstBlock = content.split(/<\/p>|<br/i)[0] ?? content;
    return stripHtmlToPlainText(firstBlock);
  }
  const firstLine = content.split('\n')[0] ?? content;
  return stripMarkdownToPlain(normalizeCommunityPostContentForRender(firstLine));
};
