'use client';

import { CommunityFurnitureShareCtaAction } from './CommunityFurnitureShareCtaAction';

import type { FurnitureShareDetailAction } from '@/lib/communityFurnitureShare';

interface CommunityFurnitureShareDetailActionsProps {
  action: FurnitureShareDetailAction | null;
  onChatClick?: () => void;
  onCompleteClick?: () => void;
  isChatPending?: boolean;
  className?: string;
}

/** 가구나눔 상세 — beforeHeader 슬롯용 CTA 분기 */
export const CommunityFurnitureShareDetailActions = ({
  action,
  onChatClick,
  onCompleteClick,
  isChatPending = false,
  className = '',
}: CommunityFurnitureShareDetailActionsProps) => {
  if (action === null) {
    return null;
  }

  if (action === 'chat') {
    return (
      <CommunityFurnitureShareCtaAction
        variant="chat"
        onClick={onChatClick}
        isPending={isChatPending}
        className={className}
      />
    );
  }

  if (action === 'complete') {
    return (
      <CommunityFurnitureShareCtaAction
        variant="complete"
        onClick={onCompleteClick}
        className={className}
      />
    );
  }

  return (
    <CommunityFurnitureShareCtaAction
      variant="complete"
      asStatus
      className={className}
    />
  );
};
