/**
 * `/favorites`에서 반복되는 패딩·셸 클래스.
 * 일회성 클래스는 각 파일 JSX에 그대로 둔다.
 */

export const FAVORITES_PAGE_X_PADDING =
  'px-6 md:px-[4.5rem] lg:px-10 xl:px-16 min-[90rem]:px-[16.25rem]';

/** 찜 목록 본문 컨테이너 (패딩 포함) */
export const FAVORITES_CONTENT_CLASS = `mx-auto flex w-full max-w-[1920px] flex-col py-6 md:py-8 ${FAVORITES_PAGE_X_PADDING}`;
