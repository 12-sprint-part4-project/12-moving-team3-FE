import Image from 'next/image';

import { cn } from '@/lib/utils';

export type LandingServiceCardVariant = 'tall' | 'wide';

interface LandingServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  variant: LandingServiceCardVariant;
  imageClassName?: string;
  className?: string;
  /** above-the-fold LCP — Next.js preload (+ fetchPriority high) */
  preload?: boolean;
}

const VARIANT_STYLE: Record<LandingServiceCardVariant, string> = {
  tall: 'h-[15rem] w-full bg-blue-100 lg:h-[37.375rem] lg:w-[27rem]',
  wide: 'h-[15rem] w-full bg-white lg:h-[17.9375rem] lg:w-[47.75rem]',
};

/** 랜딩 서비스 카드 */
export const LandingServiceCard = ({
  title,
  description,
  imageSrc,
  imageAlt,
  variant,
  imageClassName = '',
  className = '',
  preload = false,
}: LandingServiceCardProps) => (
  <article
    className={cn(
      'relative max-w-[20.4375rem] overflow-hidden rounded-3xl shadow-card lg:max-w-none lg:rounded-4xl',
      VARIANT_STYLE[variant],
      className
    )}
  >
    <div className="relative z-10 flex flex-col gap-1 px-[1.875rem] pt-6 lg:gap-2 lg:px-[2.625rem] lg:pt-10">
      <h2 className="text-xl-semibold text-black-500 lg:text-2xl-semibold">
        {title}
      </h2>
      <p className="text-md-regular text-gray-400 lg:text-xl-regular">
        {description}
      </p>
    </div>
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={474}
      height={304}
      preload={preload}
      fetchPriority={preload ? 'high' : undefined}
      className={cn(
        'pointer-events-none absolute max-w-none object-contain',
        imageClassName
      )}
    />
  </article>
);
