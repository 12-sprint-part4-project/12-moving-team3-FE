import type {
  EstimateRequestInputStep,
  EstimateRequestRevisableField,
} from '@/lib/customerEstimateRequestSchema';
import type { ApiSuccessResponse } from '@/types/api';
import type { ApiMoveType } from '@/types/estimateRequest';

/** step body·재수정 필드 타입은 스키마가 SSOT — 여기서 재export */
export type { EstimateRequestInputStep, EstimateRequestRevisableField };

/** BE 견적요청 상태 */
export type EstimateRequestStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'CANCELED';

/** 프로그레스 총 단계 (입력 3 + 완료/full 1) */
export const TOTAL_PROGRESS_STEPS = 4;

/** FE 시각·Progress 스텝 (1~3 입력, 4=Progress full / blocked 호환) */
export type EstimateRequestVisualStep = 1 | 2 | 3 | 4;

/** GET /active — 활성 요청 요약 */
export interface ActiveEstimateRequestSummary {
  id: number;
  status: EstimateRequestStatus;
  currentStep: number;
  totalSteps: number;
  moveType: ApiMoveType | null;
  moveDate: string | null;
  departureAddress: string | null;
  arrivalAddress: string | null;
}

/** GET /active 응답 data */
export interface ActiveEstimateRequestData {
  hasActiveRequest: boolean;
  request: ActiveEstimateRequestSummary | null;
}

/** GET /:id — 상세 */
export interface EstimateRequestDetail {
  id: number;
  status: EstimateRequestStatus;
  currentStep: number;
  totalSteps: number;
  moveType: ApiMoveType | null;
  moveDate: string | null;
  departureZipCode: string | null;
  departureAddress: string | null;
  departureDetailAddress: string | null;
  arrivalZipCode: string | null;
  arrivalAddress: string | null;
  arrivalDetailAddress: string | null;
}

/** POST / — DRAFT 생성 응답 */
export interface CreatedEstimateRequest {
  id: number;
  status: EstimateRequestStatus;
  currentStep: number;
  totalSteps: number;
}

/** PATCH /:id/step 응답 */
export interface SaveEstimateRequestStepResult {
  id: number;
  currentStep: number;
  totalSteps: number;
  isReadyToSubmit: boolean;
}

/** POST /:id/submit 응답 */
export interface SubmitEstimateRequestResult {
  id: number;
  status: EstimateRequestStatus;
  submittedAt: string;
}

/** PATCH /:id/field 응답 — 수정한 필드만 포함 */
export type ReviseEstimateRequestFieldResult = {
  id: number;
} & Partial<
  Record<EstimateRequestRevisableField, string | number | null>
>;

export type ActiveEstimateRequestResponse =
  ApiSuccessResponse<ActiveEstimateRequestData>;
export type EstimateRequestDetailResponse =
  ApiSuccessResponse<EstimateRequestDetail>;
export type CreatedEstimateRequestResponse =
  ApiSuccessResponse<CreatedEstimateRequest>;
export type SaveEstimateRequestStepResponse =
  ApiSuccessResponse<SaveEstimateRequestStepResult>;
export type ReviseEstimateRequestFieldResponse =
  ApiSuccessResponse<ReviseEstimateRequestFieldResult>;
export type SubmitEstimateRequestResponse =
  ApiSuccessResponse<SubmitEstimateRequestResult>;

/** bootstrap 진입 상태 */
export type CustomerEstimateRequestEntryStatus =
  | 'loading'
  | 'ready'
  | 'blocked'
  | 'unauthorized'
  | 'profileIncomplete'
  | 'error';
