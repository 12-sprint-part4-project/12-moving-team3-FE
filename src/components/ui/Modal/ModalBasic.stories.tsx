'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Modal } from './Modal';
import { ModalBasic } from './ModalBasic';
import { ModalCtaButton } from './ModalCtaButton';

const meta: Meta<typeof ModalBasic> = {
  title: 'UI/Modal/ModalBasic',
  component: ModalBasic,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof ModalBasic>;

/** Modal 셸과 조합 — render 콜백이 아닌 컴포넌트에서 Hook을 쓰도록 분리 */
const DesignatedQuoteRequestRender = () => {
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
          <ModalBasic
            title="지정 견적 요청하기"
            onClose={() => setIsOpen(false)}
            footer={
              <ModalCtaButton
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                일반 견적 요청 하기
              </ModalCtaButton>
            }
          >
            <p className="text-2lg-medium text-black-300">
              일반 견적 요청을 먼저 진행해 주세요.
            </p>
          </ModalBasic>
        </Modal>
      )}
    </div>
  );
};

/** Modal 셸과 조합 — 지정 견적 요청 안내(Figma) 예시 */
export const DesignatedQuoteRequest: Story = {
  render: DesignatedQuoteRequestRender,
};

/** 콘텐츠 패널만 (셸 없이) */
export const PanelOnly: Story = {
  args: {
    title: '지정 견적 요청하기',
    onClose: () => {},
    footer: (
      <ModalCtaButton onClick={() => {}}>일반 견적 요청 하기</ModalCtaButton>
    ),
    children: (
      <p className="text-2lg-medium text-black-300">
        일반 견적 요청을 먼저 진행해 주세요.
      </p>
    ),
  },
};
