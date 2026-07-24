import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AddressCard } from './AddressCard';

const meta: Meta<typeof AddressCard> = {
  title: 'UI/AddressCard',
  component: AddressCard,
  tags: ['autodocs'],
  argTypes: {
    isSelected: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof AddressCard>;

const SAMPLE_ADDRESS = {
  zipCode: '04538',
  roadAddress:
    '서울 중구 삼일대로 343 (대신파이낸스센터 Daishin Finance Center)',
  lotAddress: '서울 중구 저동1가 114',
};

export const Default: Story = {
  args: {
    ...SAMPLE_ADDRESS,
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    ...SAMPLE_ADDRESS,
    isSelected: true,
  },
};
