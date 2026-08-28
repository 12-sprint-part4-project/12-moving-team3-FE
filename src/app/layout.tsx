import localFont from 'next/font/local';

import { Guards } from '@/components/auth/Guards';
import { Header } from '@/components/layout/Header';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton/ScrollToTopButton';
import { getServerTranslation } from '@/i18n/getServerTranslation';
import { Providers } from '@/providers/Providers';

import './globals.css';

import type { Metadata, Viewport } from 'next';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '45 920',
  display: 'swap',
});

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await getServerTranslation();

  return {
    title: {
      default: t('auth.brand'),
      template: t('meta.titleTemplate'),
    },
    description: t('meta.description'),
  };
};

/** Android Chrome 등 — 가상 키보드가 layout viewport를 줄이도록 (채팅 입력 UX) */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { language } = await getServerTranslation();

  return (
    <html
      lang={language}
      className={`${pretendard.variable} h-full min-w-[320px] antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers initialLanguage={language}>
          <Header />
          <main className="flex flex-1 flex-col">
            <Guards>{children}</Guards>
          </main>
          <ScrollToTopButton />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
