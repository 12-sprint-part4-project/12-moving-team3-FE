import { AuthRouteGuard } from '@/components/auth/AuthRouteGuard';
import { ProfileIncompleteRouteGuard } from '@/components/auth/ProfileIncompleteRouteGuard';
import { SuspendedRouteGuard } from '@/components/auth/SuspendedRouteGuard';

import type { ReactNode } from 'react';

export function Guards({ children }: { children: ReactNode }) {
  return (
    <AuthRouteGuard>
      <SuspendedRouteGuard>
        <ProfileIncompleteRouteGuard>{children}</ProfileIncompleteRouteGuard>
      </SuspendedRouteGuard>
    </AuthRouteGuard>
  );
}
