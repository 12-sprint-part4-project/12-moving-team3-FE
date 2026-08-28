import { beforeEach, describe, expect, it, vi } from 'vitest';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError } from '@/lib/apiClient';
import { toVisualStep } from '@/lib/customerEstimateRequestSchema';
import {
  createEstimateRequest,
  getActiveEstimateRequest,
  getEstimateRequestDetail,
} from '@/services/customerEstimateRequestApi';

import { bootstrapCustomerEstimateRequest } from './useCustomerEstimateRequest';

import type {
  ActiveEstimateRequestData,
  EstimateRequestDetail,
} from '@/types/customerEstimateRequest';

vi.mock('@/services/customerEstimateRequestApi');

const mockGetActiveEstimateRequest = vi.mocked(getActiveEstimateRequest);
const mockCreateEstimateRequest = vi.mocked(createEstimateRequest);
const mockGetEstimateRequestDetail = vi.mocked(getEstimateRequestDetail);

const draftDetail: EstimateRequestDetail = {
  id: 1,
  status: 'DRAFT',
  currentStep: 2,
  totalSteps: 4,
  moveType: null,
  moveDate: null,
  departureZipCode: null,
  departureAddress: null,
  departureDetailAddress: null,
  arrivalZipCode: null,
  arrivalAddress: null,
  arrivalDetailAddress: null,
};

const submittedSummary: ActiveEstimateRequestData['request'] = {
  id: 2,
  status: 'SUBMITTED',
  currentStep: 4,
  totalSteps: 4,
  moveType: 'HOME',
  moveDate: '2026-09-01',
  departureAddress: '서울시 강남구',
  arrivalAddress: '서울시 마포구',
};

