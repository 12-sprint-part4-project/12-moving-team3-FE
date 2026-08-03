'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  SAMPLE_CUSTOMER_REVIEW,
  SAMPLE_CUSTOMER_REVIEWS,
} from '@/components/reviews/_fixtures/reviewFixtures';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import { WrittenReviewCard } from '@/components/reviews/WrittenReviewCard';
import { Modal } from '@/components/ui/Modal/Modal';
import type { CustomerReviewItem } from '@/types/review';

const meta: Meta<typeof WrittenReviewCard> = {
  title: 'Reviews/WrittenReviewCard',
  component: WrittenReviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof WrittenReviewCard>;

/** 단일 카드 */
export const Default: Story = {
  args: {
    item: SAMPLE_CUSTOMER_REVIEW,
    onClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[37.5rem] bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};

/** 짧은 본문 */
export const ShortContent: Story = {
  args: {
    item: SAMPLE_CUSTOMER_REVIEWS[1],
    onClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[37.5rem] bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};

/** 목록 그리드 + 상세 모달 연동 */
export const ListWithDetailModal: Story = {
  render: () => {
    const [selected, setSelected] = useState<CustomerReviewItem | null>(null);

    return (
      <div className="min-h-screen bg-background-200 p-6 xl:px-16">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-8 xl:grid-cols-2">
          {SAMPLE_CUSTOMER_REVIEWS.map((item) => (
            <WrittenReviewCard
              key={item.id}
              item={item}
              onClick={setSelected}
            />
          ))}
        </div>

        {selected ? (
          <Modal placement="bottom" onClose={() => setSelected(null)}>
            <ReviewDetailModal
              review={selected}
              onClose={() => setSelected(null)}
            />
          </Modal>
        ) : null}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
