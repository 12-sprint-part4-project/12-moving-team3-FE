/** Kakao JavaScript SDK (window.Kakao) — 공유용 최소 타입 */
export interface KakaoShareFeedContent {
  title: string;
  description?: string;
  imageUrl: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

export interface KakaoShareFeedButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

export interface KakaoShareDefaultFeed {
  objectType: 'feed';
  content: KakaoShareFeedContent;
  buttons?: KakaoShareFeedButton[];
}

export interface KakaoSDK {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: KakaoShareDefaultFeed) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSDK;
  }
}

export {};
