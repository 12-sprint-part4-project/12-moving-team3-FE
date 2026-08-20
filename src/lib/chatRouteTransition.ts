/** 채팅 목록 (`/chat`) */
export const isChatListPath = (pathname: string): boolean =>
  pathname === '/chat';

/** 채팅방 상세 (`/chat/:roomId`) */
export const isChatRoomPath = (pathname: string): boolean =>
  /^\/chat\/[^/]+$/.test(pathname);

/** 1: 목록→방, -1: 방→목록, 0: fade(첫 목록·기타) */
export type ChatRouteDirection = 1 | 0 | -1;

/**
 * 채팅 레이아웃 안에서의 이동 방향.
 * `prevPathname`이 null이면 레이아웃 첫 마운트(목록은 fade, 방은 forward).
 */
export const getChatRouteDirection = (
  prevPathname: string | null,
  pathname: string
): ChatRouteDirection => {
  if (prevPathname === null) {
    return isChatRoomPath(pathname) ? 1 : 0;
  }

  if (isChatListPath(prevPathname) && isChatRoomPath(pathname)) {
    return 1;
  }

  if (isChatRoomPath(prevPathname) && isChatListPath(pathname)) {
    return -1;
  }

  if (
    isChatRoomPath(prevPathname) &&
    isChatRoomPath(pathname) &&
    prevPathname !== pathname
  ) {
    return 1;
  }

  return 0;
};
