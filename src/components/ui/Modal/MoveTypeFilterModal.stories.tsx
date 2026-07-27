'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from './Modal';
import { MoveTypeFilterModal } from './MoveTypeFilterModal';

const meta: Meta<typeof MoveTypeFilterModal> = {
  title: 'UI/Modal/MoveTypeFilterModal',
  component: MoveTypeFilterModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof MoveTypeFilterModal>;

const SAMPLE_COUNTS = {
  all: 20,
  small: 4,
  home: 2,
  office: 10,
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
          이사 유형 필터 열기
        </button>
        {isOpen && (
          <Modal placement="bottom" onClose={() => setIsOpen(false)}>
            <MoveTypeFilterModal
              counts={SAMPLE_COUNTS}
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
    counts: SAMPLE_COUNTS,
    onClose: () => {},
    onSubmit: () => {},
  },
};

/** 초기 선택이 비어 있는 상태 */
export const EmptySelection: Story = {
  args: {
    counts: SAMPLE_COUNTS,
    defaultSelected: [],
    onClose: () => {},
    onSubmit: () => {},
  },
};
