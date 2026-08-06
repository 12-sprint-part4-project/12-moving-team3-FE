'use client';

import ChatIcon from '@/assets/icons/chat.svg';
import CheckIcon from '@/assets/icons/check.svg';

import { cn } from '@/lib/utils';

import {
  COMMUNITY_FURNITURE_SHARE_CTA_BUTTON_CLASS,
  COMMUNITY_FURNITURE_SHARE_CTA_CHECK_ICON_CLASS,
  COMMUNITY_FURNITURE_SHARE_CTA_ICON_CLASS,
  COMMUNITY_FURNITURE_SHARE_CTA_LABEL_CLASS,
  FURNITURE_SHARE_CHAT_CTA_LABEL,
  FURNITURE_SHARE_COMPLETE_LABEL,
} from '../../../_components/communityFurnitureShareStyles';

type FurnitureShareCtaVariant = 'chat' | 'complete';

interface CommunityFurnitureShareCtaActionProps {
  variant: FurnitureShareCtaVariant;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  isPending?: boolean;
  /** complete 전용 — 완료 후 상태 표시 */
  asStatus?: boolean;
}

/** 가구나눔 상세 — 본문과 댓글 사이 CTA pill */
export const CommunityFurnitureShareCtaAction = ({
  variant,
  className = '',
  onClick,
  disabled = false,
  isPending = false,
  asStatus = false,
}: CommunityFurnitureShareCtaActionProps) => {
  const label =
    variant === 'chat'
      ? FURNITURE_SHARE_CHAT_CTA_LABEL
      : FURNITURE_SHARE_COMPLETE_LABEL;

  const isDisabled = disabled || isPending;
  const pillClassName = cn(
    COMMUNITY_FURNITURE_SHARE_CTA_BUTTON_CLASS,
    variant === 'complete' && asStatus && 'cursor-default opacity-60'
  );

  const icon =
    variant === 'chat' ? (
      <ChatIcon
        className={COMMUNITY_FURNITURE_SHARE_CTA_ICON_CLASS}
        aria-hidden
      />
    ) : (
      <CheckIcon
        className={cn(
          COMMUNITY_FURNITURE_SHARE_CTA_ICON_CLASS,
          COMMUNITY_FURNITURE_SHARE_CTA_CHECK_ICON_CLASS
        )}
        aria-hidden
      />
    );

  const content = (
    <>
      {icon}
      <span className={COMMUNITY_FURNITURE_SHARE_CTA_LABEL_CLASS}>
        {label}
      </span>
    </>
  );

  if (variant === 'complete' && asStatus) {
    return (
      <div className={cn('flex justify-center', className)}>
        <div className={pillClassName} aria-label={label}>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex justify-center', className)}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          pillClassName,
          isDisabled
            ? 'cursor-not-allowed opacity-60'
            : 'cursor-pointer hover:bg-background-200'
        )}
      >
        {content}
      </button>
    </div>
  );
};
