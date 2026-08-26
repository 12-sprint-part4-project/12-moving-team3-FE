import { describe, expect, it } from 'vitest';

import {
  REPORT_CATEGORIES,
  REPORT_CATEGORY_OPTIONS,
  REPORT_STATUSES,
  REPORT_TARGETS,
  isReportCategory,
  isReportStatus,
  isReportTarget,
} from './report';

describe('isReportTarget', () => {
  it('정의된 신고 대상만 true를 반환한다', () => {
    for (const target of REPORT_TARGETS) {
      expect(isReportTarget(target)).toBe(true);
    }
  });

  it('알 수 없는 값은 false를 반환한다', () => {
    expect(isReportTarget('POST')).toBe(false);
    expect(isReportTarget('')).toBe(false);
  });
});

describe('isReportCategory', () => {
  it('정의된 신고 사유만 true를 반환한다', () => {
    for (const category of REPORT_CATEGORIES) {
      expect(isReportCategory(category)).toBe(true);
    }
  });

  it('알 수 없는 값은 false를 반환한다', () => {
    expect(isReportCategory('SPAM')).toBe(false);
  });
});

describe('isReportStatus', () => {
  it('정의된 처리 상태만 true를 반환한다', () => {
    for (const status of REPORT_STATUSES) {
      expect(isReportStatus(status)).toBe(true);
    }
  });

  it('알 수 없는 값은 false를 반환한다', () => {
    expect(isReportStatus('DONE')).toBe(false);
  });
});

describe('REPORT_CATEGORY_OPTIONS', () => {
  it('UI 옵션 value가 REPORT_CATEGORIES와 일치한다', () => {
    expect(REPORT_CATEGORY_OPTIONS.map((option) => option.value)).toEqual([
      ...REPORT_CATEGORIES,
    ]);
  });
});
