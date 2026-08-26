import { describe, expect, it } from 'vitest';

import {
  buildReceivedEstimateRequestsQuery,
  formatDistrictLabel,
  formatLocationLabel,
  toMoveTypeFilterCounts,
  toReceivedRequestCardModel,
  toScopeFilterCounts,
} from './estimateRequestApi';

import type { EstimateRequestListItem } from '@/types/estimateRequest';

const parseQuery = (query: string): Record<string, string> => {
  const normalized = query.startsWith('?') ? query.slice(1) : query;
  return Object.fromEntries(new URLSearchParams(normalized).entries());
};

const createListItem = (
  overrides: Partial<EstimateRequestListItem> = {}
): EstimateRequestListItem => ({
  id: 1,
  customer: {
    id: '11111111-1111-4111-8111-111111111111',
    name: '김고객',
  },
  moveType: 'HOME',
  moveDate: '2026-08-15',
  departure: {
    address: '서울특별시 강남구 테헤란로 1',
    regionLabel: '서울',
  },
  arrival: {
    address: '경기도 성남시 분당구 판교로 2',
    regionLabel: '경기',
  },
  isDesignated: false,
  designatedMoverId: null,
  submittedAt: '2026-08-01T00:00:00.000Z',
  quoteCount: {
    designated: 1,
    general: 2,
  },
  ...overrides,
});

describe('formatDistrictLabel', () => {
  it('주소 앞 2토큰으로 시·군·구 라벨을 만든다', () => {
    expect(formatDistrictLabel('서울특별시 강남구 테헤란로 1')).toBe(
      '서울특별시 강남구'
    );
  });

  it('토큰이 하나면 그대로 반환한다', () => {
    expect(formatDistrictLabel('서울')).toBe('서울');
  });

  it('없거나 공백이면 null을 반환한다', () => {
    expect(formatDistrictLabel(null)).toBeNull();
    expect(formatDistrictLabel(undefined)).toBeNull();
    expect(formatDistrictLabel('   ')).toBeNull();
  });
});

describe('formatLocationLabel', () => {
  it('주소가 있으면 구 단위 라벨을 우선한다', () => {
    expect(
      formatLocationLabel({
        address: '서울특별시 강남구 테헤란로 1',
        regionLabel: '서울',
      })
    ).toBe('서울특별시 강남구');
  });

  it('주소가 없으면 regionLabel을 사용한다', () => {
    expect(
      formatLocationLabel({
        address: null,
        regionLabel: '부산',
      })
    ).toBe('부산');
  });

  it('둘 다 없으면 -를 반환한다', () => {
    expect(formatLocationLabel({ address: null, regionLabel: null })).toBe(
      '-'
    );
  });
});

describe('toReceivedRequestCardModel', () => {
  it('받은 요청 BE 아이템을 카드 UI 모델로 변환한다', () => {
    expect(toReceivedRequestCardModel(createListItem())).toMatchObject({
      id: 1,
      customerName: '김고객',
      moveType: 'home',
      isDesignated: false,
      designatedMoverId: null,
      moveDate: expect.stringMatching(/2026/),
      departure: '서울특별시 강남구',
      arrival: '경기도 성남시',
      quoteCount: { designated: 1, general: 2 },
      requestedAgo: expect.any(String),
    });
  });

  it('moveType·submittedAt·quoteCount가 없으면 기본값을 사용한다', () => {
    expect(
      toReceivedRequestCardModel(
        createListItem({
          moveType: null,
          submittedAt: null,
          quoteCount: undefined,
          departure: { address: null, regionLabel: null },
          arrival: { address: null, regionLabel: '경기' },
          isDesignated: true,
          designatedMoverId: 9,
        })
      )
    ).toMatchObject({
      moveType: null,
      requestedAgo: '',
      departure: '-',
      arrival: '경기',
      quoteCount: { designated: 0, general: 0 },
      isDesignated: true,
      designatedMoverId: 9,
    });
  });
});

describe('toMoveTypeFilterCounts / toScopeFilterCounts', () => {
  it('BE 건수를 UI 필터 건수로 변환한다', () => {
    expect(
      toMoveTypeFilterCounts({ SMALL: 1, HOME: 2, OFFICE: 3 })
    ).toEqual({
      small: 1,
      home: 2,
      office: 3,
    });

    expect(
      toScopeFilterCounts({ serviceAreaOnly: 4, designated: 5 })
    ).toEqual({
      serviceArea: 4,
      designated: 5,
    });
  });
});

describe('buildReceivedEstimateRequestsQuery', () => {
  it('기본 정렬만 있으면 sort 쿼리를 포함한다', () => {
    expect(parseQuery(buildReceivedEstimateRequestsQuery({}))).toEqual({
      sort: 'MOVE_DATE_ASC',
    });
  });

  it('keyword를 trim한 뒤 포함한다', () => {
    expect(
      parseQuery(buildReceivedEstimateRequestsQuery({ keyword: '  김  ' }))
    ).toMatchObject({
      keyword: '김',
      sort: 'MOVE_DATE_ASC',
    });
  });

  it('이사 유형 부분 선택만 moveType을 전달한다', () => {
    expect(
      parseQuery(
        buildReceivedEstimateRequestsQuery({
          moveTypes: ['home', 'small'],
        })
      )
    ).toMatchObject({
      moveType: 'HOME,SMALL',
    });

    expect(
      parseQuery(
        buildReceivedEstimateRequestsQuery({
          moveTypes: ['small', 'home', 'office'],
        })
      ).moveType
    ).toBeUndefined();

    expect(
      parseQuery(buildReceivedEstimateRequestsQuery({ moveTypes: [] })).moveType
    ).toBeUndefined();
  });

  it('범위 선택에 따라 serviceArea·designated 플래그를 전달한다', () => {
    expect(
      parseQuery(
        buildReceivedEstimateRequestsQuery({
          scopes: ['serviceArea', 'designated'],
        })
      )
    ).toMatchObject({
      serviceArea: 'true',
      designated: 'true',
    });

    expect(
      parseQuery(
        buildReceivedEstimateRequestsQuery({ scopes: ['designated'] })
      )
    ).toMatchObject({
      designated: 'true',
    });
    expect(
      parseQuery(buildReceivedEstimateRequestsQuery({ scopes: ['designated'] }))
        .serviceArea
    ).toBeUndefined();
  });

  it('sort·cursor·limit를 함께 전달한다', () => {
    expect(
      parseQuery(
        buildReceivedEstimateRequestsQuery({
          sort: 'requestDateAsc',
          cursor: 'cursor-token',
          limit: 10,
        })
      )
    ).toEqual({
      sort: 'SUBMITTED_AT_ASC',
      cursor: 'cursor-token',
      limit: '10',
    });
  });
});
