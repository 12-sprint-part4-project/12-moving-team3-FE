import { describe, expect, it } from 'vitest';

import { isCreateReportResponse } from './reportsApi';

describe('isCreateReportResponse', () => {
  it('유효한 신고 생성 응답이면 true를 반환한다', () => {
    expect(
      isCreateReportResponse({
        data: {
          id: 1,
          reporterId: 'user-1',
          target: 'REVIEW',
          targetId: '12',
          category: 'ABUSIVE_LANGUAGE',
          status: 'PENDING',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      })
    ).toBe(true);
  });

  it('필수 필드가 없으면 false를 반환한다', () => {
    expect(isCreateReportResponse({ data: { id: 1 } })).toBe(false);
    expect(isCreateReportResponse(null)).toBe(false);
    expect(isCreateReportResponse({})).toBe(false);
  });

  it('알 수 없는 target·category·status면 false를 반환한다', () => {
    expect(
      isCreateReportResponse({
        data: {
          id: 1,
          reporterId: 'user-1',
          target: 'POST',
          targetId: '12',
          category: 'ABUSIVE_LANGUAGE',
          status: 'PENDING',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      })
    ).toBe(false);

    expect(
      isCreateReportResponse({
        data: {
          id: 1,
          reporterId: 'user-1',
          target: 'REVIEW',
          targetId: '12',
          category: 'SPAM',
          status: 'PENDING',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      })
    ).toBe(false);
  });
});
