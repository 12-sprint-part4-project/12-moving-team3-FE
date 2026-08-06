/** 기사 상세 — 지정 견적 CTA 버튼 라벨 */
export const getDesignatedButtonLabel = (
  isAlreadyDesignated: boolean,
  hasReceivedQuoteFromMover: boolean,
  isDesignatedPending: boolean,
  isDesignatedStatusLoading = false,
  isQuoteStatusError = false
): string => {
  if (isAlreadyDesignated) {
    return '지정 견적 요청 완료';
  }
  if (isQuoteStatusError) {
    return '확인 실패 · 다시 시도';
  }
  if (hasReceivedQuoteFromMover) {
    return '지정 견적 요청 불가';
  }
  if (isDesignatedPending) {
    return '요청 중...';
  }
  if (isDesignatedStatusLoading) {
    return '확인 중...';
  }
  return '지정 견적 요청하기';
};
