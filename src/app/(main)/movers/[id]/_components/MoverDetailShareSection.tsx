'use client';

import { MoverShareButtons } from '@/components/movers/MoverShareButtons';
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
  return (
    <section
      className={cn(
        'flex flex-col gap-4 border-b border-line-100 py-6 xl:hidden',
        className
      )}
    >
      <p className="text-md-semibold text-black-400 tablet:text-lg-semibold">
        나만 알기엔 아쉬운 기사님인가요?
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
