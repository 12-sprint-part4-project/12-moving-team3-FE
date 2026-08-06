import { cn } from '@/lib/utils';

import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
} from './communityLayout';

/** Suspense fallback — TabBar와 동일한 높이·구조로 hydration mismatch 방지 */
export const CommunityTabBarFallback = () => (
  <nav
    className={cn(
      'relative flex h-12 border-b border-line-200 bg-white',
      'min-[46.5rem]:gap-2 xl:h-14 xl:gap-2',
      COMMUNITY_HEADER_X,
      COMMUNITY_DESKTOP_X
    )}
    aria-hidden
  >
    <span className="inline-block h-12 min-w-0 flex-1 basis-0 min-[46.5rem]:w-[5.5rem] min-[46.5rem]:flex-none xl:h-14" />
    <span className="inline-block h-12 min-w-0 flex-1 basis-0 min-[46.5rem]:w-[6.75rem] min-[46.5rem]:flex-none xl:h-14" />
  </nav>
);
