export interface MoverDetailFavorite {
  isFavorited: boolean;
  isFavoritePending: boolean;
  onFavoriteClick: () => void;
}

export interface MoverDetailDesignated {
  showCta: boolean;
  isPending: boolean;
  isAlreadyDesignated: boolean;
  hasReceivedQuoteFromMover: boolean;
  isQuoteStatusError: boolean;
  isStatusLoading: boolean;
  /** 처리되지 않은 지정 견적 요청 에러 — 버튼 비활성 */
  isRequestFailed: boolean;
  onClick: () => void;
}

export interface MoverDetailChat {
  showCta: boolean;
  isPending: boolean;
  onClick: () => void;
}

export interface MoverDetailShare {
  name: string;
  description: string | null;
  profileImageUrl: string | null;
}
