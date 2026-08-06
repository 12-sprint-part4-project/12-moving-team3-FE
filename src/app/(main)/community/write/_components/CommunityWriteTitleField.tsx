'use client';

import { MAX_POST_TITLE_LENGTH } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_HINT_CLASS,
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_LABEL_ROW_CLASS,
  COMMUNITY_WRITE_TITLE_COUNTER_CLASS,
  COMMUNITY_WRITE_TITLE_ERROR_CLASS,
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
}: CommunityWriteTitleFieldProps) => {
  const isOverLimit = value.length > MAX_POST_TITLE_LENGTH;

  return (
    <section className={className}>
      <div className={COMMUNITY_WRITE_LABEL_ROW_CLASS}>
        <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>제목</h2>
        <p className={COMMUNITY_WRITE_HINT_CLASS}>
          {MAX_POST_TITLE_LENGTH}자 이내
        </p>
      </div>
      <label className="sr-only" htmlFor="community-write-title">
        게시글 제목
      </label>
      <input
        id="community-write-title"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="제목을 입력해 주세요."
        aria-invalid={isOverLimit}
        aria-describedby={
          isOverLimit
            ? 'community-write-title-counter community-write-title-error'
            : 'community-write-title-counter'
        }
        className={cn(
          COMMUNITY_WRITE_TITLE_INPUT_CLASS,
          'mt-2.5',
          isOverLimit && 'border-red-200'
        )}
      />
      <p
        id="community-write-title-counter"
        className={cn(
          COMMUNITY_WRITE_TITLE_COUNTER_CLASS,
          isOverLimit && 'text-red-200'
        )}
        aria-live="polite"
      >
        {value.length}/{MAX_POST_TITLE_LENGTH}
      </p>
      {isOverLimit ? (
        <p
          id="community-write-title-error"
          role="alert"
          className={COMMUNITY_WRITE_TITLE_ERROR_CLASS}
        >
          제목은 {MAX_POST_TITLE_LENGTH}자 이내로 입력해 주세요.
        </p>
      ) : null}
    </section>
  );
};
