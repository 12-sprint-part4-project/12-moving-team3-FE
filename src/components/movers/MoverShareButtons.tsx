'use client';

import ClipIcon from '@/assets/icons/clip.svg';
import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from '@/i18n/useTranslation';
import { isKakaoShareConfigured, shareMoverToKakao } from '@/lib/kakaoShare';
import { cn } from '@/lib/utils';

export interface MoverShareButtonsProps {
  className?: string;
  /** IconButton 크기 — Desktop md, Tablet/Mobile xs */
  size?: 'xs' | 'md';
  name?: string;
  description?: string | null;
  profileImageUrl?: string | null;
}

/**
 * 기사님 상세 공유 버튼 (클립보드 / 카카오 / 페이스북).
 */
export const MoverShareButtons = ({
  className = '',
  size = 'xs',
  name = '이사',
  description = null,
  profileImageUrl = null,
}: MoverShareButtonsProps) => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const getShareUrl = () =>
    `${process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')}${window.location.pathname}${window.location.search}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      showToast({ content: t('share.copySuccess') });
    } catch {
      showToast({ content: t('share.copyFail') });
    }
  };

  const handleShareKakao = () => {
    if (!isKakaoShareConfigured()) {
      showToast({
        content: t('share.kakaoUnconfigured'),
      });
      return;
    }

    void shareMoverToKakao({
      name,
      description,
      profileImageUrl,
      shareUrl: getShareUrl(),
    }).catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : t('share.kakaoFail');
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
    <div className={cn('flex items-center gap-4', className)}>
      <IconButton
        icon={ClipIcon}
        aria-label={t('share.copyLink')}
        size={size}
        variant="outlined"
        onClick={() => {
          void handleCopyLink();
        }}
        className="text-gray-300"
      />
      <IconButton
        icon={SymbolKakaoIcon}
        aria-label={t('share.kakao')}
        size={size}
        variant="kakao"
        onClick={handleShareKakao}
      />
      <IconButton
        icon={SymbolFacebookIcon}
        aria-label={t('share.facebook')}
        size={size}
        variant="facebook"
        onClick={handleShareFacebook}
      />
    </div>
  );
};
