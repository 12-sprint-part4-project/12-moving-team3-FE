'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { DesignatedQuoteRequestModal } from './DesignatedQuoteRequestModal';
import { Modal } from './Modal';

const meta: Meta<typeof DesignatedQuoteRequestModal> = {
  title: 'UI/Modal/DesignatedQuoteRequestModal',
  component: DesignatedQuoteRequestModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof DesignatedQuoteRequestModal>;

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
          지정 견적 요청 안내 열기
        </button>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <DesignatedQuoteRequestModal
              onClose={() => setIsOpen(false)}
              onConfirm={() => {
                console.log('일반 견적 요청으로 이동');
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
    onClose: () => {},
    onConfirm: () => {},
  },
};
