'use client';

import { useState } from 'react';

import { SAMPLE_WRITABLE_QUOTE } from '@/components/reviews/_fixtures/reviewFixtures';
import { WriteReviewModal } from '@/components/reviews/WriteReviewModal';
import { Modal } from '@/components/ui/Modal/Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof WriteReviewModal> = {
  title: 'Reviews/WriteReviewModal',
  component: WriteReviewModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof WriteReviewModal>;

/** Modal 셸과 조합해 실제 사용 형태를 확인 */
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
          리뷰 쓰기 열기
        </button>
        {isOpen && (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <WriteReviewModal
              quote={SAMPLE_WRITABLE_QUOTE}
              onClose={() => setIsOpen(false)}
              onSubmit={() => {
                setIsOpen(false);
              }}
            />
          </Modal>
        )}
      </div>
    );
  },
};

/** 콘텐츠 패널만 (셸 없이) */
export const PanelOnly: Story = {
  args: {
    quote: SAMPLE_WRITABLE_QUOTE,
    onClose: () => {},
    onSubmit: () => {},
  },
};
