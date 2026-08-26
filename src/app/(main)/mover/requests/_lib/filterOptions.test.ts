import { describe, expect, it } from 'vitest';

import { toggleFilterItem } from './filterOptions';

describe('toggleFilterItem', () => {
  it('checked이면 항목을 추가한다', () => {
    expect(toggleFilterItem(['small'], 'home', true)).toEqual([
      'small',
      'home',
    ]);
  });

  it('이미 있으면 중복 추가하지 않는다', () => {
    expect(toggleFilterItem(['small', 'home'], 'home', true)).toEqual([
      'small',
      'home',
    ]);
  });

  it('unchecked이면 항목을 제거한다', () => {
    expect(toggleFilterItem(['small', 'home', 'office'], 'home', false)).toEqual(
      ['small', 'office']
    );
  });

  it('없는 항목을 unchecked해도 그대로 둔다', () => {
    expect(toggleFilterItem(['small'], 'home', false)).toEqual(['small']);
  });
});
