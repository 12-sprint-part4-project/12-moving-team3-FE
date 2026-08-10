import { cn } from '@/lib/utils';

import { FURNITURE_SHARE_COMPLETE_LABEL } from './communityFurnitureShareStyles';

interface CommunityFurnitureShareCompletedBadgeProps {
  className?: string;
}

/** 가구나눔 — 나눔 완료 뱃지 (목록·상세) */
export const CommunityFurnitureShareCompletedBadge = ({
  className = '',
}: CommunityFurnitureShareCompletedBadgeProps) => (
  <span
    className={cn(
      'inline-flex w-fit shrink-0 items-center rounded bg-background-300 px-1.5 py-0.5 text-md-medium text-gray-400',
      'min-[46.5rem]:text-lg-medium xl:text-2lg-medium',
      className
    )}
  >
    {FURNITURE_SHARE_COMPLETE_LABEL}
  </span>
);
