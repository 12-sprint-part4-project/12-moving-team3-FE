import { describe, expect, it } from 'vitest';

import {
  formatReviewCreatedDate,
  formatReviewMoveDate,
  getReviewScoreBreakdown,
  getReviewStatsTotalCount,
} from './reviewDisplay';

describe('formatReviewCreatedDate', () => {
  it('유효한 ISO datetime을 YYYY-MM-DD로 변환한다', () => {
    expect(formatReviewCreatedDate('2024-07-01T12:00:00.000Z')).toBe(
      '2024-07-01'
    );
  });

  it('잘못된 날짜면 -를 반환한다', () => {
    expect(formatReviewCreatedDate('not-a-date')).toBe('-');
  });
});

describe('formatReviewMoveDate', () => {
  it('YYYY-MM-DD를 점 구분 형식으로 변환한다', () => {
    expect(formatReviewMoveDate('2024-07-01')).toBe('2024. 07. 01');
  });

  it('datetime 문자열이면 앞 10자만 사용한다', () => {
    expect(formatReviewMoveDate('2024-12-25T00:00:00.000Z')).toBe(
      '2024. 12. 25'
    );
  });

  it('null·빈 값이면 -를 반환한다', () => {
    expect(formatReviewMoveDate(null)).toBe('-');
    expect(formatReviewMoveDate('')).toBe('-');
  });

  it('형식이 깨진 값이면 -를 반환한다', () => {
    expect(formatReviewMoveDate('2024')).toBe('-');
  });
});

describe('getReviewScoreBreakdown', () => {
  it('5점부터 1점 순으로 분포를 만들고 최다 점수에 isMajority를 표시한다', () => {
    expect(
      getReviewScoreBreakdown({
        average: 4.2,
        five: 10,
        four: 3,
        three: 1,
        two: 0,
        one: 0,
      })
    ).toEqual([
      { score: 5, count: 10, isMajority: true },
      { score: 4, count: 3, isMajority: false },
      { score: 3, count: 1, isMajority: false },
      { score: 2, count: 0, isMajority: false },
      { score: 1, count: 0, isMajority: false },
    ]);
  });

  it('최다 점수가 여러 개면 모두 isMajority이다', () => {
    const items = getReviewScoreBreakdown({
      average: 3,
      five: 2,
      four: 2,
      three: 1,
      two: 0,
      one: 0,
    });

    expect(items.filter((item) => item.isMajority).map((item) => item.score)).toEqual(
      [5, 4]
    );
  });

  it('전부 0이면 isMajority는 모두 false이다', () => {
    expect(
      getReviewScoreBreakdown({
        average: 0,
        five: 0,
        four: 0,
        three: 0,
        two: 0,
        one: 0,
      }).every((item) => item.isMajority === false)
    ).toBe(true);
  });
});

describe('getReviewStatsTotalCount', () => {
  it('five~one 합계를 반환한다', () => {
    expect(
      getReviewStatsTotalCount({
        average: 4,
        five: 5,
        four: 4,
        three: 3,
        two: 2,
        one: 1,
      })
    ).toBe(15);
  });
});
