const KAKAO_SDK_SRC =
  'https://t1.kakaocdn.net/kakao_js_sdk/2.7.9/kakao.min.js';

/** 프로필 이미지가 없을 때 카카오 미리보기용 (공개 HTTPS, Kakao 문서 샘플 이미지) */
const DEFAULT_SHARE_IMAGE_URL =
  'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKPHPBPLmcK7n5bBHGCL0/o.jpg';

let sdkLoadPromise: Promise<void> | null = null;

const getKakaoJsKey = (): string | null => {
  const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY?.trim();
  return key ? key : null;
};

const loadKakaoSdk = (): Promise<void> => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('카카오 SDK는 브라우저에서만 사용할 수 있습니다.'));
  }

  if (window.Kakao) {
    return Promise.resolve();
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_SDK_SRC}"]`
    );

    if (existing) {
      if (existing.dataset.loaded === 'true' || window.Kakao) {
        resolve();
        return;
      }
      existing.addEventListener(
        'load',
        () => {
          existing.dataset.loaded = 'true';
          resolve();
        },
        { once: true }
      );
      existing.addEventListener(
        'error',
        () => {
          existing.remove();
          sdkLoadPromise = null;
          reject(new Error('카카오 SDK를 불러오지 못했습니다.'));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => {
      script.remove();
      sdkLoadPromise = null;
      reject(new Error('카카오 SDK를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });

  return sdkLoadPromise;
};

const ensureKakaoInitialized = async (): Promise<NonNullable<Window['Kakao']>> => {
  const jsKey = getKakaoJsKey();
  if (!jsKey) {
    throw new Error('카카오 JavaScript 키가 설정되지 않았습니다.');
  }

  await loadKakaoSdk();

  const kakao = window.Kakao;
  if (!kakao) {
    throw new Error('카카오 SDK를 초기화하지 못했습니다.');
  }

  if (!kakao.isInitialized()) {
    kakao.init(jsKey);
  }

  return kakao;
};

const toHttpsImageUrl = (imageUrl: string | null | undefined): string => {
  if (imageUrl?.startsWith('https://')) {
    return imageUrl;
  }
  return DEFAULT_SHARE_IMAGE_URL;
};

export interface ShareMoverToKakaoParams {
  nickname: string;
  description?: string | null;
  profileImageUrl?: string | null;
  shareUrl?: string;
}

/**
 * 기사님 프로필을 카카오톡 피드로 공유한다.
 * NEXT_PUBLIC_KAKAO_JS_KEY 필요 (로그인용 REST 키와 별개).
 */
export const shareMoverToKakao = async ({
  nickname,
  description,
  profileImageUrl,
  shareUrl,
}: ShareMoverToKakaoParams): Promise<void> => {
  const kakao = await ensureKakaoInitialized();
  const url =
    shareUrl?.trim() ||
    (typeof window !== 'undefined' ? window.location.href : '');

  if (!url) {
    throw new Error('공유할 주소가 없습니다.');
  }

  const title = `${nickname} 기사님`;
  const desc =
    description?.trim() || '이사 전문가 프로필을 확인해보세요.';

  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description: desc,
      imageUrl: toHttpsImageUrl(profileImageUrl),
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: '프로필 보기',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
};

export interface ShareQuoteToKakaoParams {
  /** 공유 카드 제목 (예: 김코드 기사님 견적서) */
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  shareUrl: string;
  /** 버튼 문구 — 기본: 견적서 보기 */
  buttonTitle?: string;
}

/**
 * 견적서를 카카오톡 피드로 공유한다.
 * NEXT_PUBLIC_KAKAO_JS_KEY 필요.
 */
export const shareQuoteToKakao = async ({
  title,
  description,
  imageUrl,
  shareUrl,
  buttonTitle = '견적서 보기',
}: ShareQuoteToKakaoParams): Promise<void> => {
  const kakao = await ensureKakaoInitialized();
  const url = shareUrl.trim();

  if (!url) {
    throw new Error('공유할 주소가 없습니다.');
  }

  const desc =
    description?.trim() || '받은 견적서를 확인해보세요.';

  kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: title.trim() || '견적서',
      description: desc,
      imageUrl: toHttpsImageUrl(imageUrl),
      link: {
        mobileWebUrl: url,
        webUrl: url,
      },
    },
    buttons: [
      {
        title: buttonTitle,
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    ],
  });
};

export const isKakaoShareConfigured = (): boolean => Boolean(getKakaoJsKey());
