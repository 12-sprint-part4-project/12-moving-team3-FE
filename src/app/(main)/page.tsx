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
    imageClassName:
      'right-[-1.5rem] bottom-0 h-[9.5rem] w-[14.5rem] lg:top-[43.5%] lg:right-auto lg:bottom-auto lg:left-[18.5%] lg:h-[19rem] lg:w-[29.625rem]',
  },
  {
    title: '가정이사',
    description: '쓰리룸, 20평대 미만',
    imageSrc: '/images/landing/home-move.png',
    imageAlt: '가정이사 일러스트',
    variant: 'wide' as const,
    imageClassName:
      'right-[-2rem] bottom-0 h-[9rem] w-[15.5rem] lg:top-[12.9%] lg:right-auto lg:bottom-auto lg:left-[40.7%] lg:h-[18.125rem] lg:w-[30.375rem]',
  },
  {
    title: '기업, 사무실 이사',
    description: '사무실, 상업공간',
    imageSrc: '/images/landing/office-move.png',
    imageAlt: '기업·사무실 이사 일러스트',
    variant: 'wide' as const,
    imageClassName:
      'right-[-0.5rem] bottom-0 h-[8.25rem] w-[18.5rem] lg:top-[23.7%] lg:right-auto lg:bottom-auto lg:left-[35%] lg:h-[13.6875rem] lg:w-[33.0625rem]',
  },
] as const;

const CTA_BASE_STYLE =
  'inline-flex h-[3.375rem] w-full shrink-0 items-center justify-center rounded-full text-lg-semibold transition-colors lg:h-16 lg:w-[21.25rem] lg:text-xl-semibold';

/**
 * 랜딩 페이지.
 * Figma Desktop(1:9758) · Tablet(1:9734).
 * GNB는 루트 layout의 Header(GnbLanding)를 재사용한다.
 */
const HomePage = () => {
  const [smallMove, homeMove, officeMove] = LANDING_SERVICES;

  return (
    <section className="flex min-h-full flex-col items-center bg-background-400 px-6 pt-16 pb-16 lg:pt-20">
      <h1 className="text-center text-2xl-semibold text-black-500 lg:text-3xl-semibold">
        원하는 이사 서비스를 요청하고
        <br />
        견적을 받아보세요
      </h1>

      {/* Tablet 이하: 세로 스택 (Figma 랜딩 페이지/Tablet) */}
      <div className="mt-11 flex w-full max-w-[20.4375rem] flex-col gap-9 lg:hidden">
        <LandingServiceCard {...smallMove} />
        <LandingServiceCard {...homeMove} />
        <LandingServiceCard {...officeMove} />
      </div>

      {/* Desktop: 좌 tall + 우 wide 2단 (Figma 랜딩 페이지Desktop) */}
      <div className="mt-12 hidden items-stretch gap-6 lg:flex">
        <LandingServiceCard {...smallMove} />
        <div className="flex flex-col gap-6">
          <LandingServiceCard {...homeMove} />
          <LandingServiceCard {...officeMove} />
        </div>
      </div>

      <div className="mt-11 flex w-full max-w-[20.4375rem] flex-col gap-2 lg:mt-12 lg:max-w-none lg:flex-row lg:items-center lg:gap-4">
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
