'use client';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReviewListItem } from '@/components/reviews/ReviewListItem';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const meta: Meta<typeof ReviewListItem> = {
  title: 'Reviews/ReviewListItem',
  component: ReviewListItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
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
              <div className="mx-auto max-w-[37.5rem] bg-white px-6">
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

type Story = StoryObj<typeof ReviewListItem>;

export const Default: Story = {
  args: {
    reviewId: 1,
    customerName: 'kim고객',
    createdAt: '2024-07-01T12:00:00.000Z',
    rating: 5,
    content:
      '기사님이 친절하시고 짐도 꼼꼼하게 옮겨주셨어요. 다음에도 부탁드리고 싶습니다.',
  },
};

export const PartialRating: Story = {
  args: {
    reviewId: 2,
    customerName: '이가입',
    createdAt: '2024-06-15T09:30:00.000Z',
    rating: 3,
    content: '전반적으로 괜찮았습니다.',
  },
};
