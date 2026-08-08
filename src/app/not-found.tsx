'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/Button/Button';

const REDIRECT_SECONDS = 5;

/** 404 — 존재하지 않는 경로 안내 후 홈으로 이동 */
const NotFoundPage = () => {
  const router = useRouter();
  const [remainingSeconds, setRemainingSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      router.replace('/');
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [remainingSeconds, router]);

  const handleGoHome = () => {
    router.replace('/');
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
            <div className="flex flex-col items-center gap-2" role="status">
              <h1 className="text-center text-2lg-bold text-black-400 md:text-2xl-semibold">
                페이지를 찾을 수 없어요
              </h1>
              <p className="text-center text-lg-regular text-gray-400 md:text-xl-regular">
                요청하신 페이지가 존재하지 않거나
                <br className="md:hidden" /> 이동되었을 수 있어요.
              </p>
              <p className="text-center text-md-regular text-gray-300 md:text-lg-regular">
                {remainingSeconds}초 후 홈으로 이동해요.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="solid"
            size="sm"
            className="max-w-[12.25rem] px-6 md:h-16 md:text-xl-semibold"
            onClick={handleGoHome}
          >
            홈으로
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
