'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

import { normalizeCommunityPostContentForRender } from '@/lib/stripCommunityPostMarkdown';
import { cn } from '@/lib/utils';

import { COMMUNITY_DETAIL_BODY_MARKDOWN_CLASS } from './communityDetailStyles';

interface CommunityPostDetailContentProps {
  content: string;
  className?: string;
}

/** 게시글 상세 본문 — 마크다운 렌더 */
export const CommunityPostDetailContent = ({
  content,
  className = '',
}: CommunityPostDetailContentProps) => {
  const normalizedContent = useMemo(
    () => normalizeCommunityPostContentForRender(content),
    [content]
  );

  return (
    <div className={cn(COMMUNITY_DETAIL_BODY_MARKDOWN_CLASS, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        rehypePlugins={[rehypeSanitize]}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
