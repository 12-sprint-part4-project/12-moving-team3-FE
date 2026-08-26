import { describe, expect, it } from 'vitest';

import {
  buildFavoriteMoversQuery,
  buildMoversListQuery,
  toMoverCardModelFromDetail,
  toMoverCardModelFromFavorite,
  toMoverCardModelFromListItem,
} from './moversApi';

import type {
  FavoriteMoverListItem,
  MoverDetailData,
  MoverListItem,
} from '@/types/mover';

const parseQuery = (query: string): Record<string, string> => {
  const normalized = query.startsWith('?') ? query.slice(1) : query;
  return Object.fromEntries(new URLSearchParams(normalized).entries());
};

const createListItem = (
  overrides: Partial<MoverListItem> = {}
): MoverListItem => ({
  id: 1,
  userId: 'user-uuid',
  service: ['HOME'],
  career: 5,
  description: '상세 소개',
  shortDescription: '한줄 소개',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    name: '김기사',
    profileImageUrl: 'https://example.com/profile.jpg',
  },
  serviceRegions: [{ id: 1, region: 'SEOUL' }],
  review: {
    totalCount: 10,
    averageRating: 4.5,
    ratingCounts: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 6 },
  },
  isFavorited: false,
  ...overrides,
});

describe('buildMoversListQuery', () => {
  it('파라미터가 없으면 sort=reviewCount만 포함한다', () => {
    expect(parseQuery(buildMoversListQuery({}))).toEqual({
      sort: 'reviewCount',
    });
  });

  it('keyword를 trim한 뒤 쿼리에 포함한다', () => {
    expect(
      parseQuery(buildMoversListQuery({ keyword: '  친절한  ' }))
    ).toMatchObject({
      keyword: '친절한',
      sort: 'reviewCount',
    });
  });

  it('keyword가 공백만이면 keyword를 생략한다', () => {
    const params = parseQuery(buildMoversListQuery({ keyword: '   ' }));

    expect(params.keyword).toBeUndefined();
    expect(params.sort).toBe('reviewCount');
  });

  it('regions와 moveTypes를 쉼표 구분으로 전달한다', () => {
    expect(
      parseQuery(
        buildMoversListQuery({
          regions: ['SEOUL', 'BUSAN'],
          moveTypes: ['HOME', 'SMALL'],
        })
      )
    ).toMatchObject({
      region: 'SEOUL,BUSAN',
      moveType: 'HOME,SMALL',
      sort: 'reviewCount',
    });
  });

  it('regions·moveTypes가 빈 배열이면 생략한다', () => {
    const params = parseQuery(
      buildMoversListQuery({ regions: [], moveTypes: [] })
    );

    expect(params.region).toBeUndefined();
    expect(params.moveType).toBeUndefined();
  });

  it('sort·cursor·limit를 함께 전달한다', () => {
    expect(
      parseQuery(
        buildMoversListQuery({
          sort: 'averageRating',
          cursor: 'cursor-token',
          limit: 10,
        })
      )
    ).toEqual({
      sort: 'averageRating',
      cursor: 'cursor-token',
      limit: '10',
    });
  });
});

describe('toMoverCardModelFromListItem', () => {
  it('목록 아이템을 카드 UI 모델로 변환한다', () => {
    const item = createListItem();

    expect(toMoverCardModelFromListItem(item)).toEqual({
      moverId: '11111111-1111-4111-8111-111111111111',
      name: '김기사',
      profileImageUrl: 'https://example.com/profile.jpg',
      services: ['HOME'],
      regions: ['SEOUL'],
      career: 5,
      shortDescription: '한줄 소개',
      description: '상세 소개',
      averageRating: 4.5,
      reviewCount: 10,
      ratingCounts: { 1: 0, 2: 0, 3: 1, 4: 3, 5: 6 },
      isFavorited: false,
      favoritedCount: 0,
      confirmedCount: 0,
      isDesignated: undefined,
    });
  });

  it('favoritedCount·confirmedCount가 없으면 0으로 표시한다', () => {
    const item = createListItem({
      favoritedCount: undefined,
      confirmedCount: undefined,
    });

    expect(toMoverCardModelFromListItem(item)).toMatchObject({
      favoritedCount: 0,
      confirmedCount: 0,
    });
  });

  it('ratingCounts가 없으면 0으로 채운 기본값을 사용한다', () => {
    const item = createListItem({
      review: {
        totalCount: 0,
        averageRating: null,
        ratingCounts: undefined as unknown as MoverListItem['review']['ratingCounts'],
      },
    });

    expect(toMoverCardModelFromListItem(item).ratingCounts).toEqual({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    });
  });
});

