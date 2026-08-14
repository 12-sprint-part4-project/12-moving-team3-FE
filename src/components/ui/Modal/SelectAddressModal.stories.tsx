'use client';

import { useState } from 'react';

import { Modal } from './Modal';
import { SelectAddressModal, type AddressOption } from './SelectAddressModal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const SAMPLE_ADDRESSES: AddressOption[] = [
  {
    id: '1',
    zipCode: '04538',
    roadAddress:
      '서울 중구 삼일대로 343 (대신파이낸스센터 Daishin Finance Center)',
    lotAddress: '서울 중구 저동1가 114',
  },
  {
    id: '2',
    zipCode: '04539',
    roadAddress: '서울 중구 을지로 100',
    lotAddress: '서울 중구 을지로2가 11',
  },
];

const meta: Meta<typeof SelectAddressModal> = {
  title: 'UI/Modal/SelectAddressModal',
  component: SelectAddressModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};
export default meta;

type Story = StoryObj<typeof SelectAddressModal>;

export const WithModalShell: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [addresses, setAddresses] = useState<AddressOption[]>([]);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background-200">
        <button
          type="button"
          className="rounded-lg bg-blue-300 px-4 py-2 text-lg-semibold text-white"
          onClick={() => setIsOpen(true)}
        >
          출발지 선택 열기
        </button>
        {isOpen && (
          <Modal onClose={() => setIsOpen(false)}>
            <SelectAddressModal
              title="출발지를 선택해주세요"
              addresses={addresses}
              onSearchChange={(query) => {
                // 스토리용: 글자가 있으면 샘플 주소를 보여준다
                setAddresses(query.trim() ? SAMPLE_ADDRESSES : []);
              }}
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
    title: '출발지를 선택해주세요',
    addresses: SAMPLE_ADDRESSES,
    onClose: () => {},
    onSubmit: () => {},
  },
};
