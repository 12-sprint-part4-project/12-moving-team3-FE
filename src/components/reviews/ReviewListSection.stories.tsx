'use client';

import { useState } from 'react';

import { SAMPLE_WRITABLE_QUOTES } from '@/components/reviews/_fixtures/reviewFixtures';
import { ReviewListSection } from '@/components/reviews/ReviewListSection';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';

import type { WritableQuoteItem } from '@/types/review';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

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
        <div className="mx-auto flex min-h-[40rem] max-w-[87.5rem] flex-col">
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
        pagination={{
          page,
          totalPages: 3,
          onPageChange: setPage,
          getItemKey: (item) => item.quoteId,
        }}
        renderItem={renderWritableCard}
      />
    );
  },
};

/** 페이지 전환 keepPreviousData 재조회 오버레이 */
export const Fetching: Story = {
  args: {
    items: SAMPLE_WRITABLE_QUOTES,
    pagination: {
      page: 2,
      totalPages: 3,
      onPageChange: () => {},
      isFetching: true,
      getItemKey: (item) => item.quoteId,
    },
    renderItem: renderWritableCard,
  },
};
