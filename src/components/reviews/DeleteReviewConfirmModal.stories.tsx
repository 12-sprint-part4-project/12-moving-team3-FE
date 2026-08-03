'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DeleteReviewConfirmModal } from '@/components/reviews/DeleteReviewConfirmModal';
import { Modal } from '@/components/ui/Modal/Modal';

const meta: Meta<typeof DeleteReviewConfirmModal> = {
  title: 'Reviews/DeleteReviewConfirmModal',
  component: DeleteReviewConfirmModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof DeleteReviewConfirmModal>;

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
          삭제 확인 열기
        </button>
        {isOpen ? (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <DeleteReviewConfirmModal
              onClose={() => setIsOpen(false)}
              onConfirm={() => setIsOpen(false)}
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
    onClose: () => {},
    onConfirm: () => {},
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
