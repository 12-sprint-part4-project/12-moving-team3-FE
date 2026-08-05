'use client';

import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useToast } from '@/hooks/useToast';
import {
  isKakaoShareConfigured,
  shareQuoteToKakao,
} from '@/lib/kakaoShare';
import { cn } from '@/lib/utils';

export interface CommunityPostShareButtonsProps {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  className?: string;
}

/** Tablet / Desktop 게시글 공유 — 54×54 카카오·페이스북 (Figma 15167:41690) */
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
        'hidden shrink-0 items-center gap-2 min-[46.5rem]:flex',
        className
      )}
    >
      <IconButton
        icon={SymbolKakaoIcon}
        aria-label="카카오톡 공유"
        size="sm"
        variant="kakao"
        onClick={handleShareKakao}
      />
      <IconButton
        icon={SymbolFacebookIcon}
        aria-label="페이스북 공유"
        size="sm"
        variant="facebook"
        onClick={handleShareFacebook}
      />
    </div>
  );
};
