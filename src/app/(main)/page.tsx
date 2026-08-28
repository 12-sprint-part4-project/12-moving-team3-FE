import { getServerTranslation } from '@/i18n/getServerTranslation';

import { LandingAuthCta } from './_components/LandingAuthCta';
import { LandingServiceCard } from './_components/LandingServiceCard';

const HomePage = async () => {
  const { t } = await getServerTranslation();

  const landingServices = [
    {
      title: t('landing.smallMove.title'),
      description: t('landing.smallMove.description'),
      imageSrc: '/images/landing/small-move.png',
      imageAlt: t('landing.smallMove.imageAlt'),
      variant: 'tall' as const,
      imageClassName:
        'right-[-1.5rem] bottom-0 h-[9.5rem] w-[14.5rem] lg:top-[43.5%] lg:right-auto lg:bottom-auto lg:left-[18.5%] lg:h-[19rem] lg:w-[29.625rem]',
    },
    {
      title: t('landing.homeMove.title'),
      description: t('landing.homeMove.description'),
      imageSrc: '/images/landing/home-move.png',
      imageAlt: t('landing.homeMove.imageAlt'),
      variant: 'wide' as const,
      imageClassName:
        'right-[-2rem] bottom-0 h-[9rem] w-[15.5rem] lg:top-[12.9%] lg:right-auto lg:bottom-auto lg:left-[40.7%] lg:h-[18.125rem] lg:w-[30.375rem]',
    },
    {
      title: t('landing.officeMove.title'),
      description: t('landing.officeMove.description'),
      imageSrc: '/images/landing/office-move.png',
      imageAlt: t('landing.officeMove.imageAlt'),
      variant: 'wide' as const,
      imageClassName:
        'right-[-0.5rem] bottom-0 h-[8.25rem] w-[18.5rem] lg:top-[23.7%] lg:right-auto lg:bottom-auto lg:left-[35%] lg:h-[13.6875rem] lg:w-[33.0625rem]',
    },
  ] as const;

  const [smallMove, homeMove, officeMove] = landingServices;

  return (
    <section className="flex min-h-full flex-col items-center bg-background-400 px-6 pt-16 pb-16 lg:pt-20">
      <h1 className="text-center text-2xl-semibold text-black-500 lg:text-3xl-semibold">
        {t('landing.heroLine1')}
        <br />
        {t('landing.heroLine2')}
      </h1>

      <div className="mt-11 flex w-full max-w-[20.4375rem] flex-col gap-9 lg:hidden">
        <LandingServiceCard {...smallMove} preload />
        <LandingServiceCard {...homeMove} />
        <LandingServiceCard {...officeMove} />
      </div>

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
