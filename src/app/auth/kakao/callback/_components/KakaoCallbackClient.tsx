'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import {
  parseKakaoCallbackParams,
  resolveKakaoLoginErrorMessage,
} from '@/lib/kakaoAuth';
import { kakaoLogin } from '@/service/authApi';
import type { ApiUserType } from '@/types/auth';

const LOGIN_HREF_BY_USER_TYPE: Record<ApiUserType, string> = {
  CUSTOMER: '/login',
  MOVER: '/login/mover',
};

/**
 * 카카오 OAuth 콜백:
 * code / userType 파싱 → BE 로그인 → 세션 저장 → 홈 이동
 * 화면 문구 없이 토스트로만 결과를 안내한다.
 */
export const KakaoCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { setSession } = useAuth();
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    // Strict Mode 중복 실행 / code 일회용 소모 방지
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    const loginWithKakao = async () => {
      const result = parseKakaoCallbackParams(searchParams);

      if (!result.ok) {
        showToast({ content: result.message });
        router.replace('/login');
        return;
      }

      try {
        const response = await kakaoLogin({
          code: result.code,
          userType: result.userType,
        });

        setSession({
          accessToken: response.data.accessToken,
          user: response.data.user,
        });

        showToast({
          content: response.data.isNewUser
            ? '회원가입이 완료되었습니다.'
            : '로그인되었습니다.',
        });
        router.replace('/');
      } catch (error) {
        const message =
          error instanceof ApiError
            ? resolveKakaoLoginErrorMessage(error.code, error.message)
            : '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        showToast({ content: message });
        router.replace(LOGIN_HREF_BY_USER_TYPE[result.userType]);
      }
    };

    void loginWithKakao();
  }, [router, searchParams, setSession, showToast]);

  return <section className="min-h-full w-full bg-white" aria-hidden />;
};
