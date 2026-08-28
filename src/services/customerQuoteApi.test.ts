import { describe, expect, it } from 'vitest';

import {
  toCustomerQuoteDetailViewModel,
  toCustomerQuoteMoverViewModel,
  toHistoryQuoteCardModels,
  toMoverCardModelFromCustomerQuoteMover,
  toPendingQuoteCardModel,
  toPendingQuotesPageModel,
  toQuoteInfoViewModel,
  toReceivedQuoteCardModel,
  toReceivedQuoteGroupModel,
} from './customerQuoteApi';
import { formatQuotePriceLabel } from './quoteApi';

import type {
  CustomerPastQuoteGroup,
  CustomerPendingQuotesData,
  CustomerQuoteDetail,
  CustomerQuoteItem,
  CustomerQuoteMover,
} from '@/types/customerQuote';

const createMover = (
  overrides: Partial<CustomerQuoteMover> = {}
): CustomerQuoteMover => ({
  moverId: '11111111-1111-4111-8111-111111111111',
  name: '김기사',
  profileImage: 'https://example.com/profile.jpg',
  shortDescription: '친절한 이사',
  rating: 4.7,
  reviewCount: 12,
  career: 5,
  confirmedQuoteCount: 8,
  favoriteCount: 3,
  isFavorited: true,
  ...overrides,
});

const createQuoteItem = (
  overrides: Partial<CustomerQuoteItem> = {}
): CustomerQuoteItem => ({
  quoteId: 1,
  price: 150000,
  status: 'PENDING',
  isDesignated: false,
  designatedMoverId: null,
  mover: createMover(),
  ...overrides,
});

const createPendingData = (
  overrides: Partial<CustomerPendingQuotesData> = {}
): CustomerPendingQuotesData => ({
  estimateRequestId: 10,
  status: 'SUBMITTED',
  submittedAt: '2026-07-01T00:00:00.000Z',
  serviceType: 'HOME',
  moveDate: '2026-08-15',
  fromAddress: '서울특별시 강남구 테헤란로 1',
  toAddress: '경기도 성남시 분당구 판교로 2',
  quoteCount: { general: 1, designated: 0 },
  quotes: [createQuoteItem()],
  ...overrides,
});

const createPastGroup = (
  overrides: Partial<CustomerPastQuoteGroup> = {}
): CustomerPastQuoteGroup => ({
  estimateRequestId: 20,
  status: 'CONFIRMED',
  submittedAt: '2026-06-01T00:00:00.000Z',
  confirmedAt: '2026-06-05T00:00:00.000Z',
  serviceType: 'SMALL',
  moveDate: '2026-07-10',
  fromAddress: '부산광역시 해운대구 우동 1',
  toAddress: '부산광역시 수영구 광안동 2',
  quotes: [
    createQuoteItem({ quoteId: 11, status: 'CONFIRMED', price: 120000 }),
    createQuoteItem({ quoteId: 12, status: 'PENDING', price: 100000 }),
  ],
  ...overrides,
});

const createDetail = (
  overrides: Partial<CustomerQuoteDetail> = {}
): CustomerQuoteDetail => ({
  quoteId: 30,
  estimateRequestId: 40,
  price: 200000,
  comment: '꼼꼼하게 옮기겠습니다.',
  status: 'PENDING',
  isDesignated: false,
  designatedMoverId: null,
  estimateRequestStatus: 'SUBMITTED',
  serviceType: 'OFFICE',
  moveDate: '2026-09-01',
  submittedAt: '2026-08-01T00:00:00.000Z',
  fromAddress: '서울특별시 마포구 월드컵북로 1',
  toAddress: '서울특별시 용산구 이태원로 2',
  mover: createMover({ name: '박기사' }),
  ...overrides,
});

describe('toCustomerQuoteMoverViewModel', () => {
  it('기사님 BE를 UI 모델로 변환한다', () => {
    expect(toCustomerQuoteMoverViewModel(createMover())).toEqual({
      moverId: '11111111-1111-4111-8111-111111111111',
      name: '김기사',
      profileImageUrl: 'https://example.com/profile.jpg',
      shortDescription: '친절한 이사',
      averageRating: 4.7,
      reviewCount: 12,
      career: 5,
      confirmedCount: 8,
      favoriteCount: 3,
      isFavorited: true,
    });
  });
});

