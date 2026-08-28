import { afterEach, describe, expect, it } from 'vitest';

import {
  isLoginGateSuppressed,
  releaseLoginGate,
  suppressLoginGate,
} from './authLoginGate';

describe('authLoginGate', () => {
  afterEach(() => {
    releaseLoginGate();
  });

  it('기본적으로 억제되지 않는다', () => {
    expect(isLoginGateSuppressed()).toBe(false);
  });

  it('suppress 후 true, release 후 false가 된다', () => {
    suppressLoginGate();
    expect(isLoginGateSuppressed()).toBe(true);
    releaseLoginGate();
    expect(isLoginGateSuppressed()).toBe(false);
  });
});
