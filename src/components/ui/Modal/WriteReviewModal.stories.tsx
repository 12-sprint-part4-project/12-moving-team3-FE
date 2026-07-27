'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from './Modal';
import { WriteReviewModal } from './WriteReviewModal';

const meta: Meta<typeof WriteReviewModal> = {
  title: 'UI/Modal/WriteReviewModal',
  component: WriteReviewModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof WriteReviewModal>;

const SAMPLE = {
  moveType: 'small' as const,
  isDesignated: true,
  moverName: '김코드',
  moveDate: '2024. 07. 01',
  quotePrice: '210,000원',
};

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
              {...SAMPLE}
              onClose={() => setIsOpen(false)}
              onSubmit={(review) => {
                console.log(review);
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
    ...SAMPLE,
    onClose: () => {},
    onSubmit: () => {},
  },
};
