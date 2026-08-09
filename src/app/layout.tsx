import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthRouteGuard } from '@/components/auth/AuthRouteGuard';
import { ProfileIncompleteRouteGuard } from '@/components/auth/ProfileIncompleteRouteGuard';
import { SuspendedRouteGuard } from '@/components/auth/SuspendedRouteGuard';
import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton/ScrollToTopButton';
import { AuthProvider } from '@/providers/AuthProvider';
import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import { NotificationSseProvider } from '@/providers/NotificationSseProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '무빙',
    template: '%s | 무빙',
  },
  description: '원하는 이사 서비스를 요청하고 견적을 받아보세요',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <ChatSocketProvider>
                <NotificationSseProvider>
                  <Header />
                  <main className="flex flex-1 flex-col">
                    <AuthRouteGuard>
                      <SuspendedRouteGuard>
                        <ProfileIncompleteRouteGuard>
                          {children}
                        </ProfileIncompleteRouteGuard>
                      </SuspendedRouteGuard>
                    </AuthRouteGuard>
                  </main>
                  <ScrollToTopButton />
                </NotificationSseProvider>
              </ChatSocketProvider>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
