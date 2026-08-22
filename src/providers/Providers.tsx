import { AuthProvider } from '@/providers/AuthProvider';
import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { NotificationSseProvider } from '@/providers/NotificationSseProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';

import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider>
            <ChatSocketProvider>
              <NotificationSseProvider>{children}</NotificationSseProvider>
            </ChatSocketProvider>
          </ToastProvider>
        </AuthProvider>
      </QueryProvider>
    </I18nProvider>
  );
}
