import { LandingAuthCta } from '@/app/(main)/_components/LandingAuthCta';
import { LandingServiceCard } from '@/app/(main)/_components/LandingServiceCard';

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

/**
 * 랜딩 페이지.
 * Figma Mobile(1:9767) · Tablet(1:9734) · Desktop(1:9758).
 * Mobile/Tablet은 동일 세로 스택(sm 카드), Desktop만 좌·우 그리드.
 * GNB는 루트 layout의 Header(GnbLanding sm|md|lg)를 재사용한다.
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

      {/* Mobile · Tablet: 세로 스택 (Figma 1:9767 · 1:9734) */}
      <div className="mt-11 flex w-full max-w-[20.4375rem] flex-col gap-9 lg:hidden">
        {/* 첫 카드만 LCP preload — 데스크톱 트리와 동일 src라 한쪽에만 */}
        <LandingServiceCard {...smallMove} preload />
        <LandingServiceCard {...homeMove} />
        <LandingServiceCard {...officeMove} />
      </div>

      {/* Desktop: 좌 tall + 우 wide 2단 (Figma 1:9758) */}
      <div className="mt-12 hidden items-stretch gap-6 lg:flex">
        <LandingServiceCard {...smallMove} />
        <div className="flex flex-col gap-6">
          <LandingServiceCard {...homeMove} />
          <LandingServiceCard {...officeMove} />
        </div>
      </div>

      <LandingAuthCta />
    </section>
  );
};

export default HomePage;
