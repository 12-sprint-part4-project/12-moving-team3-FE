import type {
  CustomerReviewItem,
  ReviewRatingStatistics,
  WritableQuoteItem,
} from '@/types/review';

export const SAMPLE_WRITABLE_QUOTE: WritableQuoteItem = {
  quoteId: 42,
  moveType: 'SMALL',
  isDesignated: true,
  moveDate: '2024-07-01',
  price: 210000,
  mover: {
    id: 'mover-1',
    name: '김코드',
    profileImageUrl: null,
  },
};

export const SAMPLE_WRITABLE_QUOTES: WritableQuoteItem[] = [
  SAMPLE_WRITABLE_QUOTE,
  {
    quoteId: 43,
    moveType: 'HOME',
    isDesignated: false,
    moveDate: '2024-07-15',
    price: 450000,
    mover: {
      id: 'mover-2',
      name: '이이사',
      profileImageUrl: null,
    },
  },
  {
    quoteId: 44,
    moveType: 'OFFICE',
    isDesignated: true,
    moveDate: '2024-08-01',
    price: 890000,
    mover: {
      id: 'mover-3',
      name: '박안전',
      profileImageUrl: null,
    },
  },
];

export const SAMPLE_CUSTOMER_REVIEW: CustomerReviewItem = {
  id: 1,
  rating: 5,
  content:
    '처음 견적 받아봤는데, 엄청 친절하시고 꼼꼼하세요! 귀찮게 이것저것 물어봤는데 잘 알려주셨습니다. 원룸 이사는 믿고 맡기세요! :) 곧 이사 앞두고 있는 지인분께 추천드릴 예정입니다!',
  createdAt: '2024-07-02T12:00:00.000Z',
  mover: {
    id: 'mover-1',
    name: '김코드',
    profileImageUrl: null,
  },
  quote: {
    id: 42,
    moveType: 'SMALL',
    moveDate: '2024-07-01',
    price: 210000,
    isDesignated: true,
  },
};

export const SAMPLE_CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  SAMPLE_CUSTOMER_REVIEW,
  {
    id: 2,
    rating: 4,
    content:
      '전반적으로 만족스러웠지만 도착이 조금 늦었어요. 그래도 물건은 파손 없이 잘 옮기셨습니다.',
    createdAt: '2024-07-10T09:30:00.000Z',
    mover: {
      id: 'mover-2',
      name: '이이사',
      profileImageUrl: null,
    },
    quote: {
      id: 43,
      moveType: 'HOME',
      moveDate: '2024-07-08',
      price: 450000,
      isDesignated: false,
    },
  },
];

export const SAMPLE_RATING_STATISTICS: ReviewRatingStatistics = {
  average: 5,
  five: 170,
  four: 8,
  three: 0,
  two: 0,
  one: 0,
};

export const EMPTY_RATING_STATISTICS: ReviewRatingStatistics = {
  average: 0,
  five: 0,
  four: 0,
  three: 0,
  two: 0,
  one: 0,
};
