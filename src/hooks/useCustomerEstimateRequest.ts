'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { ApiError, getAccessToken } from '@/lib/apiClient';
import {
  isEstimateRequestReadyToSubmit,
  toVisualStep,
  type ReviseEstimateRequestFieldBody,
  type SaveEstimateRequestStepBody,
} from '@/lib/customerEstimateRequestSchema';
import {
  createEstimateRequest,
  getActiveEstimateRequest,
  getEstimateRequestDetail,
  reviseEstimateRequestField,
  saveEstimateRequestStep,
  submitEstimateRequest,
} from '@/services/customerEstimateRequestApi';
import type {
  ActiveEstimateRequestSummary,
  CustomerEstimateRequestEntryStatus,
  EstimateRequestDetail,
  EstimateRequestVisualStep,
} from '@/types/customerEstimateRequest';

export const customerEstimateRequestQueryKeys = {
  all: ['customer-estimate-request'] as const,
  active: () =>
    [...customerEstimateRequestQueryKeys.all, 'active'] as const,
  detail: (estimateRequestId: number) =>
    [
      ...customerEstimateRequestQueryKeys.all,
      'detail',
      estimateRequestId,
    ] as const,
};

/** bootstrap 결과 — 페이지가 Shell/Blocked/에러 UI를 고를 때 사용 */
export interface CustomerEstimateRequestBootstrap {
  status: CustomerEstimateRequestEntryStatus;
  /** DRAFT 진행 중일 때만 채워짐 */
  detail: EstimateRequestDetail | null;
  /** 활성이나 DRAFT가 아닐 때(SUBMITTED/CONFIRMED 등) */
  blockedRequest: ActiveEstimateRequestSummary | null;
  visualStep: EstimateRequestVisualStep;
  error: ApiError | null;
  isBootstrapping: boolean;
  refetch: () => Promise<void>;
}

type BootstrapResultOverrides = Partial<
  Omit<CustomerEstimateRequestBootstrap, 'status'>
> &
  Pick<CustomerEstimateRequestBootstrap, 'status'>;

/**
 * bootstrap 분기 공통 결과 팩토리.
 * queryFn 쪽 refetch placeholder는 훅에서 실제 refetch로 덮어쓴다.
 */
const makeBootstrapResult = (
  overrides: BootstrapResultOverrides
): CustomerEstimateRequestBootstrap => ({
  detail: null,
  blockedRequest: null,
  visualStep: 1,
  error: null,
  isBootstrapping: false,
  refetch: async () => undefined,
  ...overrides,
});

/**
 * 활성 요청 조회 → DRAFT 상세 복원 또는 신규 생성.
 * PROFILE_NOT_FOUND / 401 은 entry status 로만 분기 (리다이렉트는 페이지에서).
 */
const bootstrapCustomerEstimateRequest =
  async (): Promise<CustomerEstimateRequestBootstrap> => {
    // FE 로그인 미구현 구간 — 토큰 없으면 API 호출 전에 로그인 안내로 분기
    if (!getAccessToken()) {
      return makeBootstrapResult({
        status: 'unauthorized',
        error: new ApiError(
          401,
          '견적 요청은 로그인 후 이용할 수 있습니다.',
          'UNAUTHORIZED'
        ),
      });
    }

    try {
      const active = await getActiveEstimateRequest();

      // 활성 요청 없음 → DRAFT 생성
      if (!active.hasActiveRequest || !active.request) {
        const created = await createEstimateRequest();
        const detail = await getEstimateRequestDetail(created.id);

        return makeBootstrapResult({
          status: 'ready',
          detail,
          visualStep: toVisualStep(detail.status, detail.currentStep, detail),
        });
      }

      // 이미 제출·확정된 활성 요청 → 신규 작성 불가
      if (active.request.status !== 'DRAFT') {
        return makeBootstrapResult({
          status: 'blocked',
          blockedRequest: active.request,
          visualStep: 4,
        });
      }

      // DRAFT 이어서 작성
      const detail = await getEstimateRequestDetail(active.request.id);

      return makeBootstrapResult({
        status: 'ready',
        detail,
        visualStep: toVisualStep(detail.status, detail.currentStep, detail),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 || error.code === 'UNAUTHORIZED') {
          return makeBootstrapResult({
            status: 'unauthorized',
            error,
          });
        }

        if (error.code === 'PROFILE_NOT_FOUND') {
          return makeBootstrapResult({
            status: 'profileIncomplete',
            error,
          });
        }

        // 생성 경합으로 활성 요청이 생긴 경우 → active 재조회
        if (error.code === 'ACTIVE_REQUEST_EXISTS') {
          const active = await getActiveEstimateRequest();
          if (active.request?.status === 'DRAFT') {
            const detail = await getEstimateRequestDetail(active.request.id);
            return makeBootstrapResult({
              status: 'ready',
              detail,
              visualStep: toVisualStep(
                detail.status,
                detail.currentStep,
                detail
              ),
            });
          }

          if (active.request) {
            return makeBootstrapResult({
              status: 'blocked',
              blockedRequest: active.request,
              visualStep: 4,
            });
          }
        }

        return makeBootstrapResult({
          status: 'error',
          error,
        });
      }

      // BE 미기동·CORS·네트워크 단절 등 fetch 자체 실패
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error &&
          /failed to fetch|networkerror|load failed/i.test(error.message));

      return makeBootstrapResult({
        status: 'error',
        error: new ApiError(
          500,
          isNetworkError
            ? '서버에 연결할 수 없습니다. BE가 실행 중인지 확인해 주세요.'
            : '요청 처리 중 오류가 발생했습니다.',
          isNetworkError ? 'NETWORK_ERROR' : 'UNKNOWN_ERROR'
        ),
      });
    }
  };

