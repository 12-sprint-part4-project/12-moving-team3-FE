'use client';

import { MoverShareButtons } from '@/components/movers/MoverShareButtons';

/** Tablet / Mobile 본문 중간 공유 영역 */
export const MoverDetailShareSection = () => {
  return (
    <section className="flex flex-col gap-4 border-b border-line-100 py-6 xl:hidden">
      <p className="text-md-semibold text-black-400 md:text-lg-semibold">
        나만 알기엔 아쉬운 기사님인가요?
      </p>
      <MoverShareButtons size="xs" />
    </section>
  );
};
