/** Mobile 375 */
export const COMMUNITY_PAGE_SHELL =
  'mx-auto flex w-full max-w-page flex-col bg-white min-[46.5rem]:max-w-[46.5rem] xl:max-w-[120rem]';

/** Mobile px-16 / Tablet px-72 — Figma 15101:40892, 15101:40891 */
export const COMMUNITY_SECTION_X = 'px-4 min-[46.5rem]:px-[4.5rem]';

/** Mobile px-24 / Tablet px-72 */
export const COMMUNITY_HEADER_X = 'px-6 min-[46.5rem]:px-[4.5rem]';

/** Desktop px-260 — Figma 15101:40890 */
export const COMMUNITY_DESKTOP_X = 'xl:px-16 min-[90rem]:px-[16.25rem]';

/** Sidebar(328) ↔ list gap 117px — Figma x=260+328=588, list x=705 */
export const COMMUNITY_DESKTOP_MAIN_GAP = 'xl:gap-[7.3125rem]';

/** 가구나눔 사진첩 그리드 — Mobile 2열 / Tablet·Desktop 3열 */
export const COMMUNITY_FURNITURE_GRID_CLASS =
  'mx-auto grid w-full list-none grid-cols-2 gap-3 p-0 m-0 min-[46.5rem]:grid-cols-3 min-[46.5rem]:gap-4 xl:gap-5';

/** 상세 본문 최대 너비 900px — Figma 15167:41690 */
export const COMMUNITY_DETAIL_MAX_W = 'mx-auto w-full max-w-[56.25rem]';

/** Mobile: fixed EngagementBar 높이 + safe 여유 / Tablet·Desktop: 푸터 대체 하단 여백 */
export const COMMUNITY_DETAIL_MOBILE_BOTTOM_PAD =
  'pb-24 min-[46.5rem]:pb-8 xl:pb-10';

/** 페이지 타이틀 헤더 — 목록 page.client.tsx 와 동일 */
export const COMMUNITY_PAGE_TITLE_HEADER_CLASS =
  'flex h-12 items-center bg-white tablet:h-14 tablet:shadow-page-title xl:h-[4.5rem] xl:shadow-page-title';

export const COMMUNITY_PAGE_TITLE_CLASS =
  'text-2lg-bold text-black-400 tablet:text-xl-semibold tablet:text-black-300 xl:text-2xl-semibold xl:text-black-300';

/** 탭 라벨 — page-title 대비 한 단계 작게 (Mobile lg / Tablet 2lg / Desktop xl) */
export const COMMUNITY_TAB_LABEL_ACTIVE_CLASS =
  'text-lg-bold text-blue-300 min-[46.5rem]:text-2lg-semibold xl:text-xl-semibold';

export const COMMUNITY_TAB_LABEL_INACTIVE_CLASS =
  'text-lg-regular text-gray-400 min-[46.5rem]:text-2lg-regular xl:text-xl-regular';