/**
 * 고객 견적요청 진입·스텝 저장·필드 수정·제출 훅
 */
export const useCustomerEstimateRequest = () => {
  const queryClient = useQueryClient();

  const bootstrapQuery = useQuery({
    queryKey: customerEstimateRequestQueryKeys.active(),
    queryFn: bootstrapCustomerEstimateRequest,
    staleTime: 0,
    retry: false,
  });

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: customerEstimateRequestQueryKeys.active(),
    });
  }, [queryClient]);

  const bootstrap: CustomerEstimateRequestBootstrap = useMemo(() => {
    if (bootstrapQuery.isPending) {
      return makeBootstrapResult({
        status: 'loading',
        isBootstrapping: true,
        refetch,
      });
    }

    if (bootstrapQuery.data) {
      return { ...bootstrapQuery.data, refetch };
    }

    return makeBootstrapResult({
      status: 'error',
      error:
        bootstrapQuery.error instanceof ApiError
          ? bootstrapQuery.error
          : new ApiError(
              500,
              '요청 처리 중 오류가 발생했습니다.',
              'UNKNOWN_ERROR'
            ),
      refetch,
    });
  }, [bootstrapQuery.isPending, bootstrapQuery.data, bootstrapQuery.error, refetch]);

  /** 상세 캐시·bootstrap 결과를 최신 detail 로 갱신 */
  const syncDetail = useCallback(
    async (estimateRequestId: number) => {
      const detail = await getEstimateRequestDetail(estimateRequestId);
      queryClient.setQueryData<CustomerEstimateRequestBootstrap>(
        customerEstimateRequestQueryKeys.active(),
        (prev) =>
          prev
            ? {
                ...prev,
                status: 'ready',
                detail,
                blockedRequest: null,
                visualStep: toVisualStep(
                  detail.status,
                  detail.currentStep,
                  detail
                ),
                error: null,
              }
            : prev
      );
      queryClient.setQueryData(
        customerEstimateRequestQueryKeys.detail(estimateRequestId),
        detail
      );
      return detail;
    },
    [queryClient]
  );

  const saveStepMutation = useMutation({
    mutationFn: ({
      estimateRequestId,
      body,
    }: {
      estimateRequestId: number;
      body: SaveEstimateRequestStepBody;
    }) => saveEstimateRequestStep(estimateRequestId, body),
    onSuccess: async (_result, variables) => {
      await syncDetail(variables.estimateRequestId);
    },
  });

  const reviseFieldMutation = useMutation({
    mutationFn: ({
      estimateRequestId,
      body,
    }: {
      estimateRequestId: number;
      body: ReviseEstimateRequestFieldBody;
    }) => reviseEstimateRequestField(estimateRequestId, body),
    onSuccess: async (_result, variables) => {
      await syncDetail(variables.estimateRequestId);
    },
  });

  const submitMutation = useMutation({
    mutationFn: (estimateRequestId: number) =>
      submitEstimateRequest(estimateRequestId),
    onSuccess: async () => {
      // 제출 후 활성 상태가 SUBMITTED 로 바뀌므로 bootstrap 재실행
      await refetch();
    },
  });

  const isReadyToSubmit = bootstrap.detail
    ? isEstimateRequestReadyToSubmit(bootstrap.detail)
    : false;

  return {
    bootstrap,
    isReadyToSubmit,
    saveStep: saveStepMutation.mutateAsync,
    reviseField: reviseFieldMutation.mutateAsync,
    submit: submitMutation.mutateAsync,
    isSavingStep: saveStepMutation.isPending,
    isRevisingField: reviseFieldMutation.isPending,
    isSubmitting: submitMutation.isPending,
  };
};
