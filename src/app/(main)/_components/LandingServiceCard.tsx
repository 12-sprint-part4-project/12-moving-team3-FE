import { cn } from '@/lib/utils';

export type LandingServiceCardVariant = 'tall' | 'wide';

export interface LandingServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  variant: LandingServiceCardVariant;
  /** 일러스트 위치·크기 (반응형 클래스 포함 가능) */
  imageClassName?: string;
  className?: string;
}

const VARIANT_STYLE: Record<LandingServiceCardVariant, string> = {
  tall: 'h-[15rem] w-full bg-blue-100 lg:h-[37.375rem] lg:w-[27rem]',
  wide: 'h-[15rem] w-full bg-white lg:h-[17.9375rem] lg:w-[47.75rem]',
};

/**
 * 랜딩 서비스 카드.
 * Figma img/landing sm(Mobile·Tablet) · md(Desktop).
 */
export const LandingServiceCard = ({
  title,
  description,
  imageSrc,
  imageAlt,
  variant,
  imageClassName,
  className,
}: LandingServiceCardProps) => (
  <article
    className={cn(
      'relative max-w-[20.4375rem] overflow-hidden rounded-3xl shadow-[0.25rem_0.25rem_0.3125rem_0_rgb(225_225_225_/_0.1)] lg:max-w-none lg:rounded-4xl',
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
    <img
      src={imageSrc}
      alt={imageAlt}
      className={cn(
        'pointer-events-none absolute max-w-none object-contain',
        imageClassName
      )}
    />
  </article>
);