const createDetailData = (
  overrides: Partial<MoverDetailData> = {}
): MoverDetailData => ({
  moverDetail: {
    id: 1,
    userId: 'user-uuid',
    service: ['HOME', 'SMALL'],
    career: 8,
    description: '상세 페이지 소개',
    shortDescription: '한줄 소개',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    user: {
      id: '22222222-2222-4222-8222-222222222222',
      name: '박기사',
      profileImageUrl: null,
    },
    serviceRegions: [
      { id: 1, region: 'SEOUL' },
      { id: 2, region: 'GYEONGGI' },
    ],
  },
  reviewStats: {
    totalCount: 25,
    averageRating: 4.8,
    ratingCounts: { 1: 0, 2: 1, 3: 2, 4: 5, 5: 17 },
  },
  isFavorited: true,
  ...overrides,
});

describe('toMoverCardModelFromDetail', () => {
  it('상세 응답을 카드 UI 모델로 변환한다', () => {
    const data = createDetailData({
      favoritedCount: 12,
      confirmedCount: 30,
    });

    expect(toMoverCardModelFromDetail(data)).toEqual({
      moverId: '22222222-2222-4222-8222-222222222222',
      name: '박기사',
      profileImageUrl: null,
      services: ['HOME', 'SMALL'],
      regions: ['SEOUL', 'GYEONGGI'],
      career: 8,
      shortDescription: '한줄 소개',
      description: '상세 페이지 소개',
      averageRating: 4.8,
      reviewCount: 25,
      ratingCounts: { 1: 0, 2: 1, 3: 2, 4: 5, 5: 17 },
      isFavorited: true,
      favoritedCount: 12,
      confirmedCount: 30,
      isDesignated: undefined,
    });
  });

  it('favoritedCount·confirmedCount가 없으면 null로 둔다', () => {
    const data = createDetailData({
      favoritedCount: undefined,
      confirmedCount: undefined,
    });

    expect(toMoverCardModelFromDetail(data)).toMatchObject({
      favoritedCount: null,
      confirmedCount: null,
    });
  });
});

const createFavoriteItem = (
  overrides: Partial<FavoriteMoverListItem> = {}
): FavoriteMoverListItem => ({
  id: 10,
  userId: 'customer-uuid',
  moverId: '33333333-3333-4333-8333-333333333333',
  createdAt: '2026-01-02T00:00:00.000Z',
  mover: {
    id: '33333333-3333-4333-8333-333333333333',
    name: '이기사',
    profileImageUrl: 'https://example.com/fav.jpg',
    moverProfile: {
      career: 3,
      serviceRegions: [{ id: 1, region: 'BUSAN' }],
      service: ['OFFICE'],
    },
  },
  reviewStats: {
    totalCount: 4,
    averageRating: 4.0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2 },
  },
  favoritedCount: 7,
  confirmedCount: 2,
  ...overrides,
});

describe('buildFavoriteMoversQuery', () => {
  it('파라미터가 없으면 빈 문자열을 반환한다', () => {
    expect(buildFavoriteMoversQuery({})).toBe('');
  });

  it('cursor와 limit를 쿼리에 포함한다', () => {
    expect(
      parseQuery(
        buildFavoriteMoversQuery({ cursor: 'next-page', limit: 10 })
      )
    ).toEqual({
      cursor: 'next-page',
      limit: '10',
    });
  });

  it('limit만 있으면 limit만 포함한다', () => {
    expect(parseQuery(buildFavoriteMoversQuery({ limit: 3 }))).toEqual({
      limit: '3',
    });
  });
});

describe('toMoverCardModelFromFavorite', () => {
  it('찜 목록 아이템을 카드 UI 모델로 변환한다', () => {
    expect(toMoverCardModelFromFavorite(createFavoriteItem())).toEqual({
      moverId: '33333333-3333-4333-8333-333333333333',
      name: '이기사',
      profileImageUrl: 'https://example.com/fav.jpg',
      services: ['OFFICE'],
      regions: ['BUSAN'],
      career: 3,
      shortDescription: null,
      description: null,
      averageRating: 4.0,
      reviewCount: 4,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 2, 5: 2 },
      isFavorited: true,
      favoritedCount: 7,
      confirmedCount: 2,
      isDesignated: undefined,
    });
  });

  it('moverId가 없으면 null을 반환한다', () => {
    expect(
      toMoverCardModelFromFavorite(createFavoriteItem({ moverId: null }))
    ).toBeNull();
  });

  it('mover가 없으면 null을 반환한다', () => {
    expect(
      toMoverCardModelFromFavorite(createFavoriteItem({ mover: null }))
    ).toBeNull();
  });

  it('item.service가 없으면 moverProfile.service를 사용한다', () => {
    const item = createFavoriteItem({
      service: undefined,
      mover: {
        id: '33333333-3333-4333-8333-333333333333',
        name: '이기사',
        profileImageUrl: null,
        moverProfile: {
          career: 1,
          serviceRegions: [],
          service: ['HOME'],
        },
      },
    });

    expect(toMoverCardModelFromFavorite(item)).toMatchObject({
      services: ['HOME'],
      isFavorited: true,
    });
  });

  it('confirmedCount가 없으면 null로 둔다', () => {
    expect(
      toMoverCardModelFromFavorite(
        createFavoriteItem({ confirmedCount: undefined })
      )
    ).toMatchObject({
      confirmedCount: null,
      shortDescription: null,
      description: null,
    });
  });
});
