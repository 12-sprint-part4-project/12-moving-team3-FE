'use client';

import ClipIcon from '@/assets/icons/clip.svg';
import SymbolFacebookIcon from '@/assets/icons/symbol-facebook.svg';
import SymbolKakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

export interface MoverShareButtonsProps {
  className?: string;
  /** IconButton 크기 — Desktop md, Tablet/Mobile xs */
  size?: 'xs' | 'md';
}

/**
 * 기사님 상세 공유 버튼 (클립보드 / 카카오 / 페이스북).
 * 클립보드만 동작, SNS는 TODO.
 */
export const MoverShareButtons = ({
  className = '',
  size = 'xs',
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
    // TODO: 카카오 공유 SDK 연동
  };

  const handleShareFacebook = () => {
    // TODO: 페이스북 공유 URL 연동
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
