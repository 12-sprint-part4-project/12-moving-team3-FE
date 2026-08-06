'use client';

import type { FurnitureShareDetailAction } from '@/lib/communityFurnitureShare';

import { CommunityFurnitureShareCtaAction } from './CommunityFurnitureShareCtaAction';

interface CommunityFurnitureShareDetailActionsProps {
  action: FurnitureShareDetailAction | null;
  onChatClick?: () => void;
  onCompleteClick?: () => void;
  isChatPending?: boolean;
}

/** 가구나눔 상세 — beforeHeader 슬롯용 CTA 분기 */
export const CommunityFurnitureShareDetailActions = ({
  action,
  onChatClick,
  onCompleteClick,
  isChatPending = false,
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
      />
    );
  }

  if (action === 'complete') {
    return (
      <CommunityFurnitureShareCtaAction
        variant="complete"
        onClick={onCompleteClick}
      />
    );
  }

  return <CommunityFurnitureShareCtaAction variant="complete" asStatus />;
};
