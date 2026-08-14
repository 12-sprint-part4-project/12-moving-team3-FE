'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ReportAction } from '@/components/reports/ReportAction';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ReportAction> = {
  title: 'Reports/ReportAction',
  component: ReportAction,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
              <div className="bg-background-200 p-8">
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

type Story = StoryObj<typeof ReportAction>;

/** 비로그인 시 클릭하면 로그인 필요 토스트 */
export const Default: Story = {
  args: {
    target: 'USER',
    targetId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  },
};
