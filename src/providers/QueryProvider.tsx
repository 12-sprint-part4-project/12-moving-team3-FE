'use client';

import { type ComponentType, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface QueryProviderProps {
  children: ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}

/** development 전용 — 동적 import로 프로덕션 번들에서 제외 */
const Devtools = () => {
  const [ReactQueryDevtools, setReactQueryDevtools] = useState<ComponentType<{
    initialIsOpen?: boolean;
  }> | null>(null);

  useEffect(() => {
    void import('@tanstack/react-query-devtools').then((mod) => {
      setReactQueryDevtools(() => mod.ReactQueryDevtools);
    });
  }, []);

  if (!ReactQueryDevtools) {
    return null;
  }

  return <ReactQueryDevtools initialIsOpen={false} />;
};

/**
 * TanStack Query 전역 Provider
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <Devtools /> : null}
    </QueryClientProvider>
  );
};
