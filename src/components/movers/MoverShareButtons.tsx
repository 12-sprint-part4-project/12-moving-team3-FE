'use client';

import ClipIcon from '@/assets/icons/clip.svg';
import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useToast } from '@/hooks/useToast';
import {
  isKakaoShareConfigured,
  shareMoverToKakao,
} from '@/lib/kakaoShare';
import { cn } from '@/lib/utils';

export interface MoverShareButtonsProps {
  className?: string;
  /** IconButton 크기 — Desktop md, Tablet/Mobile xs */
  size?: 'xs' | 'md';
  nickname?: string;
  description?: string | null;
  profileImageUrl?: string | null;
}

/**
 * 기사님 상세 공유 버튼 (클립보드 / 카카오 / 페이스북).
 */
export const MoverShareButtons = ({
  className = '',
  size = 'xs',
  nickname = '이사',
  description = null,
  profileImageUrl = null,
}: MoverShareButtonsProps) => {
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast({ content: '링크가 복사되었습니다.' });
    } catch {
      showToast({ content: '링크 복사에 실패했습니다.' });
    }
  };

  const handleShareKakao = () => {
    if (!isKakaoShareConfigured()) {
      showToast({
        content: '카카오톡 공유 설정이 되어 있지 않습니다.',
      });
      return;
    }

    void shareMoverToKakao({
      nickname,
      description,
      profileImageUrl,
      shareUrl: window.location.href,
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
    const popup = window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      'facebook-share',
      'width=600,height=400,noopener,noreferrer'
    );

    if (!popup) {
      showToast({
        content: '팝업이 차단되었습니다. 브라우저에서 팝업을 허용해 주세요.',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <IconButton
        icon={ClipIcon}
        aria-label="링크 복사"
        size={size}
        variant="outlined"
        onClick={() => {
          void handleCopyLink();
        }}
      />
      <IconButton
        icon={SymbolKakaoIcon}
        aria-label="카카오톡 공유"
        size={size}
        variant="kakao"
        onClick={handleShareKakao}
      />
      <IconButton
        icon={SymbolFacebookIcon}
        aria-label="페이스북 공유"
        size={size}
        variant="facebook"
        onClick={handleShareFacebook}
      />
    </div>
  );
};
