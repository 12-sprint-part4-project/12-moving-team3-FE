'use client';

interface AppRouterNavigateOptions {
  scroll?: boolean;
}

interface AppRouterLike {
  replace: (href: string, options?: AppRouterNavigateOptions) => void;
}

/** App Router client bootstrap 이후 replace — Turbopack dev 초기화 타이밍 이슈 회피 */
export const scheduleAppRouterReplace = (
  router: AppRouterLike,
  href: string,
  options?: AppRouterNavigateOptions
) => {
  window.setTimeout(() => {
    router.replace(href, options);
  }, 0);
};
