import { describe, expect, it } from 'vitest';

import { getActiveLanguage, toBcp47Locale } from '@/lib/formatLocale';

import {
  buildMoverQuotesQuery,
  formatQuotePriceLabel,
  toQuoteDetailViewModel,
  toRejectedQuoteCardModel,
  toSentQuoteCardModel,
} from './quoteApi';

import type {
  QuoteDetail,
  RejectedQuoteListItem,
  SentQuoteListItem,
} from '@/types/quote';

const parseQuery = (query: string): Record<string, string> => {
  const normalized = query.startsWith('?') ? query.slice(1) : query;
  return Object.fromEntries(new URLSearchParams(normalized).entries());
};

const createSentQuoteItem = (
  overrides: Partial<SentQuoteListItem> = {}
): SentQuoteListItem => ({
  id: 1,
  estimateRequestId: 10,
  customer: { name: '김고객' },
  moveType: 'HOME',
  isDesignated: false,
  designatedMoverId: null,
  moveDate: '2026-08-15',
  fromRegionLabel: '서울 강남구',
  toRegionLabel: '경기 성남시',
  createdAt: '2026-08-01T00:00:00.000Z',
  isConfirmed: false,
  price: 150000,
  estimateRequestStatus: 'SUBMITTED',
  isMoveCompleted: false,
  ...overrides,
});

const createRejectedQuoteItem = (
  overrides: Partial<RejectedQuoteListItem> = {}
): RejectedQuoteListItem => ({
  id: 2,
  estimateRequestId: 20,
  customer: { name: '이고객' },
  moveType: 'SMALL',
  isDesignated: true,
  designatedMoverId: 5,
  moveDate: '2026-09-01',
  fromRegionLabel: '부산 해운대구',
  toRegionLabel: '부산 수영구',
  createdAt: '2026-08-10T00:00:00.000Z',
  ...overrides,
});

const createQuoteDetail = (
  overrides: Partial<QuoteDetail> = {}
): QuoteDetail => ({
  id: 3,
  estimateRequestId: 30,
  price: 200000,
  status: 'PENDING',
  comment: '안전하고 빠르게 모시겠습니다.',
  rejectReason: null,
  estimateRequestStatus: 'SUBMITTED',
  isMoveCompleted: false,
  customer: { name: '박고객' },
  moveType: 'OFFICE',
  isDesignated: false,
  designatedMoverId: null,
  requestedAt: '2026-07-20T00:00:00.000Z',
  moveDate: '2026-10-01',
  fromAddress: '서울특별시 마포구 월드컵북로 1',
  toAddress: '서울특별시 용산구 이태원로 2',
  ...overrides,
});

