'use client';

import { useState } from 'react';

import { Modal } from './Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof Modal>;

/**
 * Modal 셸 + Figma dimmer(#141414 / 50%) 확인용.
 * 기본 placement="center" — sm 이하에서도 dimmer 안 중앙에 뜬다.
 * (createPortal로 body에 그려지므로 Storybook iframe 전체 화면을 덮는다.)
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="min-h-screen bg-background-100 p-8">
        <header className="mb-8 flex items-center justify-between border-b border-line-100 pb-4">
          <p className="text-2xl-semibold text-black-400">페이지 헤더 예시</p>
          <button
            type="button"
            className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
            onClick={() => setIsOpen(true)}
          >
            모달 열기
          </button>
        </header>

        <main className="space-y-4">
          <p className="text-xl-semibold text-black-300">본문 콘텐츠</p>
          <p className="text-lg-regular text-black-200">
            모달을 열면 이 영역이 Figma dimmer(#141414, opacity 50%)로
            가려집니다. dimmer 영역 클릭 또는 ESC로 닫을 수 있습니다.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-line-100 bg-white p-6 shadow-sm"
              >
                <p className="text-lg-semibold text-black-400">
                  카드 {index + 1}
                </p>
                <p className="mt-2 text-md-regular text-gray-500">
                  배경이 보이면 dimmer 농도를 비교하기 쉽습니다.
                </p>
              </div>
            ))}
          </div>
        </main>

        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-lg">
              <p className="text-2lg-semibold text-black-400">모달 셸 예시</p>
              <p className="mt-2 text-lg-regular text-black-300">
                뒤의 페이지가 반투명하게 보이면 dimmer가 정상 동작 중입니다.
              </p>
            </div>
          </Modal>
        )}
      </div>
    );
  },
};
