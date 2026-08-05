import type { QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';

import { customerQuoteQueryKeys } from '@/hooks/useCustomerPendingQuotes';
import { favoriteQueryKeys } from '@/hooks/useFavoriteMoversPreview';
import { moverQueryKeys } from '@/hooks/useMoversList';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  applyOptimisticFavorite,
  restoreFavoriteQueries,
  snapshotFavoriteQueries,
  type ToggleFavoriteVariables,
} from '@/lib/favoriteCache';
import { addFavorite, removeFavorite } from '@/services/favoritesApi';

export type { ToggleFavoriteVariables };

/**
 * 기사님 찜 추가/취소 (Optimistic Update).
 * - UI는 즉시 반영, 같은 기사님 연타는 최종 의도만 서버에 전송
 * - 성공 시 스냅샷 갱신 + 찜 목록 invalidate
 * - 실패 시 마지막 성공 스냅샷으로 롤백
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const latestDesiredRef = useRef<Map<string, boolean>>(new Map());
  const lastSyncedRef = useRef<Map<string, boolean>>(new Map());
  const snapshotRef = useRef<Map<string, Array<[QueryKey, unknown]>>>(
    new Map()
  );
  const runningRef = useRef<Set<string>>(new Set());
  const [pendingMoverIds, setPendingMoverIds] = useState<Set<string>>(
    () => new Set()
  );

  const markPending = useCallback((moverId: string, pending: boolean) => {
    setPendingMoverIds((prev) => {
      const next = new Set(prev);
      if (pending) {
        next.add(moverId);
      } else {
        next.delete(moverId);
      }
      return next;
    });
  }, []);

  const runFavoriteChain = useCallback(
    async (moverId: string) => {
      if (runningRef.current.has(moverId)) {
        return;
      }

      runningRef.current.add(moverId);
      markPending(moverId, true);

      try {
        while (latestDesiredRef.current.has(moverId)) {
          const nextFavorited = latestDesiredRef.current.get(moverId);
          if (nextFavorited === undefined) {
            break;
          }

          latestDesiredRef.current.delete(moverId);

          if (lastSyncedRef.current.get(moverId) === nextFavorited) {
            if (!latestDesiredRef.current.has(moverId)) {
              snapshotRef.current.delete(moverId);
            }
            continue;
          }

          try {
            if (nextFavorited) {
              await addFavorite(moverId);
            } else {
              await removeFavorite(moverId);
            }

            lastSyncedRef.current.set(moverId, nextFavorited);
            snapshotRef.current.set(
              moverId,
              snapshotFavoriteQueries(queryClient)
            );

            await queryClient.invalidateQueries({
              queryKey: favoriteQueryKeys.all,
            });

            if (!latestDesiredRef.current.has(moverId)) {
              snapshotRef.current.delete(moverId);
            }
          } catch (error: unknown) {
            const snapshot = snapshotRef.current.get(moverId);
            if (snapshot) {
              restoreFavoriteQueries(queryClient, snapshot);
            }
            snapshotRef.current.delete(moverId);
            lastSyncedRef.current.delete(moverId);
            latestDesiredRef.current.delete(moverId);

            const message =
              error instanceof ApiError
                ? error.message
                : '찜 처리 중 오류가 발생했습니다.';
            showToast({ content: message });
            break;
          }
        }
      } finally {
        runningRef.current.delete(moverId);
        markPending(moverId, false);
      }
    },
    [markPending, queryClient, showToast]
  );

  const toggleFavorite = useCallback(
    (moverId: string, nextFavorited: boolean): void => {
      // 연타 시 마지막 의도만 남긴다 (cancel 완료 전에 덮어씀)
      latestDesiredRef.current.set(moverId, nextFavorited);

      void (async () => {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: moverQueryKeys.all }),
          queryClient.cancelQueries({ queryKey: customerQuoteQueryKeys.all }),
        ]);

        const desired = latestDesiredRef.current.get(moverId);
        if (desired === undefined) {
          return;
        }

        if (!snapshotRef.current.has(moverId)) {
          snapshotRef.current.set(
            moverId,
            snapshotFavoriteQueries(queryClient)
          );
        }

        // cancel 이후·최신 desired 기준으로 반영 (stale apply 방지)
        applyOptimisticFavorite(queryClient, {
          moverId,
          nextFavorited: desired,
        });
        void runFavoriteChain(moverId);
      })();
    },
    [queryClient, runFavoriteChain]
  );

  const isMoverPending = useCallback(
    (moverId: string) => pendingMoverIds.has(moverId),
    [pendingMoverIds]
  );

  const pendingMoverId =
    pendingMoverIds.size > 0 ? ([...pendingMoverIds][0] ?? null) : null;

  return {
    toggleFavorite,
    isPending: pendingMoverIds.size > 0,
    pendingMoverId,
    isMoverPending,
  };
};
