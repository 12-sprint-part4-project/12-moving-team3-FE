'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';
import { useTranslation } from '@/i18n/useTranslation';

/** 정지(기능 제한) 계정 안내 */
const SuspendedPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col bg-background-200">
      <div className="flex w-full flex-1 flex-col justify-center gap-4 py-6 md:py-12">
        <div className="page-content flex flex-col items-center gap-8 md:gap-6">
          <div className="flex flex-col items-center gap-8 md:gap-10">
            <Image
              src="/images/empty.svg"
              alt=""
              width={184}
              height={136}
              className="h-34 w-46"
              priority
            />
            <div className="flex flex-col items-center gap-2" role="alert">
              <h1 className="text-center text-2lg-bold text-black-400 md:text-2xl-semibold">
                {t('auth.suspended.title')}
              </h1>
              <p className="text-center text-lg-regular text-gray-400 md:text-xl-regular">
                {t('auth.suspended.line1')}
                <br className="md:hidden" /> {t('auth.suspended.line2')}
              </p>
              <p className="text-center text-md-regular text-gray-300 md:text-lg-regular">
                {t('auth.suspended.hint')}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="solid"
            size="sm"
            className="max-w-[12.25rem] px-6 md:h-16 md:text-xl-semibold"
            onClick={handleGoBack}
          >
            {t('auth.suspended.goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedPage;
