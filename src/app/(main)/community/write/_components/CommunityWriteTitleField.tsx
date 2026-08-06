'use client';

import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_TITLE_INPUT_CLASS,
} from './communityWriteStyles';

interface CommunityWriteTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** 게시글 작성 제목 입력 */
export const CommunityWriteTitleField = ({
  value,
  onChange,
  className = '',
}: CommunityWriteTitleFieldProps) => (
  <section className={className}>
    <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>제목</h2>
    <label className="sr-only" htmlFor="community-write-title">
      게시글 제목
    </label>
    <input
      id="community-write-title"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="제목을 입력해 주세요."
      className={cn(COMMUNITY_WRITE_TITLE_INPUT_CLASS, 'mt-2.5')}
    />
  </section>
);
