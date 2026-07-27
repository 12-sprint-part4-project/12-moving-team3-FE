'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from './Modal';
import { RejectRequestModal } from './RejectRequestModal';

const meta: Meta<typeof RejectRequestModal> = {
  title: 'UI/Modal/RejectRequestModal',
  component: RejectRequestModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof RejectRequestModal>;

const SAMPLE = {
  moveType: 'small' as const,
  isDesignated: true,
  customerName: '김코드',
  moveDate: '2024. 07. 01(월)',
  departure: '서울시 중구',
  arrival: '경기도 수원시',
};

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
          반려요청 열기
        </button>
        {isOpen && (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <RejectRequestModal
              {...SAMPLE}
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

export const PanelOnly: Story = {
  args: {
    ...SAMPLE,
    onClose: () => {},
    onSubmit: () => {},
  },
};
