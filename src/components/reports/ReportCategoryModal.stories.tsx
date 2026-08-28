'use client';

import { useState } from 'react';

import { ReportCategoryModal } from '@/components/reports/ReportCategoryModal';
import { Modal } from '@/components/ui/Modal/Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReportCategoryModal> = {
  title: 'Reports/ReportCategoryModal',
  component: ReportCategoryModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ReportCategoryModal>;

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
          신고 모달 열기
        </button>
        {isOpen ? (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <ReportCategoryModal
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
