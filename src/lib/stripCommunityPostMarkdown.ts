const HTML_ENTITY_PATTERN = /&(?:nbsp|amp|lt|gt|quot|#39);/gi;

const HTML_ENTITY_REPLACEMENTS: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

/** HTML 엔티티 디코딩 */
export const decodeHtmlEntities = (text: string): string =>
  text.replace(HTML_ENTITY_PATTERN, (entity) => {
    const lower = entity.toLowerCase();
    return HTML_ENTITY_REPLACEMENTS[lower] ?? entity;
  });

/** HTML anchor → markdown 링크 */
export const convertHtmlAnchorsToMarkdown = (html: string): string =>
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

/** BE/HTML 혼합 content → react-markdown 입력용 markdown */
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

/** 마크다운/HTML → plain text (목록·공유 미리보기용) */
export const stripCommunityPostMarkdown = (input: string): string => {
  const markdown = normalizeCommunityPostContentForRender(input);
  return stripMarkdownToPlain(markdown);
};
