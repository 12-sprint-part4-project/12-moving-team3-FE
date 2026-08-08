import Image from 'next/image';
import Link from 'next/link';

import { getButtonClassName } from '@/components/Button/Button';
import { cn } from '@/lib/utils';

/** 404 — 존재하지 않는 경로 안내 */
const NotFoundPage = () => (
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
          </div>
        </div>

        <Link
          href="/"
          className={getButtonClassName({
            size: 'sm',
            variant: 'solid',
            className: cn(
              'max-w-[12.25rem] px-6 md:h-16 md:text-xl-semibold',
              'focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:outline-none'
            ),
          })}
        >
          홈으로
        </Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
