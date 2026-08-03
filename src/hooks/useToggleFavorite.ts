import { useMutation, useQueryClient } from '@tanstack/react-query';

import { moverQueryKeys } from '@/hooks/useMoversList';
import { favoriteQueryKeys } from '@/hooks/useFavoriteMoversPreview';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { addFavorite, removeFavorite } from '@/services/favoritesApi';

export interface ToggleFavoriteVariables {
  moverId: string;
  nextFavorited: boolean;
}

/**
 * 기사님 찜 추가/취소.
 * 성공 시 목록·상세·찜 목록/preview 쿼리를 invalidate 한다.
 * pending 중 추가 mutate는 무시한다 (연타 방지).
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: async ({ moverId, nextFavorited }: ToggleFavoriteVariables) => {
      if (nextFavorited) {
        return addFavorite(moverId);
      }
      return removeFavorite(moverId);
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: moverQueryKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: moverQueryKeys.detail(variables.moverId),
        }),
        queryClient.invalidateQueries({
          queryKey: favoriteQueryKeys.all,
        }),
      ]);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof ApiError
          ? error.message
          : '찜 처리 중 오류가 발생했습니다.';
      showToast({ content: message });
    },
  });

  const toggleFavorite = (moverId: string, nextFavorited: boolean): void => {
    if (mutation.isPending) {
      return;
    }
    mutation.mutate({ moverId, nextFavorited });
  };

  return {
    ...mutation,
    isPending: mutation.isPending,
    toggleFavorite,
  };
};
