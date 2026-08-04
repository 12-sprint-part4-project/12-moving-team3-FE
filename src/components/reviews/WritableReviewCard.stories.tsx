'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import {
  SAMPLE_WRITABLE_QUOTE,
  SAMPLE_WRITABLE_QUOTES,
} from '@/components/reviews/_fixtures/reviewFixtures';
import { WritableReviewCard } from '@/components/reviews/WritableReviewCard';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { Modal } from '@/components/ui/Modal/Modal';
import { formatReviewMoveDate } from '@/lib/reviewDisplay';
import { formatQuotePriceLabel } from '@/services/quoteApi';
import type { WritableQuoteItem } from '@/types/review';

const meta: Meta<typeof WritableReviewCard> = {
  title: 'Reviews/WritableReviewCard',
  component: WritableReviewCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;

type Story = StoryObj<typeof WritableReviewCard>;

/** 단일 카드 */
export const Default: Story = {
  args: {
    item: SAMPLE_WRITABLE_QUOTE,
    onWriteClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[37.5rem] bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};

/** 지정 견적 없는 카드 */
export const WithoutDesignated: Story = {
  args: {
    item: SAMPLE_WRITABLE_QUOTES[1],
    onWriteClick: () => {},
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-[37.5rem] bg-background-200 p-6">
        <Story />
      </div>
    ),
  ],
};

/** 목록 그리드 + 작성 모달 연동 */
export const ListWithWriteModal: Story = {
  render: () => {
    const [selected, setSelected] = useState<WritableQuoteItem | null>(null);

    return (
      <div className="min-h-screen bg-background-200 p-6 xl:px-16">
        <div className="mx-auto grid max-w-[87.5rem] grid-cols-1 gap-8 xl:grid-cols-2">
          {SAMPLE_WRITABLE_QUOTES.map((item) => (
            <WritableReviewCard
              key={item.quoteId}
              item={item}
              onWriteClick={setSelected}
            />
          ))}
        </div>

        {selected ? (
          <Modal placement="bottom" onClose={() => setSelected(null)}>
            <WriteReviewModal
              onClose={() => setSelected(null)}
              onSubmit={() => setSelected(null)}
              moveType={selected.moveType}
              isDesignated={selected.isDesignated}
              moverName={selected.mover?.name ?? '기사'}
              moveDate={formatReviewMoveDate(selected.moveDate)}
              quotePrice={formatQuotePriceLabel(selected.price)}
              avatarSrc={selected.mover?.profileImageUrl ?? undefined}
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
