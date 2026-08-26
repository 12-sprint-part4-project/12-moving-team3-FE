import { describe, expect, it } from 'vitest';

import { isReviewFormValid } from './ReviewFormFields';
import {
  MAX_REVIEW_CONTENT_LENGTH,
  MIN_REVIEW_CONTENT_LENGTH,
} from '@/types/review';

describe('isReviewFormValid', () => {
  it('평점과 본문 길이가 유효하면 true를 반환한다', () => {
    expect(
      isReviewFormValid({
        rating: 5,
        content: 'a'.repeat(MIN_REVIEW_CONTENT_LENGTH),
      })
    ).toBe(true);
  });

  it('평점이 0 이하면 false를 반환한다', () => {
    expect(
      isReviewFormValid({
        rating: 0,
        content: 'a'.repeat(MIN_REVIEW_CONTENT_LENGTH),
      })
    ).toBe(false);
  });

  it('본문이 최소 길이 미만이면 false를 반환한다', () => {
    expect(
      isReviewFormValid({
        rating: 4,
        content: 'a'.repeat(MIN_REVIEW_CONTENT_LENGTH - 1),
      })
    ).toBe(false);
  });

  it('앞뒤 공백을 trim한 길이로 검사한다', () => {
    expect(
      isReviewFormValid({
        rating: 3,
        content: `  ${'a'.repeat(MIN_REVIEW_CONTENT_LENGTH - 1)}  `,
      })
    ).toBe(false);

    expect(
      isReviewFormValid({
        rating: 3,
        content: `  ${'a'.repeat(MIN_REVIEW_CONTENT_LENGTH)}  `,
      })
    ).toBe(true);
  });

  it('본문이 최대 길이를 넘으면 false를 반환한다', () => {
    expect(
      isReviewFormValid({
        rating: 5,
        content: 'a'.repeat(MAX_REVIEW_CONTENT_LENGTH + 1),
      })
    ).toBe(false);
  });
});
