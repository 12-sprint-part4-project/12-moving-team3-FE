import { describe, expect, it } from 'vitest';

import { isReviewListEmpty } from './isReviewListEmpty';

describe('isReviewListEmpty', () => {
  it('pending이면 false를 반환한다', () => {
    expect(
      isReviewListEmpty({
        isPending: true,
        isError: false,
        isEmpty: true,
      })
    ).toBe(false);
  });

  it('error면 false를 반환한다', () => {
    expect(
      isReviewListEmpty({
        isPending: false,
        isError: true,
        isEmpty: true,
      })
    ).toBe(false);
  });

  it('isEmpty이면 true를 반환한다', () => {
    expect(
      isReviewListEmpty({
        isPending: false,
        isError: false,
        isEmpty: true,
      })
    ).toBe(true);
  });

  it('pagination.totalCount가 0이면 true를 반환한다', () => {
    expect(
      isReviewListEmpty({
        isPending: false,
        isError: false,
        isEmpty: false,
        pagination: { totalCount: 0 },
      })
    ).toBe(true);
  });

  it('데이터가 있으면 false를 반환한다', () => {
    expect(
      isReviewListEmpty({
        isPending: false,
        isError: false,
        isEmpty: false,
        pagination: { totalCount: 3 },
      })
    ).toBe(false);
  });
});
