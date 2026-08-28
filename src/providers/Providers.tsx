import { AuthProvider } from '@/providers/AuthProvider';
import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { NotificationSseProvider } from '@/providers/NotificationSseProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';

import type { SupportedLanguage } from '@/i18n/config';
import type { ReactNode } from 'react';

interface ProvidersProps {
  initialLanguage: SupportedLanguage;
  children: ReactNode;
}

export const Providers = ({ initialLanguage, children }: ProvidersProps) => (
  <I18nProvider initialLanguage={initialLanguage}>
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
