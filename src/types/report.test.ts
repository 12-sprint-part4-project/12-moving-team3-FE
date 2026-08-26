import { describe, expect, it } from 'vitest';

import {
  REPORT_CATEGORIES,
  REPORT_STATUSES,
  REPORT_TARGETS,
  isReportCategory,
  isReportStatus,
  isReportTarget,
} from './report';

describe('isReportTarget', () => {
  it('정의된 신고 대상만 true를 반환한다', () => {
    expect(isReportTarget('USER')).toBe(true);
    expect(isReportTarget('REVIEW')).toBe(true);
    expect(REPORT_TARGETS.every(isReportTarget)).toBe(true);
    expect(isReportTarget('POST')).toBe(false);
  });
});

describe('isReportCategory', () => {
  it('정의된 신고 사유만 true를 반환한다', () => {
    expect(REPORT_CATEGORIES.every(isReportCategory)).toBe(true);
    expect(isReportCategory('SPAM')).toBe(false);
  });
});

describe('isReportStatus', () => {
  it('정의된 처리 상태만 true를 반환한다', () => {
    expect(REPORT_STATUSES.every(isReportStatus)).toBe(true);
    expect(isReportStatus('DONE')).toBe(false);
  });
});
