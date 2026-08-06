'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/Button/Button';

/** 정지(기능 제한) 계정 안내 — 비로그인과 동일한 범위로 이용 가능 */
const SuspendedPage = () => {
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
                계정이 정지되었어요
              </h1>
              <p className="text-center text-lg-regular text-gray-400 md:text-xl-regular">
                서비스 이용 정책 위반으로
                <br className="md:hidden" /> 일부 기능 이용이 제한되었습니다.
              </p>
              <p className="text-center text-md-regular text-gray-300 md:text-lg-regular">
                공개 기능은 계속 이용할 수 있어요.
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
            뒤로가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuspendedPage;
