'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { getAuthSession } from '@/lib/authSession';
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

/** bootstrap 일반 에러 시 자동 재시도 간격 (풀페이지 대신 토스트 + 재조회) */
const BOOTSTRAP_AUTO_RETRY_MS = 3000;

export const customerEstimateRequestQueryKeys = {
  all: ['customer-estimate-request'] as const,
  active: () => [...customerEstimateRequestQueryKeys.all, 'active'] as const,
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
    // authSession 에 토큰이 없으면 API 호출 전에 로그인 안내로 분기
    if (!getAuthSession()?.accessToken) {
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

        console.error('[customer-estimate-request] bootstrap ApiError', error);

        return makeBootstrapResult({
          status: 'error',
          error,
        });
      }

      // BE 미기동·CORS·네트워크 단절 등 fetch 자체 실패 (상세는 console / 추후 Sentry)
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error &&
          /failed to fetch|networkerror|load failed/i.test(error.message));

      console.error(
        '[customer-estimate-request] bootstrap network/unknown',
        error
      );

      return makeBootstrapResult({
        status: 'error',
        error: new ApiError(
          500,
          isNetworkError
            ? '서버에 연결할 수 없습니다. 잠시 후 다시 시도합니다.'
            : '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도합니다.',
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
  const { showToast } = useToast();
  /** 연속 재시도 중 토스트 스팸 방지 — 정상 진입 상태로 복귀하면 리셋 */
  const hasToastedBootstrapErrorRef = useRef(false);

  const bootstrapQuery = useQuery({
    queryKey: customerEstimateRequestQueryKeys.active(),
    queryFn: bootstrapCustomerEstimateRequest,
    staleTime: 0,
    // 일반 에러는 queryFn 안에서 status:'error'로 반환되므로 RQ retry 대상이 아님
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
              '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도합니다.',
              'UNKNOWN_ERROR'
            ),
      refetch,
    });
  }, [
    bootstrapQuery.isPending,
    bootstrapQuery.data,
    bootstrapQuery.error,
    refetch,
  ]);

  // 일반 에러: 풀페이지 대신 토스트 1회 + 자동 재조회 (성공/의도된 분기 복귀 시 토스트 플래그 리셋)
  useEffect(() => {
    if (bootstrap.status === 'error') {
      if (!hasToastedBootstrapErrorRef.current) {
        hasToastedBootstrapErrorRef.current = true;
        console.error(
          '[customer-estimate-request] bootstrap error',
          bootstrap.error
        );
        showToast({
          content:
            bootstrap.error?.message ??
            '견적 요청을 불러오지 못했어요. 잠시 후 다시 시도합니다.',
        });
      }

      const timerId = window.setTimeout(() => {
        void refetch();
      }, BOOTSTRAP_AUTO_RETRY_MS);

      return () => window.clearTimeout(timerId);
    }

    if (
      bootstrap.status === 'ready' ||
      bootstrap.status === 'blocked' ||
      bootstrap.status === 'unauthorized' ||
      bootstrap.status === 'profileIncomplete'
    ) {
      hasToastedBootstrapErrorRef.current = false;
    }

    return undefined;
  }, [bootstrap.status, bootstrap.error, refetch, showToast]);

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
      // 저장 성공과 캐시 동기화 분리 — GET 실패가 mutateAsync reject로 이어지면 submit이 스킵됨
      try {
        await syncDetail(variables.estimateRequestId);
      } catch (error) {
        console.error('[saveStep] syncDetail failed', error);
      }
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
      // SUBMITTED 후 재조회 → blocked → EstimateRequestBlocked(제출 완료=진행중 안내 동일 화면)
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
