import { describe, expect, it } from 'vitest';

import {
  buildCommunityListHref,
  buildCommunityPostDetailHref,
  buildCommunityWriteHref,
  DEFAULT_POST_LIST_CONTEXT,
  getTabFromPostCategory,
  parsePostListContextFromSearchParams,
  postListContextToParams,
} from './communityListContext';

describe('getTabFromPostCategory', () => {
  it('FURNITURE_SHARE → furniture', () => {
    expect(getTabFromPostCategory('FURNITURE_SHARE')).toBe('furniture');
  });

  it('나머지 카테고리 → board', () => {
    expect(getTabFromPostCategory('MOVING_TIP')).toBe('board');
    expect(getTabFromPostCategory('QUESTION')).toBe('board');
    expect(getTabFromPostCategory('REVIEW')).toBe('board');
    expect(getTabFromPostCategory('ETC')).toBe('board');
  });
});

describe('postListContextToParams', () => {
  it('furniture 탭이면 category를 FURNITURE_SHARE로 고정', () => {
    const result = postListContextToParams({
      ...DEFAULT_POST_LIST_CONTEXT,
      tab: 'furniture',
      categoryFilter: 'ALL',
    });
    expect(result.category).toBe('FURNITURE_SHARE');
  });

  it('board 탭 + categoryFilter ALL이면 category undefined', () => {
    const result = postListContextToParams({
      ...DEFAULT_POST_LIST_CONTEXT,
      tab: 'board',
      categoryFilter: 'ALL',
    });
    expect(result.category).toBeUndefined();
  });

  it('board 탭 + 특정 카테고리이면 해당 카테고리 반환', () => {
    const result = postListContextToParams({
      ...DEFAULT_POST_LIST_CONTEXT,
      tab: 'board',
      categoryFilter: 'MOVING_TIP',
    });
    expect(result.category).toBe('MOVING_TIP');
  });

  it('regionFilter ALL이면 region undefined', () => {
    const result = postListContextToParams({
      ...DEFAULT_POST_LIST_CONTEXT,
      regionFilter: 'ALL',
    });
    expect(result.region).toBeUndefined();
  });

  it('keyword와 hideCompleted가 그대로 전달됨', () => {
    const result = postListContextToParams({
      ...DEFAULT_POST_LIST_CONTEXT,
      keyword: '이사',
      hideCompleted: true,
    });
    expect(result.keyword).toBe('이사');
    expect(result.hideCompleted).toBe(true);
  });
});

describe('buildCommunityListHref', () => {
  it('기본 컨텍스트면 /community 반환', () => {
    expect(buildCommunityListHref(DEFAULT_POST_LIST_CONTEXT)).toBe('/community');
  });

  it('furniture 탭이면 tab 쿼리 포함', () => {
    const href = buildCommunityListHref({
      ...DEFAULT_POST_LIST_CONTEXT,
      tab: 'furniture',
    });
    expect(href).toContain('tab=furniture');
  });

  it('keyword 있으면 keyword 쿼리 포함', () => {
    const href = buildCommunityListHref({
      ...DEFAULT_POST_LIST_CONTEXT,
      keyword: '이사',
    });
    expect(href).toContain('keyword=%EC%9D%B4%EC%82%AC');
  });

  it('LATEST 정렬은 sort 쿼리 미포함', () => {
    const href = buildCommunityListHref({
      ...DEFAULT_POST_LIST_CONTEXT,
      sort: 'LATEST',
    });
    expect(href).not.toContain('sort=');
  });

  it('LATEST 외 정렬은 sort 쿼리 포함', () => {
    const href = buildCommunityListHref({
      ...DEFAULT_POST_LIST_CONTEXT,
      sort: 'POPULAR',
    });
    expect(href).toContain('sort=POPULAR');
  });
});

describe('buildCommunityPostDetailHref', () => {
  it('기본 컨텍스트면 /community/:id 반환', () => {
    expect(buildCommunityPostDetailHref(42)).toBe('/community/42');
  });

  it('컨텍스트 있으면 쿼리 포함', () => {
    const href = buildCommunityPostDetailHref(42, {
      ...DEFAULT_POST_LIST_CONTEXT,
      sort: 'POPULAR',
    });
    expect(href).toBe('/community/42?sort=POPULAR');
  });
});

describe('buildCommunityWriteHref', () => {
  it('board 탭이면 /community/write 반환', () => {
    expect(buildCommunityWriteHref('board')).toBe('/community/write');
  });

  it('furniture 탭이면 tab=furniture 쿼리 포함', () => {
    expect(buildCommunityWriteHref('furniture')).toBe(
      '/community/write?tab=furniture'
    );
  });
});

describe('parsePostListContextFromSearchParams', () => {
  const makeParams = (obj: Record<string, string>) => ({
    get: (key: string) => obj[key] ?? null,
  });

  it('빈 파라미터면 기본 컨텍스트 반환', () => {
    const result = parsePostListContextFromSearchParams(makeParams({}));
    expect(result).toEqual(DEFAULT_POST_LIST_CONTEXT);
  });

  it('tab=furniture 파싱', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ tab: 'furniture' })
    );
    expect(result.tab).toBe('furniture');
  });

  it('sort 파싱', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ sort: 'POPULAR' })
    );
    expect(result.sort).toBe('POPULAR');
  });

  it('유효하지 않은 sort면 기본값 LATEST', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ sort: 'INVALID' })
    );
    expect(result.sort).toBe('LATEST');
  });

  it('keyword 파싱 및 trim', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ keyword: '  이사  ' })
    );
    expect(result.keyword).toBe('이사');
  });

  it('빈 keyword는 undefined', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ keyword: '   ' })
    );
    expect(result.keyword).toBeUndefined();
  });

  it('furniture 탭 + hideCompleted=true 파싱', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ tab: 'furniture', hideCompleted: 'true' })
    );
    expect(result.hideCompleted).toBe(true);
  });

  it('board 탭에서는 hideCompleted 무시', () => {
    const result = parsePostListContextFromSearchParams(
      makeParams({ tab: 'board', hideCompleted: 'true' })
    );
    expect(result.hideCompleted).toBeUndefined();
  });
});
