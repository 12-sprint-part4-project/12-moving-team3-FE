import { describe, expect, it } from 'vitest';

import {
  SORT_VALUE_TO_API,
  isApiMoveType,
  isApiRegion,
  isMoversSortValue,
} from './mover';

describe('SORT_VALUE_TO_API', () => {
  it('FE 정렬 값을 BE sort 필드로 매핑한다', () => {
    expect(SORT_VALUE_TO_API.reviewCountDesc).toBe('reviewCount');
    expect(SORT_VALUE_TO_API.ratingDesc).toBe('averageRating');
    expect(SORT_VALUE_TO_API.careerDesc).toBe('career');
    expect(SORT_VALUE_TO_API.confirmedCountDesc).toBe('confirmedCount');
  });
});

describe('isMoversSortValue', () => {
  it('목록 정렬 4종만 true를 반환한다', () => {
    expect(isMoversSortValue('reviewCountDesc')).toBe(true);
    expect(isMoversSortValue('ratingDesc')).toBe(true);
    expect(isMoversSortValue('careerDesc')).toBe(true);
    expect(isMoversSortValue('confirmedCountDesc')).toBe(true);
  });

  it('알 수 없는 값은 false를 반환한다', () => {
    expect(isMoversSortValue('reviewCount')).toBe(false);
    expect(isMoversSortValue('')).toBe(false);
  });
});

describe('isApiRegion', () => {
  it('유효한 지역 enum은 true를 반환한다', () => {
    expect(isApiRegion('SEOUL')).toBe(true);
    expect(isApiRegion('BUSAN')).toBe(true);
  });

  it('ALL·잘못된 값은 false를 반환한다', () => {
    expect(isApiRegion('ALL')).toBe(false);
    expect(isApiRegion('INVALID')).toBe(false);
  });
});

describe('isApiMoveType', () => {
  it('유효한 서비스 enum은 true를 반환한다', () => {
    expect(isApiMoveType('SMALL')).toBe(true);
    expect(isApiMoveType('HOME')).toBe(true);
    expect(isApiMoveType('OFFICE')).toBe(true);
  });

  it('ALL·잘못된 값은 false를 반환한다', () => {
    expect(isApiMoveType('ALL')).toBe(false);
    expect(isApiMoveType('INVALID')).toBe(false);
  });
});
