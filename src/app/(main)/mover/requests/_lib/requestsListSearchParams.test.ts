import { describe, expect, it } from 'vitest';

import {
  DEFAULT_REQUESTS_LIST_URL_STATE,
  buildRequestsListHref,
  buildRequestsListSearchParams,
  isDefaultRequestsListUrlState,
  isRequestsSortValue,
  parseFocusRequestId,
  parseRequestsListSearchParams,
  parseRequestsListSearchParamsRecord,
  resolveRequestsListSearchParam,
} from './requestsListSearchParams';

import type { RequestsListUrlState } from './requestsListSearchParams';

const parseQuery = (params: URLSearchParams): Record<string, string> =>
  Object.fromEntries(params.entries());

describe('isRequestsSortValue', () => {
  it('지원하는 정렬 값만 true를 반환한다', () => {
    expect(isRequestsSortValue('moveDateAsc')).toBe(true);
    expect(isRequestsSortValue('requestDateAsc')).toBe(true);
  });

  it('알 수 없는 값은 false를 반환한다', () => {
    expect(isRequestsSortValue('moveDateDesc')).toBe(false);
    expect(isRequestsSortValue('')).toBe(false);
  });
});

describe('isDefaultRequestsListUrlState', () => {
  it('기본 상태면 true를 반환한다', () => {
    expect(isDefaultRequestsListUrlState(DEFAULT_REQUESTS_LIST_URL_STATE)).toBe(
      true
    );
  });

  it('keyword·sort·필터가 바뀌면 false를 반환한다', () => {
    expect(
      isDefaultRequestsListUrlState({
        ...DEFAULT_REQUESTS_LIST_URL_STATE,
        keyword: '김',
      })
    ).toBe(false);
    expect(
      isDefaultRequestsListUrlState({
        ...DEFAULT_REQUESTS_LIST_URL_STATE,
        sort: 'requestDateAsc',
      })
    ).toBe(false);
    expect(
      isDefaultRequestsListUrlState({
        ...DEFAULT_REQUESTS_LIST_URL_STATE,
        moveTypes: ['home'],
      })
    ).toBe(false);
    expect(
      isDefaultRequestsListUrlState({
        ...DEFAULT_REQUESTS_LIST_URL_STATE,
        scopes: ['designated'],
      })
    ).toBe(false);
  });
});

describe('parseRequestsListSearchParams', () => {
  it('파라미터가 없으면 기본 상태를 반환한다', () => {
    expect(parseRequestsListSearchParams(new URLSearchParams())).toEqual(
      DEFAULT_REQUESTS_LIST_URL_STATE
    );
  });

  it('keyword·sort·부분 필터를 파싱한다', () => {
    const params = new URLSearchParams({
      keyword: '  김고객  ',
      moveTypes: 'home,small',
      scopes: 'designated',
      sort: 'requestDateAsc',
    });

    expect(parseRequestsListSearchParams(params)).toEqual({
      keyword: '김고객',
      moveTypes: ['home', 'small'],
      scopes: ['designated'],
      sort: 'requestDateAsc',
    });
  });

  it('moveTypes·scopes가 none이면 빈 배열을 반환한다', () => {
    const params = new URLSearchParams({
      moveTypes: 'none',
      scopes: 'none',
    });

    expect(parseRequestsListSearchParams(params)).toMatchObject({
      moveTypes: [],
      scopes: [],
    });
  });

  it('잘못된 sort면 기본 정렬을 사용한다', () => {
    expect(
      parseRequestsListSearchParams(
        new URLSearchParams({ sort: 'invalid' })
      ).sort
    ).toBe('moveDateAsc');
  });

  it('잘못된 옵션 값만 있으면 전체 옵션으로 대체한다', () => {
    expect(
      parseRequestsListSearchParams(
        new URLSearchParams({ moveTypes: 'invalid', scopes: 'bad' })
      )
    ).toMatchObject({
      moveTypes: ['small', 'home', 'office'],
      scopes: ['serviceArea', 'designated'],
    });
  });
});

describe('resolveRequestsListSearchParam', () => {
  it('문자열·배열·undefined를 단일 문자열로 정규화한다', () => {
    expect(resolveRequestsListSearchParam('home')).toBe('home');
    expect(resolveRequestsListSearchParam(['home', 'office'])).toBe('home');
    expect(resolveRequestsListSearchParam([])).toBeNull();
    expect(resolveRequestsListSearchParam(undefined)).toBeNull();
  });
});

describe('parseRequestsListSearchParamsRecord', () => {
  it('서버 searchParams 레코드를 URL 상태로 변환한다', () => {
    expect(
      parseRequestsListSearchParamsRecord({
        keyword: '박',
        moveTypes: 'office',
        scopes: ['serviceArea'],
        sort: 'requestDateAsc',
      })
    ).toEqual({
      keyword: '박',
      moveTypes: ['office'],
      scopes: ['serviceArea'],
      sort: 'requestDateAsc',
    });
  });
});

describe('buildRequestsListSearchParams / buildRequestsListHref', () => {
  it('기본 상태는 쿼리 없이 /mover/requests를 반환한다', () => {
    expect(buildRequestsListHref(DEFAULT_REQUESTS_LIST_URL_STATE)).toBe(
      '/mover/requests'
    );
    expect(
      parseQuery(buildRequestsListSearchParams(DEFAULT_REQUESTS_LIST_URL_STATE))
    ).toEqual({});
  });

  it('변경된 값만 쿼리에 포함한다', () => {
    const state: RequestsListUrlState = {
      keyword: '  이사  ',
      moveTypes: ['home'],
      scopes: [],
      sort: 'requestDateAsc',
    };

    expect(parseQuery(buildRequestsListSearchParams(state))).toEqual({
      keyword: '이사',
      moveTypes: 'home',
      scopes: 'none',
      sort: 'requestDateAsc',
    });
    expect(buildRequestsListHref(state)).toBe(
      '/mover/requests?keyword=%EC%9D%B4%EC%82%AC&moveTypes=home&scopes=none&sort=requestDateAsc'
    );
  });

  it('전체 필터면 moveTypes·scopes를 생략한다', () => {
    expect(
      parseQuery(
        buildRequestsListSearchParams({
          keyword: '',
          moveTypes: ['small', 'home', 'office'],
          scopes: ['serviceArea', 'designated'],
          sort: 'moveDateAsc',
        })
      )
    ).toEqual({});
  });
});

describe('parseFocusRequestId', () => {
  it('양수 id면 숫자로 반환한다', () => {
    expect(parseFocusRequestId('42')).toBe(42);
    expect(parseFocusRequestId(['7'])).toBe(7);
  });

  it('없거나 잘못된 값이면 null을 반환한다', () => {
    expect(parseFocusRequestId(undefined)).toBeNull();
    expect(parseFocusRequestId('0')).toBeNull();
    expect(parseFocusRequestId('-1')).toBeNull();
    expect(parseFocusRequestId('abc')).toBeNull();
  });
});
