'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { SAMPLE_CUSTOMER_REVIEW } from '@/components/reviews/_fixtures/reviewFixtures';
import { EditReviewModal } from '@/components/reviews/EditReviewModal';
import { Modal } from '@/components/ui/Modal/Modal';

const meta: Meta<typeof EditReviewModal> = {
  title: 'Reviews/EditReviewModal',
  component: EditReviewModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof EditReviewModal>;

/** Modal 셸과 조합 */
export const WithModalShell: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background-200">
        <button
          type="button"
          className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
          onClick={() => setIsOpen(true)}
        >
          리뷰 수정 열기
        </button>
        {isOpen ? (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <EditReviewModal
              review={SAMPLE_CUSTOMER_REVIEW}
              onClose={() => setIsOpen(false)}
              onSubmit={() => setIsOpen(false)}
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
    onSubmit: () => {},
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
