'use client';

import { useMemo } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

import { isHtmlContent, normalizeCommunityPostContentForRender } from '@/lib/communityPostContent';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_DETAIL_BODY_MARKDOWN_CLASS,
  COMMUNITY_DETAIL_BODY_PROSE_CLASS,
  COMMUNITY_DETAIL_READING_TEXT_CLASS,
} from './communityDetailStyles';

interface CommunityPostDetailContentProps {
  content: string;
  className?: string;
}

/** 게시글 상세 본문 렌더러
 *
 * - HTML 포맷 (신규): DOMPurify 클라이언트 sanitize + dangerouslySetInnerHTML
 *   BE에서 sanitize-html로 1차 처리된 콘텐츠를 프론트에서 추가 방어합니다.
 * - Markdown 포맷 (하위 호환): react-markdown + rehype-sanitize 파이프라인
 */
export const CommunityPostDetailContent = ({
  content,
  className = '',
}: CommunityPostDetailContentProps) => {
  const isHtml = isHtmlContent(content);

  const sanitizedHtml = useMemo(() => {
    if (!isHtml) return null;
    return DOMPurify.sanitize(content);
  }, [isHtml, content]);

  const normalizedMarkdown = useMemo(() => {
    if (isHtml) return null;
    return normalizeCommunityPostContentForRender(content);
  }, [isHtml, content]);

  const baseClass = cn(
    COMMUNITY_DETAIL_READING_TEXT_CLASS,
    COMMUNITY_DETAIL_BODY_PROSE_CLASS,
    'px-1.5',
    className,
  );

  if (isHtml && sanitizedHtml !== null) {
    return (
      <div
        className={cn(baseClass, '[&_p+p]:mt-2')}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    );
  }

  return (
    <div className={cn(COMMUNITY_DETAIL_BODY_MARKDOWN_CLASS, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeSanitize]}
      >
        {normalizedMarkdown ?? ''}
      </ReactMarkdown>
    </div>
  );
};
