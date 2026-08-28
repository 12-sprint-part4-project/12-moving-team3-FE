/** 로그아웃 후 보호 경로에 남는 동안 LoginRequired 모달·가드를 잠시 끈다. */
let loginGateSuppressed = false;

export const suppressLoginGate = (): void => {
  loginGateSuppressed = true;
};

export const releaseLoginGate = (): void => {
  loginGateSuppressed = false;
};

export const isLoginGateSuppressed = (): boolean => loginGateSuppressed;
