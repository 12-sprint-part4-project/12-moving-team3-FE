import { describe, expect, it } from 'vitest';

import { API_ERROR_CODE } from '@/constants/errorCode';
import { ApiError } from '@/lib/apiClient';

import {
  isMoverDetailNotFound,
  resolveDesignatedButtonState,
  resolveShowChatCta,
} from './moverDetail.utils';

describe('isMoverDetailNotFound', () => {
  it('404 ApiError이면 true를 반환한다', () => {
    expect(
      isMoverDetailNotFound(
        true,
        new ApiError(404, '기사를 찾을 수 없습니다.')
      )
    ).toBe(true);
  });

  it('MOVER_NOT_FOUND 코드면 status와 무관하게 true를 반환한다', () => {
    expect(
      isMoverDetailNotFound(
        true,
        new ApiError(
          400,
          '기사를 찾을 수 없습니다.',
          API_ERROR_CODE.MOVER_NOT_FOUND
        )
      )
    ).toBe(true);
  });

  it('다른 ApiError이거나 isError가 false이면 false를 반환한다', () => {
    expect(
      isMoverDetailNotFound(
        true,
        new ApiError(500, '서버 오류', API_ERROR_CODE.UNKNOWN_ERROR)
      )
    ).toBe(false);
    expect(
      isMoverDetailNotFound(
        false,
        new ApiError(404, '기사를 찾을 수 없습니다.')
      )
    ).toBe(false);
  });
});

describe('resolveShowChatCta', () => {
  const baseInput = {
    showDesignatedCta: true,
    isAlreadyDesignated: true,
    designatedMoverId: 42,
    estimateRequestId: 100,
  };

  it('지정 견적·요청 정보가 모두 있으면 true를 반환한다', () => {
    expect(resolveShowChatCta(baseInput)).toBe(true);
  });

  it('CTA 숨김·미지정·id 누락이면 false를 반환한다', () => {
    expect(
      resolveShowChatCta({ ...baseInput, showDesignatedCta: false })
    ).toBe(false);
    expect(
      resolveShowChatCta({ ...baseInput, isAlreadyDesignated: false })
    ).toBe(false);
    expect(
      resolveShowChatCta({ ...baseInput, designatedMoverId: null })
    ).toBe(false);
    expect(
      resolveShowChatCta({ ...baseInput, estimateRequestId: null })
    ).toBe(false);
  });
});

describe('resolveDesignatedButtonState', () => {
  it('요청 중·이미 지정이면 hard disabled이다', () => {
    expect(
      resolveDesignatedButtonState({
        isPending: true,
        isAlreadyDesignated: false,
        isStatusLoading: false,
        isRequestFailed: false,
        hasReceivedQuoteFromMover: false,
        isQuoteStatusError: false,
      })
    ).toEqual({ isHardDisabled: true, isSoftBlocked: false });
  });

  it('견적 수신은 soft blocked이고, hard disabled면 soft blocked는 false이다', () => {
    expect(
      resolveDesignatedButtonState({
        isPending: false,
        isAlreadyDesignated: false,
        isStatusLoading: false,
        isRequestFailed: false,
        hasReceivedQuoteFromMover: true,
        isQuoteStatusError: false,
      })
    ).toEqual({ isHardDisabled: false, isSoftBlocked: true });

    expect(
      resolveDesignatedButtonState({
        isPending: false,
        isAlreadyDesignated: true,
        isStatusLoading: false,
        isRequestFailed: false,
        hasReceivedQuoteFromMover: true,
        isQuoteStatusError: true,
      })
    ).toEqual({ isHardDisabled: true, isSoftBlocked: false });
  });
});