const formatKrw = (price: number): string =>
  new Intl.NumberFormat(toBcp47Locale(getActiveLanguage()), {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(price);

describe('formatQuotePriceLabel', () => {
  it('금액을 KRW 통화 문자열로 포맷한다', () => {
    expect(formatQuotePriceLabel(150000)).toBe(formatKrw(150000));
  });

  it('0원도 포맷한다', () => {
    expect(formatQuotePriceLabel(0)).toBe(formatKrw(0));
  });

  it('null이면 -를 반환한다', () => {
    expect(formatQuotePriceLabel(null)).toBe('-');
  });
});

describe('buildMoverQuotesQuery', () => {
  it('status만 있으면 status 쿼리만 포함한다', () => {
    expect(parseQuery(buildMoverQuotesQuery({ status: 'SENT' }))).toEqual({
      status: 'SENT',
    });
  });

  it('page·limit를 함께 전달한다', () => {
    expect(
      parseQuery(
        buildMoverQuotesQuery({ status: 'REJECTED', page: 2, limit: 10 })
      )
    ).toEqual({
      status: 'REJECTED',
      page: '2',
      limit: '10',
    });
  });

  it('page만 있으면 page와 status만 포함한다', () => {
    expect(
      parseQuery(buildMoverQuotesQuery({ status: 'SENT', page: 1 }))
    ).toEqual({
      status: 'SENT',
      page: '1',
    });
  });
});

describe('toSentQuoteCardModel', () => {
  it('보낸 견적 BE 아이템을 카드 UI 모델로 변환한다', () => {
    const item = createSentQuoteItem();

    expect(toSentQuoteCardModel(item)).toMatchObject({
      id: 1,
      customerName: '김고객',
      moveType: 'home',
      isConfirmed: false,
      isDesignated: false,
      moveDate: expect.stringMatching(/2026/),
      departure: '서울 강남구',
      arrival: '경기 성남시',
      priceLabel: '₩150,000',
      estimateRequestStatus: 'SUBMITTED',
      isMoveCompleted: false,
    });
    expect(toSentQuoteCardModel(item).relativeTimeLabel).toEqual(
      expect.any(String)
    );
  });

  it('지역 라벨·금액·이사유형이 없으면 기본값을 사용한다', () => {
    expect(
      toSentQuoteCardModel(
        createSentQuoteItem({
          moveType: null,
          price: null,
          fromRegionLabel: null,
          toRegionLabel: null,
        })
      )
    ).toMatchObject({
      moveType: null,
      priceLabel: '-',
      departure: '-',
      arrival: '-',
    });
  });

  it('확정·지정 플래그를 그대로 전달한다', () => {
    expect(
      toSentQuoteCardModel(
        createSentQuoteItem({
          isConfirmed: true,
          isDesignated: true,
          isMoveCompleted: true,
          estimateRequestStatus: 'CONFIRMED',
        })
      )
    ).toMatchObject({
      isConfirmed: true,
      isDesignated: true,
      isMoveCompleted: true,
      estimateRequestStatus: 'CONFIRMED',
    });
  });
});

describe('toRejectedQuoteCardModel', () => {
  it('반려 견적 BE 아이템을 카드 UI 모델로 변환한다', () => {
    expect(toRejectedQuoteCardModel(createRejectedQuoteItem())).toMatchObject({
      id: 2,
      customerName: '이고객',
      moveType: 'small',
      isDesignated: true,
      moveDate: expect.stringMatching(/2026/),
      departure: '부산 해운대구',
      arrival: '부산 수영구',
    });
  });

  it('지역 라벨·이사유형이 없으면 기본값을 사용한다', () => {
    expect(
      toRejectedQuoteCardModel(
        createRejectedQuoteItem({
          moveType: null,
          fromRegionLabel: null,
          toRegionLabel: null,
          moveDate: null,
        })
      )
    ).toEqual({
      id: 2,
      customerName: '이고객',
      moveType: null,
      isDesignated: true,
      moveDate: '-',
      departure: '-',
      arrival: '-',
    });
  });
});

describe('toQuoteDetailViewModel', () => {
  it('견적 상세 BE를 UI 모델로 변환한다', () => {
    expect(toQuoteDetailViewModel(createQuoteDetail())).toMatchObject({
      id: 3,
      estimateRequestId: 30,
      customerName: '박고객',
      moveType: 'office',
      isConfirmed: false,
      isRejected: false,
      isDesignated: false,
      designatedMoverId: null,
      estimateRequestStatus: 'SUBMITTED',
      isMoveCompleted: false,
      canStartChat: true,
      priceLabel: '₩200,000',
      comment: '안전하고 빠르게 모시겠습니다.',
      rejectReason: null,
      serviceLabel: expect.any(String),
      departure: '서울특별시 마포구 월드컵북로 1',
      arrival: '서울특별시 용산구 이태원로 2',
      summaryDeparture: '서울특별시 마포구',
      summaryArrival: '서울특별시 용산구',
    });
  });

  it('CONFIRMED면 isConfirmed가 true이다', () => {
    expect(
      toQuoteDetailViewModel(createQuoteDetail({ status: 'CONFIRMED' }))
    ).toMatchObject({
      isConfirmed: true,
      isRejected: false,
      canStartChat: true,
    });
  });

  it('REJECTED면 isRejected true·canStartChat false이다', () => {
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({
          status: 'REJECTED',
          rejectReason: '일정이 맞지 않습니다.',
          price: null,
          comment: null,
        })
      )
    ).toMatchObject({
      isRejected: true,
      isConfirmed: false,
      canStartChat: false,
      rejectReason: '일정이 맞지 않습니다.',
      priceLabel: '-',
    });
  });

  it('닫힌 견적요청이면 canStartChat이 false이다', () => {
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({ estimateRequestStatus: 'COMPLETED' })
      ).canStartChat
    ).toBe(false);
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({ estimateRequestStatus: 'EXPIRED' })
      ).canStartChat
    ).toBe(false);
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({ estimateRequestStatus: 'CANCELED' })
      ).canStartChat
    ).toBe(false);
  });

  it('지정 견적인데 designatedMoverId가 없으면 canStartChat이 false이다', () => {
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({
          isDesignated: true,
          designatedMoverId: null,
        })
      ).canStartChat
    ).toBe(false);
  });

  it('지정 견적이고 designatedMoverId가 있으면 canStartChat이 true이다', () => {
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({
          isDesignated: true,
          designatedMoverId: 99,
        })
      )
    ).toMatchObject({
      canStartChat: true,
      designatedMoverId: 99,
      isDesignated: true,
    });
  });

  it('주소가 없으면 출발·도착에 -를 사용한다', () => {
    expect(
      toQuoteDetailViewModel(
        createQuoteDetail({
          fromAddress: null,
          toAddress: null,
          moveType: null,
          requestedAt: null,
          moveDate: null,
        })
      )
    ).toMatchObject({
      moveType: null,
      departure: '-',
      arrival: '-',
      summaryDeparture: '-',
      summaryArrival: '-',
      serviceLabel: '-',
      requestedAtLabel: '-',
      moveDateLabel: '-',
    });
  });
});
