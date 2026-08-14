import ClipIcon from '@/assets/icons/clip.svg';
import LikeActiveIcon from '@/assets/icons/like-active.svg';
import FacebookIcon from '@/assets/icons/symbol-facebook.svg';
import KakaoIcon from '@/assets/icons/symbol-kakao.svg';

import { IconButton } from './IconButton';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: { control: false },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'kakao', 'facebook'],
    },
  },
  args: {
    icon: ClipIcon,
    size: 'sm',
    variant: 'outlined',
    'aria-label': '링크 복사',
  },
};
export default meta;

type Story = StoryObj<typeof IconButton>;

/** 찜하기 (active 상태) — sm, md */
export const Like: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton
        icon={LikeActiveIcon}
        size="sm"
        aria-label="찜하기"
        className="text-blue-400"
      />
      <IconButton
        icon={LikeActiveIcon}
        size="md"
        aria-label="찜하기"
        className="text-blue-400"
      />
    </div>
  ),
};

/** 링크 복사 — xs, sm, md */
export const Clip: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton icon={ClipIcon} size="xs" aria-label="링크 복사" />
      <IconButton icon={ClipIcon} size="sm" aria-label="링크 복사" />
      <IconButton icon={ClipIcon} size="md" aria-label="링크 복사" />
    </div>
  ),
};

/** 카카오톡 공유 — xs, sm, md */
export const KakaoShare: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton
        icon={KakaoIcon}
        variant="kakao"
        size="xs"
        aria-label="카카오톡으로 공유하기"
      />
      <IconButton
        icon={KakaoIcon}
        variant="kakao"
        size="sm"
        aria-label="카카오톡으로 공유하기"
      />
      <IconButton
        icon={KakaoIcon}
        variant="kakao"
        size="md"
        aria-label="카카오톡으로 공유하기"
      />
    </div>
  ),
};

/** 페이스북 공유 — xs, sm, md */
export const FacebookShare: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton
        icon={FacebookIcon}
        variant="facebook"
        size="xs"
        aria-label="페이스북으로 공유하기"
      />
      <IconButton
        icon={FacebookIcon}
        variant="facebook"
        size="sm"
        aria-label="페이스북으로 공유하기"
      />
      <IconButton
        icon={FacebookIcon}
        variant="facebook"
        size="md"
        aria-label="페이스북으로 공유하기"
      />
    </div>
  ),
};
