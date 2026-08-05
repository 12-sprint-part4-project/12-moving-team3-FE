'use client';

import ClipIcon from '@/assets/icons/clip.svg';
import FacebookIcon from '@/assets/icons/symbol-facebook.svg';
import KakaoIcon from '@/assets/icons/symbol-kakao.svg';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { useToast } from '@/hooks/useToast';
import {
  isKakaoShareConfigured,
  shareQuoteToKakao,
} from '@/lib/kakaoShare';

export interface QuoteShareButtonsProps {
  /** 공유할 경로 (예: /quotes/1) */
  sharePath: string;
  /** 카카오 공유 카드 제목 */
  shareTitle?: string;
  /** 카카오 공유 카드 설명 */
  shareDescription?: string | null;
  /** 카카오 공유 미리보기 이미지 */
  shareImageUrl?: string | null;
  className?: string;
}

/** 견적서 공유 버튼 그룹 */
export const QuoteShareButtons = ({
  sharePath,
  shareTitle = '견적서',
  shareDescription = null,
  shareImageUrl = null,
  className = '',
}: QuoteShareButtonsProps) => {
  const { showToast } = useToast();

  /** 절대 URL로 공유 주소 생성 */
  const getShareUrl = () => `${window.location.origin}${sharePath}`;

  /** 현재 상세 URL 클립보드 복사 */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      showToast({ content: '링크가 복사되었습니다.' });
    } catch {
      showToast({ content: '링크 복사에 실패했습니다.' });
    }
  };

  /** 카카오톡 피드 공유 */
  const handleShareKakao = () => {
    if (!isKakaoShareConfigured()) {
      showToast({
        content: '카카오톡 공유 설정이 되어 있지 않습니다.',
      });
      return;
    }

    void shareQuoteToKakao({
      title: shareTitle,
      description: shareDescription,
      imageUrl: shareImageUrl,
      shareUrl: getShareUrl(),
    }).catch((error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : '카카오톡 공유에 실패했습니다.';
      showToast({ content: message });
    });
  };

  /** 페이스북 공유 창 열기 */
  const handleShareFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(facebookShareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-col gap-2.5 lg:gap-[1.375rem] ${className}`}>
      <p className="text-md-semibold text-black-400 lg:text-xl-semibold">
        견적서 공유하기
      </p>
      <div className="flex items-start gap-4">
        <IconButton
          icon={ClipIcon}
          size="xs"
          variant="outlined"
          aria-label="링크 복사"
          className="cursor-pointer lg:size-16 lg:rounded-2xl lg:[&_svg]:size-9"
          onClick={() => {
            void handleCopyLink();
          }}
        />
        <IconButton
          icon={KakaoIcon}
          size="xs"
          variant="kakao"
          aria-label="카카오톡으로 공유하기"
          className="cursor-pointer lg:size-16 lg:rounded-2xl lg:[&_svg]:size-7"
          onClick={handleShareKakao}
        />
        <IconButton
          icon={FacebookIcon}
          size="xs"
          variant="facebook"
          aria-label="페이스북으로 공유하기"
          className="cursor-pointer lg:size-16 lg:rounded-2xl lg:[&_svg]:size-7"
          onClick={handleShareFacebook}
        />
      </div>
    </div>
  );
};
