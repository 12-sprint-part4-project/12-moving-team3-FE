import localFont from 'next/font/local';

import { Guards } from '@/components/auth/Guards';
import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton/ScrollToTopButton';
import { Providers } from '@/providers/Providers';

import './globals.css';

import type { Metadata, Viewport } from 'next';

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

/** Android Chrome 등 — 가상 키보드가 layout viewport를 줄이도록 (채팅 입력 UX) */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} h-full min-w-[320px] antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <Header />
          <main className="flex flex-1 flex-col">
            <Guards>{children}</Guards>
          </main>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
}
