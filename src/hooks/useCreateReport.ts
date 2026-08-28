import { useMutation } from '@tanstack/react-query';

import { useToast } from '@/hooks/useToast';
import { resolveApiErrorMessage } from '@/lib/apiClient';
import { createReport } from '@/services/reportsApi';

import type { CreateReportBody } from '@/types/report';

/**
 * 신고 등록.
 * 성공/실패 토스트는 훅에서 처리한다.
 * pending 중 추가 호출은 무시한다 (연타 방지).
 */
export const useCreateReport = () => {
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (body: CreateReportBody) => createReport(body),
    onSuccess: () => {
      showToast({ content: '신고가 접수되었습니다.' });
    },
    onError: (error: unknown) => {
      showToast({
        content: resolveApiErrorMessage(
          error,
          '신고 접수 중 오류가 발생했습니다.'
        ),
      });
    },
  });

  const submitReport = async (body: CreateReportBody): Promise<void> => {
    if (mutation.isPending) {
      return;
    }
    await mutation.mutateAsync(body);
  };

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    submitReport,
  };
};
