'use client';

import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
import { useTranslation } from '@/i18n/useTranslation';
import { cn } from '@/lib/utils';

export interface MoverDetailShareSectionProps {
  name: string;
  description?: string | null;
  profileImageUrl?: string | null;
  className?: string;
}

/** Tablet / Mobile 본문 중간 공유 영역 */
export const MoverDetailShareSection = ({
  name,
  description = null,
  profileImageUrl = null,
  className = '',
}: MoverDetailShareSectionProps) => {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        'flex flex-col gap-4 border-b border-line-100 py-6 xl:hidden',
        className
      )}
    >
      <p className="text-md-semibold text-black-400 tablet:text-lg-semibold">
        {t('movers.shareHint')}
      </p>
      <MoverShareButtons
        size="xs"
        name={name}
        description={description}
        profileImageUrl={profileImageUrl}
      />
    </section>
  );
};
