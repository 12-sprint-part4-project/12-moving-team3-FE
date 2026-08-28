'use client';

import { useState } from 'react';

import { SAMPLE_CUSTOMER_REVIEW } from '@/components/reviews/_fixtures/reviewFixtures';
import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { ReviewDetailModal } from '@/components/reviews/ReviewDetailModal';
import { Modal } from '@/components/ui/Modal/Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReviewDetailModal> = {
  title: 'Reviews/ReviewDetailModal',
  component: ReviewDetailModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ReviewDetailModal>;

type DetailFlow = 'detail' | 'edit' | 'delete' | null;

/** Modal 셸 + 수정/삭제 확인 플로우 */
export const WithModalShell: Story = {
  render: () => {
    const [flow, setFlow] = useState<DetailFlow>(null);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background-200">
        <button
          type="button"
          className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
          onClick={() => setFlow('detail')}
        >
          리뷰 상세 열기
        </button>
        {flow === 'detail' ? (
          <Modal placement="bottom" onClose={() => setFlow(null)}>
            <ReviewDetailModal
              review={SAMPLE_CUSTOMER_REVIEW}
              onClose={() => setFlow(null)}
              onEdit={() => setFlow('edit')}
              onDelete={() => setFlow('delete')}
            />
          </Modal>
        ) : null}
        {flow === 'edit' ? (
          <Modal placement="bottom" onClose={() => setFlow(null)}>
            <EditReviewModal
              review={SAMPLE_CUSTOMER_REVIEW}
              onClose={() => setFlow(null)}
              onSubmit={() => setFlow(null)}
            />
          </Modal>
        ) : null}
        {flow === 'delete' ? (
          <Modal placement="bottom" onClose={() => setFlow(null)}>
            <DeleteReviewConfirmModal
              onClose={() => setFlow(null)}
              onConfirm={() => setFlow(null)}
            />
          </Modal>
        ) : null}
      </div>
    );
  },
};

/** 콘텐츠 패널만 */
export const PanelOnly: Story = {
  args: {
    review: SAMPLE_CUSTOMER_REVIEW,
    onClose: () => {},
    onEdit: () => {},
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-screen items-start justify-center bg-background-200 p-6">
        <div className="w-full max-w-[38rem]">
          <Story />
        </div>
      </div>
    ),
  ],
};
