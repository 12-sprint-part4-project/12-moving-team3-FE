'use client';

import { useMemo } from 'react';

import { sanitizeCommunityPostHtml } from '@/lib/sanitizeCommunityPostHtml';
import { cn } from '@/lib/utils';

import { COMMUNITY_DETAIL_BODY_HTML_CLASS } from './communityDetailStyles';

interface CommunityPostDetailContentProps {
  content: string;
  className?: string;
}

/** 게시글 상세 본문 — sanitize된 HTML 렌더 */
export const CommunityPostDetailContent = ({
  content,
  className = '',
}: CommunityPostDetailContentProps) => {
  const sanitizedHtml = useMemo(
    () => sanitizeCommunityPostHtml(content),
    [content]
  );

  return (
    <div
      className={cn(COMMUNITY_DETAIL_BODY_HTML_CLASS, className)}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};
