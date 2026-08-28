import { RECEIVED_CARD_SKELETON_COUNT } from './constants';
import { ReceivedQuoteCardSkeleton } from './ReceivedQuoteCardSkeleton';

/** 받았던 견적 그룹(견적 정보 + 견적서 목록) 스켈레톤 */
export const ReceivedQuoteGroupSkeleton = () => (
  <section
    className="flex w-full flex-col gap-6 rounded-2xl bg-white px-4 py-6 md:gap-8 md:px-8 md:py-8 lg:gap-10 lg:px-10 lg:py-12"
    aria-hidden
  >
    <div className="flex w-full flex-col gap-4 lg:gap-8">
      <div className="h-6 w-20 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-24" />
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-background-200 px-5 py-4 md:gap-2 md:px-10 md:py-8 lg:gap-2.5">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-start gap-10 lg:gap-8">
            <div className="h-5 w-[4.0625rem] shrink-0 animate-pulse rounded bg-line-100 motion-reduce:animate-none lg:h-6 lg:w-[5.75rem]" />
            <div className="h-5 w-full max-w-[12rem] animate-pulse rounded bg-line-100 motion-reduce:animate-none lg:h-6 lg:max-w-[16rem]" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex w-full flex-col gap-3 md:gap-4 lg:gap-6">
      <div className="h-6 w-24 animate-pulse rounded bg-background-200 motion-reduce:animate-none lg:h-8 lg:w-28" />
      <div className="flex gap-2">
        <div className="h-9 w-16 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
        <div className="h-9 w-20 animate-pulse rounded-full bg-background-200 motion-reduce:animate-none" />
      </div>
      <ul className="m-0 flex w-full list-none flex-col gap-6 p-0 lg:gap-8">
        {Array.from({ length: RECEIVED_CARD_SKELETON_COUNT }, (_, index) => (
          <li key={index}>
            <ReceivedQuoteCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  </section>
);
