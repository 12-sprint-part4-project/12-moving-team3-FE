'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { customerEstimateRequestQueryKeys } from '@/constants/queryKey';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
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
}

type BootstrapResultOverrides = Partial<
  Omit<CustomerEstimateRequestBootstrap, 'status'>
> &
  Pick<CustomerEstimateRequestBootstrap, 'status'>;

/** bootstrap 분기 공통 결과 팩토리. */
const makeBootstrapResult = (
  overrides: BootstrapResultOverrides
): CustomerEstimateRequestBootstrap => ({
  detail: null,
  blockedRequest: null,
  visualStep: 1,
  error: null,
  isBootstrapping: false,
  ...overrides,
});

/**
 * 활성 요청 조회 → DRAFT 상세 복원 또는 신규 생성.
 * 로그인·프로필 완료 여부는 라우트 가드가 이미 보장하므로 여기서 따로 분기하지 않는다.
 */
const bootstrapCustomerEstimateRequest =
  async (): Promise<CustomerEstimateRequestBootstrap> => {
    try {
      const active = await getActiveEstimateRequest(); // 활성 요청 건이 존재하는지 조회 hasActiveRequest(존재여부 true/false), request(활성 요청 건 데이터)

      // 활성 요청 없음 → DRAFT 생성
      if (!active.hasActiveRequest || !active.request) {
        const created = await createEstimateRequest();
        const detail = await getEstimateRequestDetail(created.id);

        return makeBootstrapResult({
          status: 'ready',
          detail,
          visualStep: toVisualStep(detail.status, detail.currentStep),
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
        visualStep: toVisualStep(detail.status, detail.currentStep),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        // 생성 경합으로 활성 요청이 생긴 경우 → active 재조회
        if (error.code === API_ERROR_CODE.ACTIVE_REQUEST_EXISTS) {
          try {
            const active = await getActiveEstimateRequest();
            if (active.request?.status === 'DRAFT') {
              const detail = await getEstimateRequestDetail(
                active.request.id
              );
              return makeBootstrapResult({
                status: 'ready',
                detail,
                visualStep: toVisualStep(detail.status, detail.currentStep),
              });
            }

            if (active.request) {
              return makeBootstrapResult({
                status: 'blocked',
                blockedRequest: active.request,
                visualStep: 4,
              });
            }
          } catch (retryError) {
            // 경합 복구 재조회 자체가 실패한 경우 — 다른 경로와 동일하게 로그 남기고 error로 정리
            console.error(
              '[customer-estimate-request] bootstrap ACTIVE_REQUEST_EXISTS retry failed',
              retryError
            );

            return makeBootstrapResult({
              status: 'error',
              error:
                retryError instanceof ApiError
                  ? retryError
                  : new ApiError(
                      500,
                      '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도합니다.',
                      API_ERROR_CODE.UNKNOWN_ERROR
                    ),
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
          isNetworkError
            ? API_ERROR_CODE.NETWORK_ERROR
            : API_ERROR_CODE.UNKNOWN_ERROR
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
  const { user, isReady } = useAuth();
  const isCustomerReady = isReady && user?.userType === 'CUSTOMER';
  /** 연속 재시도 중 토스트 스팸 방지 — 정상 진입 상태로 복귀하면 리셋 */
  const hasToastedBootstrapErrorRef = useRef(false);

  const bootstrapQuery = useQuery({
    queryKey: customerEstimateRequestQueryKeys.active(),
    queryFn: bootstrapCustomerEstimateRequest,
    enabled: isCustomerReady,
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
      });
    }

    if (bootstrapQuery.data) {
      return bootstrapQuery.data;
    }

    return makeBootstrapResult({
      status: 'error',
      error:
        bootstrapQuery.error instanceof ApiError
          ? bootstrapQuery.error
          : new ApiError(
              500,
              '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도합니다.',
              API_ERROR_CODE.UNKNOWN_ERROR
            ),
    });
  }, [bootstrapQuery.isPending, bootstrapQuery.data, bootstrapQuery.error]);

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

    if (bootstrap.status === 'ready' || bootstrap.status === 'blocked') {
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
                visualStep: toVisualStep(detail.status, detail.currentStep),
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
