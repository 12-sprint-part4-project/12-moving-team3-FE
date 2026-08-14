'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fn } from 'storybook/test';

import { MoverCard } from '@/components/movers/MoverCard';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';

import type { MoverCardModel } from '@/types/mover';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const SAMPLE_MOVER: MoverCardModel = {
  moverId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: '김코드',
  profileImageUrl: null,
  services: ['SMALL', 'HOME'],
  regions: ['SEOUL', 'GYEONGGI'],
  career: 5,
  shortDescription: '안전하고 빠른 이사를 약속드립니다.',
  description: '상세 설명입니다.',
  averageRating: 4.8,
  reviewCount: 128,
  ratingCounts: { 1: 0, 2: 1, 3: 5, 4: 20, 5: 102 },
  isFavorited: false,
  favoritedCount: 42,
  confirmedCount: 96,
  isDesignated: true,
};

const meta: Meta<typeof MoverCard> = {
  title: 'Movers/MoverCard',
  component: MoverCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    mover: SAMPLE_MOVER,
    onFavoriteClick: fn(),
  },
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: { retry: false },
          mutations: { retry: false },
        },
      });

      return (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ToastProvider>
              <div className="mx-auto max-w-[37.5rem] bg-background-200 p-6">
                <Story />
              </div>
            </ToastProvider>
          </AuthProvider>
        </QueryClientProvider>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof MoverCard>;

/** 목록·상세 기본 카드 — 신고 버튼 노출 */
export const Default: Story = {
  args: {
    size: 'lg',
  },
};

/** 상세 페이지 — 네비게이션 비활성 + 신고 노출 */
export const Detail: Story = {
  args: {
    size: 'lg',
    disableNavigation: true,
  },
};

/** 사이드바 찜 미리보기 — size=sm 이라 신고 숨김 */
export const CompactPreview: Story = {
  args: {
    size: 'sm',
  },
};

/** 찜한 기사님 목록 — 한 줄 소개 숨김, 신고 노출 */
export const FavoriteList: Story = {
  args: {
    size: 'lg',
    variant: 'favorite',
    mover: {
      ...SAMPLE_MOVER,
      isFavorited: true,
    },
  },
};