describe('toMoverCardModelFromCustomerQuoteMover', () => {
  it('견적 기사님 뷰모델을 MoverCard 모델로 변환한다', () => {
    const mover = toCustomerQuoteMoverViewModel(createMover());

    expect(toMoverCardModelFromCustomerQuoteMover(mover)).toEqual({
      moverId: mover.moverId,
      name: '김기사',
      profileImageUrl: 'https://example.com/profile.jpg',
      services: [],
      regions: [],
      career: 5,
      shortDescription: '친절한 이사',
      description: null,
      averageRating: 4.7,
      reviewCount: 12,
      ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      isFavorited: true,
      favoritedCount: 3,
      confirmedCount: 8,
    });
  });
});

describe('toQuoteInfoViewModel', () => {
  it('요청 정보를 UI 라벨로 변환한다', () => {
    expect(
      toQuoteInfoViewModel({
        submittedAt: '2026-07-01T00:00:00.000Z',
        serviceType: 'HOME',
        moveDate: '2026-08-15',
        fromAddress: '서울 강남구',
        toAddress: '경기 성남시',
      })
    ).toMatchObject({
      serviceLabel: '가정이사',
      departure: '서울 강남구',
      arrival: '경기 성남시',
      requestedAtLabel: expect.any(String),
      moveDateLabel: expect.stringMatching(/2026/),
    });
  });

  it('값이 없으면 기본값을 사용한다', () => {
    expect(
      toQuoteInfoViewModel({
        submittedAt: null,
        serviceType: null,
        moveDate: null,
        fromAddress: null,
        toAddress: null,
      })
    ).toEqual({
      requestedAtLabel: '-',
      serviceLabel: '-',
      moveDateLabel: '-',
      departure: '-',
      arrival: '-',
    });
  });
});

describe('toPendingQuoteCardModel', () => {
  const request = {
    estimateRequestId: 10,
    serviceType: 'HOME' as const,
    moveDate: '2026-08-15',
    fromAddress: '서울 강남구',
    toAddress: '경기 성남시',
  };

  it('대기 중 견적 아이템을 카드 모델로 변환한다', () => {
    expect(toPendingQuoteCardModel(createQuoteItem(), request)).toMatchObject({
      quoteId: 1,
      estimateRequestId: 10,
      moveType: 'home',
      isDesignated: false,
      designatedMoverId: null,
      canStartChat: true,
      departure: '서울 강남구',
      arrival: '경기 성남시',
      priceLabel: formatQuotePriceLabel(150000),
      mover: { name: '김기사' },
    });
  });

  it('지정 견적인데 designatedMoverId가 없으면 canStartChat이 false이다', () => {
    expect(
      toPendingQuoteCardModel(
        createQuoteItem({ isDesignated: true, designatedMoverId: null }),
        request
      ).canStartChat
    ).toBe(false);
  });
});

describe('toReceivedQuoteCardModel', () => {
  it('받았던 견적 아이템을 카드 모델로 변환한다', () => {
    expect(
      toReceivedQuoteCardModel(
        createQuoteItem({ status: 'CONFIRMED', price: 180000 }),
        'OFFICE'
      )
    ).toMatchObject({
      quoteId: 1,
      moveType: 'office',
      isConfirmed: true,
      isDesignated: false,
      shortDescription: '친절한 이사',
      priceLabel: formatQuotePriceLabel(180000),
    });
  });

  it('PENDING이면 isConfirmed가 false이다', () => {
    expect(
      toReceivedQuoteCardModel(createQuoteItem({ status: 'PENDING' }), null)
    ).toMatchObject({
      moveType: null,
      isConfirmed: false,
    });
  });
});

describe('toReceivedQuoteGroupModel', () => {
  it('과거 견적 그룹을 UI 모델로 변환한다', () => {
    const group = createPastGroup();
    const model = toReceivedQuoteGroupModel(group);

    expect(model.estimateRequestId).toBe(20);
    expect(model.info).toMatchObject({
      serviceLabel: '소형이사',
      departure: '부산광역시 해운대구 우동 1',
      arrival: '부산광역시 수영구 광안동 2',
    });
    expect(model.quotes).toHaveLength(2);
    expect(model.quotes[0]).toMatchObject({
      quoteId: 11,
      isConfirmed: true,
      moveType: 'small',
    });
  });
});

