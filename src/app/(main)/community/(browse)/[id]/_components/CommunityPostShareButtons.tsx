'use client';

import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { isKakaoShareConfigured, shareQuoteToKakao } from '@/lib/kakaoShare';
import { cn } from '@/lib/utils';

import {
  COMMUNITY_POST_ICON_GROUP_GAP_CLASS,
  COMMUNITY_SHARE_BUTTON_CLASS,
  COMMUNITY_SHARE_ICON_CLASS,
} from './communityDetailStyles';

export interface CommunityPostShareButtonsProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  className?: string;
}

/** Mobile / Tablet / Desktop 게시글 공유 */
export const CommunityPostShareButtons = ({
  title,
  description = null,
  imageUrl = null,
  className = '',
}: CommunityPostShareButtonsProps) => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const getShareUrl = () =>
    `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')}${window.location.pathname}${window.location.search}`;

  const handleShareKakao = () => {
    if (!isKakaoShareConfigured()) {
      showToast({
        content: t('share.kakaoUnconfigured'),
      });
      return;
    }

    void shareQuoteToKakao({
      title,
      description,
      imageUrl,
      shareUrl: getShareUrl(),
      buttonTitle: t('community.viewPost'),
    }).catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : t('share.kakaoFail');
      showToast({ content: message });
    });
  };

  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      'facebook-share',
      'width=600,height=400,noopener,noreferrer'
    );
  };

  return (
    <div
      className={cn(
        'flex shrink-0 items-center',
        COMMUNITY_POST_ICON_GROUP_GAP_CLASS,
        className
      )}
    >
      <button
        type="button"
        aria-label={t('share.kakao')}
        onClick={handleShareKakao}
        className={cn(
          COMMUNITY_SHARE_BUTTON_CLASS,
          'bg-kakao-100 text-black-500'
        )}
      >
        <SymbolKakaoIcon className={COMMUNITY_SHARE_ICON_CLASS} aria-hidden />
      </button>
      <button
        type="button"
        aria-label={t('share.facebook')}
        onClick={handleShareFacebook}
        className={cn(
          COMMUNITY_SHARE_BUTTON_CLASS,
          'bg-facebook-100 text-white'
        )}
      >
        <SymbolFacebookIcon
          className={COMMUNITY_SHARE_ICON_CLASS}
          aria-hidden
        />
      </button>
    </div>
  );
};
