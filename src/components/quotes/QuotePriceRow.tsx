import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export interface QuotePriceRowProps {
  priceLabel: string;
  className?: string;
}

/** 견적 금액 행 */
export const QuotePriceRow = ({
  priceLabel,
  className = '',
}: QuotePriceRowProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex w-full items-end justify-end gap-2 lg:h-10 lg:gap-4',
        className
      )}
    >
      <p className="text-md-medium text-black-400 lg:text-2lg-medium">
        {t('quotes.price')}
      </p>
      <p className="text-2lg-bold text-black-400 lg:text-2xl-bold">
        {priceLabel}
      </p>
    </div>
  );
};
