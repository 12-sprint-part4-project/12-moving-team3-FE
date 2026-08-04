'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  EMPTY_RATING_STATISTICS,
  SAMPLE_CUSTOMER_REVIEWS,
  SAMPLE_RATING_STATISTICS,
} from '@/components/reviews/_fixtures/reviewFixtures';
import { MoverReviewSection } from '@/components/reviews/MoverReviewSection';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import type { MoverPublicReviewItem } from '@/types/review';

const meta: Meta<typeof MoverReviewSection> = {
  title: 'Reviews/MoverReviewSection',
  component: MoverReviewSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
              <Story />
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof MoverReviewSection>;

const SAMPLE_PUBLIC_REVIEWS: MoverPublicReviewItem[] =
  SAMPLE_CUSTOMER_REVIEWS.map((item) => ({
    id: item.id,
    rating: item.rating,
    content: item.content,
    createdAt: item.createdAt,
    customer: {
      id: `customer-${item.id}`,
      name: item.id === 1 ? 'kim고객' : '이가입',
    },
  }));

/** 통계 + 목록 + 페이지네이션 */
export const WithReviews: Story = {
  render: () => {
    const [page, setPage] = useState(1);

    return (
      <div className="mx-auto max-w-[60rem] bg-white p-6">
        <MoverReviewSection
          reviews={SAMPLE_PUBLIC_REVIEWS}
          ratingStatistics={SAMPLE_RATING_STATISTICS}
          totalCount={178}
          page={page}
          totalPages={30}
          onPageChange={setPage}
        />
      </div>
    );
  },
};

/** 리뷰 0건 — 통계·empty 문구·페이지네이션 */
export const Empty: Story = {
  args: {
    reviews: [],
    ratingStatistics: EMPTY_RATING_STATISTICS,
    totalCount: 0,
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[60rem] bg-white p-6">
        <Story />
      </div>
    ),
  ],
};
