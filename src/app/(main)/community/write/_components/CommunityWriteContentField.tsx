'use client';

import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_CONTENT_TEXTAREA_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_TOOLBAR_CLASS,
} from './communityWriteStyles';

const TOOLBAR_ITEMS = ['B', 'I', 'H1', 'H2', '≡', '🔗', '🖼'] as const;

interface CommunityWriteContentFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** 게시글 본문 — 툴바 + textarea (Figma 15211:41894–41903) */
export const CommunityWriteContentField = ({
  value,
  onChange,
  className = '',
}: CommunityWriteContentFieldProps) => (
  <section className={className}>
    <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>내용</h2>

    <div className="mt-2.5">
      <div
        className={COMMUNITY_WRITE_TOOLBAR_CLASS}
        role="toolbar"
        aria-label="본문 서식"
      >
        {TOOLBAR_ITEMS.map((item) => (
          <button
            key={item}
            type="button"
            aria-label={`서식 ${item}`}
            className={cn(
              'cursor-pointer text-sm-semibold text-gray-400',
              item === 'B' && 'font-bold',
              item === 'I' && 'italic'
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="sr-only" htmlFor="community-write-content">
        게시글 내용
      </label>
      <textarea
        id="community-write-content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="내용을 입력해 주세요."
        className={COMMUNITY_WRITE_CONTENT_TEXTAREA_CLASS}
      />
    </div>
  </section>
);
