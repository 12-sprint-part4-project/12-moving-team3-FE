'use client';

import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { useToast } from '@/hooks/useToast';
import {
  isKakaoShareConfigured,
  shareQuoteToKakao,
} from '@/lib/kakaoShare';
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
  const { showToast } = useToast();

  const handleShareKakao = () => {
    if (!isKakaoShareConfigured()) {
      showToast({
        content: '카카오톡 공유 설정이 되어 있지 않습니다.',
      });
      return;
    }

    void shareQuoteToKakao({
      title,
      description,
      imageUrl,
      shareUrl: window.location.href,
      buttonTitle: '게시글 보기',
    }).catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : '카카오톡 공유에 실패했습니다.';
      showToast({ content: message });
    });
  };

  const handleShareFacebook = () => {
    const shareUrl = encodeURIComponent(window.location.href);
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
        aria-label="카카오톡 공유"
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
        aria-label="페이스북 공유"
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