const draftSummary: ActiveEstimateRequestData['request'] = {
  id: 1,
  status: 'DRAFT',
  currentStep: 2,
  totalSteps: 4,
  moveType: null,
  moveDate: null,
  departureAddress: null,
  arrivalAddress: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('bootstrapCustomerEstimateRequest', () => {
  it('활성 요청 없음 → DRAFT 생성 후 ready를 반환한다', async () => {
    mockGetActiveEstimateRequest.mockResolvedValue({
      hasActiveRequest: false,
      request: null,
    });
    mockCreateEstimateRequest.mockResolvedValue({
      id: 1,
      status: 'DRAFT',
      currentStep: 1,
      totalSteps: 4,
    });
    mockGetEstimateRequestDetail.mockResolvedValue(draftDetail);

    const result = await bootstrapCustomerEstimateRequest();

    expect(mockCreateEstimateRequest).toHaveBeenCalledOnce();
    expect(mockGetEstimateRequestDetail).toHaveBeenCalledWith(1);
    expect(result.status).toBe('ready');
    expect(result.detail).toEqual(draftDetail);
    expect(result.visualStep).toBe(
      toVisualStep(draftDetail.status, draftDetail.currentStep)
    );
  });

  it('활성 요청이 DRAFT가 아니면 blocked를 반환한다', async () => {
    mockGetActiveEstimateRequest.mockResolvedValue({
      hasActiveRequest: true,
      request: submittedSummary,
    });

    const result = await bootstrapCustomerEstimateRequest();

    expect(mockGetEstimateRequestDetail).not.toHaveBeenCalled();
    expect(result.status).toBe('blocked');
    expect(result.blockedRequest).toEqual(submittedSummary);
    expect(result.visualStep).toBe(4);
  });

  it('DRAFT 활성 요청이 있으면 이어서 작성한다(ready)', async () => {
    mockGetActiveEstimateRequest.mockResolvedValue({
      hasActiveRequest: true,
      request: draftSummary,
    });
    mockGetEstimateRequestDetail.mockResolvedValue(draftDetail);

    const result = await bootstrapCustomerEstimateRequest();

    expect(mockCreateEstimateRequest).not.toHaveBeenCalled();
    expect(mockGetEstimateRequestDetail).toHaveBeenCalledWith(1);
    expect(result.status).toBe('ready');
    expect(result.detail).toEqual(draftDetail);
  });

  describe('ACTIVE_REQUEST_EXISTS 에러 시 재조회', () => {
    it('재조회 결과가 DRAFT면 ready를 반환한다', async () => {
      mockGetActiveEstimateRequest
        .mockRejectedValueOnce(
          new ApiError(409, '이미 활성 요청이 있습니다.', API_ERROR_CODE.ACTIVE_REQUEST_EXISTS)
        )
        .mockResolvedValueOnce({
          hasActiveRequest: true,
          request: draftSummary,
        });
      mockGetEstimateRequestDetail.mockResolvedValue(draftDetail);

      const result = await bootstrapCustomerEstimateRequest();

      expect(mockGetActiveEstimateRequest).toHaveBeenCalledTimes(2);
      expect(result.status).toBe('ready');
    });

    it('재조회 결과가 DRAFT가 아니면 blocked를 반환한다', async () => {
      mockGetActiveEstimateRequest
        .mockRejectedValueOnce(
          new ApiError(409, '이미 활성 요청이 있습니다.', API_ERROR_CODE.ACTIVE_REQUEST_EXISTS)
        )
        .mockResolvedValueOnce({
          hasActiveRequest: true,
          request: submittedSummary,
        });

      const result = await bootstrapCustomerEstimateRequest();

      expect(result.status).toBe('blocked');
      expect(result.blockedRequest).toEqual(submittedSummary);
    });

    it('재조회 결과에 활성 요청이 없으면 error를 반환한다', async () => {
      mockGetActiveEstimateRequest
        .mockRejectedValueOnce(
          new ApiError(409, '이미 활성 요청이 있습니다.', API_ERROR_CODE.ACTIVE_REQUEST_EXISTS)
        )
        .mockResolvedValueOnce({
          hasActiveRequest: false,
          request: null,
        });

      const result = await bootstrapCustomerEstimateRequest();

      expect(result.status).toBe('error');
      expect(result.error?.code).toBe(API_ERROR_CODE.UNKNOWN_ERROR);
    });

    it('재조회 자체가 실패하면 error를 반환한다', async () => {
      const retryError = new ApiError(500, '재조회 실패', API_ERROR_CODE.UNKNOWN_ERROR);
      mockGetActiveEstimateRequest
        .mockRejectedValueOnce(
          new ApiError(409, '이미 활성 요청이 있습니다.', API_ERROR_CODE.ACTIVE_REQUEST_EXISTS)
        )
        .mockRejectedValueOnce(retryError);

      const result = await bootstrapCustomerEstimateRequest();

      expect(result.status).toBe('error');
      expect(result.error).toBe(retryError);
    });
  });

  it('그 외 ApiError는 error 상태로 그대로 전달된다', async () => {
    const apiError = new ApiError(401, '인증이 필요합니다.', API_ERROR_CODE.UNAUTHORIZED);
    mockGetActiveEstimateRequest.mockRejectedValue(apiError);

    const result = await bootstrapCustomerEstimateRequest();

    expect(result.status).toBe('error');
    expect(result.error).toBe(apiError);
  });

  it('네트워크 에러(TypeError)는 NETWORK_ERROR로 정규화된다', async () => {
    mockGetActiveEstimateRequest.mockRejectedValue(new TypeError('Failed to fetch'));

    const result = await bootstrapCustomerEstimateRequest();

    expect(result.status).toBe('error');
    expect(result.error?.code).toBe(API_ERROR_CODE.NETWORK_ERROR);
  });

  it('알 수 없는 Error는 UNKNOWN_ERROR로 정규화된다', async () => {
    mockGetActiveEstimateRequest.mockRejectedValue(new Error('무언가 잘못됨'));

    const result = await bootstrapCustomerEstimateRequest();

    expect(result.status).toBe('error');
    expect(result.error?.code).toBe(API_ERROR_CODE.UNKNOWN_ERROR);
  });
});
