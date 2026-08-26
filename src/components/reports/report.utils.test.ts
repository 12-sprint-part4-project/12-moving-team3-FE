import { describe, expect, it } from 'vitest';

import {
  canCloseReportModal,
  canOpenReportAction,
  canSubmitReportCategory,
  resolveReportModalOpen,
} from './report.utils';

describe('canSubmitReportCategory', () => {
  it('사유가 선택되고 제출 중이 아니면 true를 반환한다', () => {
    expect(canSubmitReportCategory('ABUSIVE_LANGUAGE', false)).toBe(true);
  });

  it('사유가 없으면 false를 반환한다', () => {
    expect(canSubmitReportCategory(null, false)).toBe(false);
  });

  it('제출 중이면 false를 반환한다', () => {
    expect(canSubmitReportCategory('INAPPROPRIATE_PROFILE', true)).toBe(false);
  });
});

describe('canCloseReportModal', () => {
  it('제출 중이 아니면 닫을 수 있다', () => {
    expect(canCloseReportModal(false)).toBe(true);
  });

  it('제출 중이면 닫을 수 없다', () => {
    expect(canCloseReportModal(true)).toBe(false);
  });
});

describe('canOpenReportAction', () => {
  it('로그인 사용자면 true를 반환한다', () => {
    expect(canOpenReportAction({ id: 'user-1' })).toBe(true);
  });

  it('비로그인이면 false를 반환한다', () => {
    expect(canOpenReportAction(null)).toBe(false);
    expect(canOpenReportAction(undefined)).toBe(false);
  });
});

describe('resolveReportModalOpen', () => {
  it('controlled면 controlledOpen을 따른다', () => {
    expect(resolveReportModalOpen(true, false)).toBe(true);
    expect(resolveReportModalOpen(false, true)).toBe(false);
  });

  it('uncontrolled면 internalOpen을 따른다', () => {
    expect(resolveReportModalOpen(undefined, true)).toBe(true);
    expect(resolveReportModalOpen(undefined, false)).toBe(false);
  });
});
