import { cn } from '@/lib/utils';

import {
  COMMUNITY_DESKTOP_X,
  COMMUNITY_HEADER_X,
} from './communityLayout';

/** Suspense fallback — TabBar와 동일한 높이·구조로 hydration mismatch 방지 */
export const CommunityTabBarFallback = () => (
  <nav
    className={cn(
      'relative flex h-11 gap-2 border-b border-line-200 bg-white',
      'min-[46.5rem]:gap-2 xl:h-12 xl:gap-2',
      COMMUNITY_HEADER_X,
      COMMUNITY_DESKTOP_X
    )}
    aria-hidden
  >
    <span className="inline-block h-11 w-[3.75rem] min-[46.5rem]:w-16 xl:h-12" />
    <span className="inline-block h-11 w-[4.5rem] min-[46.5rem]:w-[4.75rem] xl:h-12" />
  </nav>
);
