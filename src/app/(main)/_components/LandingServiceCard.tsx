import { cn } from '@/lib/utils';

export type LandingServiceCardVariant = 'tall' | 'wide';

export interface LandingServiceCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  variant: LandingServiceCardVariant;
  /** 일러스트 위치·크기 오버라이드 (Figma mask inset) */
  imageClassName?: string;
  className?: string;
}

const VARIANT_STYLE: Record<LandingServiceCardVariant, string> = {
  tall: 'h-[37.375rem] w-[27rem] bg-blue-100',
  wide: 'h-[17.9375rem] w-[47.75rem] bg-white',
};

/**
 * 랜딩 서비스 카드.
 * Figma "img/landing/md_01|02|03" — tall=소형이사, wide=가정/사무실.
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
      'relative overflow-hidden rounded-4xl shadow-[0.25rem_0.25rem_0.3125rem_0_rgb(225_225_225_/_0.1)]',
      VARIANT_STYLE[variant],
      className
    )}
  >
    <div className="relative z-10 flex flex-col gap-2 px-[2.625rem] pt-10">
      <h2 className="text-2xl-semibold text-black-500">{title}</h2>
      <p className="text-xl-regular text-gray-400">{description}</p>
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