describe('toHistoryQuoteCardModels', () => {
  it('확정 견적만 이용 내역 카드로 변환한다', () => {
    const cards = toHistoryQuoteCardModels(createPastGroup());

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      quoteId: 11,
      estimateRequestId: 20,
      moverName: '김기사',
      moveType: 'small',
      isConfirmed: true,
      canStartChat: true,
      isMoveCompleted: false,
      estimateRequestStatus: 'CONFIRMED',
      priceLabel: formatQuotePriceLabel(120000),
      departure: '부산광역시 해운대구',
      arrival: '부산광역시 수영구',
      relativeTimeLabel: expect.any(String),
    });
  });

  it('COMPLETED·EXPIRED·CANCELED면 isMoveCompleted가 true이고 canStartChat은 false이다', () => {
    for (const status of ['COMPLETED', 'EXPIRED', 'CANCELED'] as const) {
      const cards = toHistoryQuoteCardModels(
        createPastGroup({
          status,
          quotes: [createQuoteItem({ quoteId: 99, status: 'CONFIRMED' })],
        })
      );

      expect(cards[0]).toMatchObject({
        isMoveCompleted: true,
        canStartChat: false,
        estimateRequestStatus: status,
      });
    }
  });

  it('확정 견적이 없으면 빈 배열을 반환한다', () => {
    expect(
      toHistoryQuoteCardModels(
        createPastGroup({
          quotes: [createQuoteItem({ status: 'PENDING' })],
        })
      )
    ).toEqual([]);
  });

  it('confirmedAt이 없으면 relativeTimeLabel은 빈 문자열이다', () => {
    expect(
      toHistoryQuoteCardModels(
        createPastGroup({
          confirmedAt: null,
          quotes: [createQuoteItem({ status: 'CONFIRMED' })],
        })
      )[0].relativeTimeLabel
    ).toBe('');
  });
});

describe('toPendingQuotesPageModel', () => {
  it('data가 null이면 빈 페이지 모델을 반환한다', () => {
    expect(toPendingQuotesPageModel(null)).toEqual({
      summary: null,
      quotes: [],
      isWaitingForQuotes: false,
    });
  });

  it('견적이 있으면 summary·quotes를 채운다', () => {
    const model = toPendingQuotesPageModel(createPendingData());

    expect(model.isWaitingForQuotes).toBe(false);
    expect(model.summary).toMatchObject({
      estimateRequestId: 10,
      serviceLabel: '가정이사',
      from: '서울특별시 강남구 테헤란로 1',
      to: '경기도 성남시 분당구 판교로 2',
    });
    expect(model.quotes).toHaveLength(1);
    expect(model.quotes[0].quoteId).toBe(1);
  });

  it('요청은 있지만 견적이 없으면 isWaitingForQuotes가 true이다', () => {
    expect(
      toPendingQuotesPageModel(createPendingData({ quotes: [] }))
        .isWaitingForQuotes
    ).toBe(true);
  });
});

describe('toCustomerQuoteDetailViewModel', () => {
  it('고객 견적 상세를 UI 모델로 변환한다', () => {
    expect(toCustomerQuoteDetailViewModel(createDetail())).toMatchObject({
      quoteId: 30,
      estimateRequestId: 40,
      moveType: 'office',
      isPending: true,
      isConfirmed: false,
      canConfirm: true,
      canStartChat: true,
      showUnconfirmedBanner: false,
      priceLabel: formatQuotePriceLabel(200000),
      comment: '꼼꼼하게 옮기겠습니다.',
      serviceLabel: '사무실이사',
      departure: '서울특별시 마포구 월드컵북로 1',
      arrival: '서울특별시 용산구 이태원로 2',
      mover: { name: '박기사' },
    });
  });

  it('PENDING이지만 SUBMITTED가 아니면 확정 불가·배너를 표시한다', () => {
    expect(
      toCustomerQuoteDetailViewModel(
        createDetail({ estimateRequestStatus: 'CONFIRMED' })
      )
    ).toMatchObject({
      isPending: true,
      canConfirm: false,
      showUnconfirmedBanner: true,
      canStartChat: true,
    });
  });

  it('CONFIRMED면 canConfirm·배너가 false이다', () => {
    expect(
      toCustomerQuoteDetailViewModel(createDetail({ status: 'CONFIRMED' }))
    ).toMatchObject({
      isPending: false,
      isConfirmed: true,
      canConfirm: false,
      showUnconfirmedBanner: false,
    });
  });

  it('닫힌 견적요청이면 canStartChat이 false이다', () => {
    expect(
      toCustomerQuoteDetailViewModel(
        createDetail({ estimateRequestStatus: 'COMPLETED' })
      ).canStartChat
    ).toBe(false);
  });

  it('지정 견적인데 designatedMoverId가 없으면 canStartChat이 false이다', () => {
    expect(
      toCustomerQuoteDetailViewModel(
        createDetail({
          isDesignated: true,
          designatedMoverId: null,
        })
      ).canStartChat
    ).toBe(false);
  });
});
