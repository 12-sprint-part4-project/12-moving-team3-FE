'use client';

import { MAX_POST_TITLE_LENGTH } from '@/constants/communityOptions';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_WRITE_LABEL_CLASS,
  COMMUNITY_WRITE_LABEL_ROW_CLASS,
  COMMUNITY_WRITE_TITLE_COUNTER_CLASS,
  COMMUNITY_WRITE_TITLE_FIELD_WRAPPER_CLASS,
  COMMUNITY_WRITE_TITLE_HINT_CLASS,
  COMMUNITY_WRITE_TITLE_INPUT_CLASS,
  COMMUNITY_WRITE_TITLE_INPUT_READONLY_CLASS,
} from './communityWriteStyles';

interface CommunityWriteTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
}

/** 게시글 작성 제목 입력 */
export const CommunityWriteTitleField = ({
  value,
  onChange,
  readOnly = false,
  className = '',
}: CommunityWriteTitleFieldProps) => {
  const isAtTitleLimit = !readOnly && value.length >= MAX_POST_TITLE_LENGTH;

  return (
  <section className={className}>
    <div className={COMMUNITY_WRITE_LABEL_ROW_CLASS}>
      <h2 className={COMMUNITY_WRITE_LABEL_CLASS}>제목</h2>
      {isAtTitleLimit ? (
        <p
          id="community-write-title-limit-hint"
          className={COMMUNITY_WRITE_TITLE_HINT_CLASS}
        >
          제목은 최대 {MAX_POST_TITLE_LENGTH}자까지 입력할 수 있어요.
        </p>
      ) : null}
    </div>
    <div className={COMMUNITY_WRITE_TITLE_FIELD_WRAPPER_CLASS}>
      <label className="sr-only" htmlFor="community-write-title">
        게시글 제목
      </label>
      <input
        id="community-write-title"
        type="text"
        value={value}
        readOnly={readOnly}
        maxLength={readOnly ? undefined : MAX_POST_TITLE_LENGTH}
        onChange={
          readOnly
            ? undefined
            : (event) =>
                onChange(event.target.value.slice(0, MAX_POST_TITLE_LENGTH))
        }
        placeholder={readOnly ? undefined : '제목을 입력해 주세요.'}
        aria-readonly={readOnly}
        aria-describedby={
          readOnly
            ? undefined
            : isAtTitleLimit
              ? 'community-write-title-counter community-write-title-limit-hint'
              : 'community-write-title-counter'
        }
        className={cn(
          COMMUNITY_WRITE_TITLE_INPUT_CLASS,
          readOnly && COMMUNITY_WRITE_TITLE_INPUT_READONLY_CLASS
        )}
      />
      {readOnly ? null : (
        <p
          id="community-write-title-counter"
          className={COMMUNITY_WRITE_TITLE_COUNTER_CLASS}
          aria-live="polite"
        >
          {value.length}/{MAX_POST_TITLE_LENGTH}
        </p>
      )}
    </div>
  </section>
  );
};
