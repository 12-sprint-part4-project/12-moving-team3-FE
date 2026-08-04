'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  SAMPLE_WRITABLE_QUOTES,
} from '@/components/reviews/_fixtures/reviewFixtures';
import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { ReviewsEmptyState } from '@/components/reviews/ReviewsEmptyState';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import type { WritableQuoteItem } from '@/types/review';

const meta: Meta<typeof ReviewListSection<WritableQuoteItem>> = {
  title: 'Reviews/ReviewListSection',
  component: ReviewListSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background-200 p-6 xl:px-16">
        <div className="mx-auto max-w-[87.5rem]">
          <Story />
        </div>
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ReviewListSection<WritableQuoteItem>>;

const renderWritableCard = (item: WritableQuoteItem) => (
  <WritableReviewCard key={item.quoteId} item={item} onWriteClick={() => {}} />
);

/** 목록 + 페이지네이션 */
export const WithItems: Story = {
  render: () => {
    const [page, setPage] = useState(1);

    return (
      <ReviewListSection
        items={SAMPLE_WRITABLE_QUOTES}
        isPending={false}
        isError={false}
        showEmpty={false}
        pendingMessage="작성 가능한 리뷰를 불러오는 중..."
        errorMessage="작성 가능한 리뷰를 불러오지 못했습니다."
        onRetry={() => {}}
        emptyState={<ReviewsEmptyState />}
        renderItem={renderWritableCard}
        page={page}
        totalPages={3}
        onPageChange={setPage}
      />
    );
  },
};

/** 초기 로딩 */
export const Pending: Story = {
  args: {
    items: [],
    isPending: true,
    isError: false,
    showEmpty: false,
    pendingMessage: '작성 가능한 리뷰를 불러오는 중...',
    errorMessage: '작성 가능한 리뷰를 불러오지 못했습니다.',
    onRetry: () => {},
    emptyState: <ReviewsEmptyState />,
    renderItem: renderWritableCard,
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};

/** 에러 + 다시 시도 */
export const ErrorState: Story = {
  args: {
    items: [],
    isPending: false,
    isError: true,
    showEmpty: false,
    pendingMessage: '작성 가능한 리뷰를 불러오는 중...',
    errorMessage: '작성 가능한 리뷰를 불러오지 못했습니다.',
    onRetry: () => {},
    emptyState: <ReviewsEmptyState />,
    renderItem: renderWritableCard,
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};

/** 빈 목록 */
export const Empty: Story = {
  args: {
    items: [],
    isPending: false,
    isError: false,
    showEmpty: true,
    pendingMessage: '작성 가능한 리뷰를 불러오는 중...',
    errorMessage: '작성 가능한 리뷰를 불러오지 못했습니다.',
    onRetry: () => {},
    emptyState: <ReviewsEmptyState />,
    renderItem: renderWritableCard,
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};
