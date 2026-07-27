import Link from 'next/link';

import { LandingServiceCard } from '@/app/(main)/_components/LandingServiceCard';
import { cn } from '@/lib/utils';

const LANDING_SERVICES = [
  {
    title: '소형이사',
    description: '원룸, 투룸, 20평대 미만',
    imageSrc: '/images/landing/small-move.png',
    imageAlt: '소형이사 일러스트',
    variant: 'tall' as const,
    imageClassName: 'top-[43.5%] left-[18.5%] h-[19rem] w-[29.625rem]',
  },
  {
    title: '가정이사',
    description: '쓰리룸, 20평대 미만',
    imageSrc: '/images/landing/home-move.png',
    imageAlt: '가정이사 일러스트',
    variant: 'wide' as const,
    imageClassName: 'top-[12.9%] left-[40.7%] h-[18.125rem] w-[30.375rem]',
  },
  {
    title: '기업, 사무실 이사',
    description: '사무실, 상업공간',
    imageSrc: '/images/landing/office-move.png',
    imageAlt: '기업·사무실 이사 일러스트',
    variant: 'wide' as const,
    imageClassName: 'top-[23.7%] left-[35%] h-[13.6875rem] w-[33.0625rem]',
  },
] as const;

const CTA_BASE_STYLE =
  'inline-flex h-16 w-[21.25rem] shrink-0 items-center justify-center rounded-full text-xl-semibold transition-colors';

/**
 * 랜딩 페이지 (Desktop).
 * Figma "랜딩 페이지Desktop" (1:9758).
 * GNB는 루트 layout의 Header(GnbLanding)를 재사용한다.
 */
const HomePage = () => {
  const [smallMove, homeMove, officeMove] = LANDING_SERVICES;

  return (
    <section className="flex min-h-full flex-col items-center bg-background-400 px-6 pt-20 pb-16">
      <h1 className="text-center text-3xl-semibold text-black-500">
        원하는 이사 서비스를 요청하고
        <br />
        견적을 받아보세요
      </h1>

      <div className="mt-12 flex items-stretch gap-6">
        <LandingServiceCard {...smallMove} />
        <div className="flex flex-col gap-6">
          <LandingServiceCard {...homeMove} />
          <LandingServiceCard {...officeMove} />
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4">
        <Link
          href="/login"
          className={cn(
            CTA_BASE_STYLE,
            'bg-blue-300 text-white shadow-cta hover:bg-blue-200'
          )}
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className={cn(
            CTA_BASE_STYLE,
            'border border-blue-300 bg-white text-blue-300 shadow-cta hover:bg-blue-50 hover:shadow-cta-hover'
          )}
        >
          회원가입
        </Link>
      </div>
    </section>
  );
};

export default HomePage;
