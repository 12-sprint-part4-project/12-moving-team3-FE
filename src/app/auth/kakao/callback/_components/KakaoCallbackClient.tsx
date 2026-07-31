'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { parseKakaoCallbackParams } from '@/lib/kakaoAuth';
import { kakaoLogin } from '@/service/authApi';
import type { ApiUserType } from '@/types/auth';

type CallbackStatus = 'pending' | 'success' | 'failed';

const LOGIN_HREF_BY_USER_TYPE: Record<ApiUserType, string> = {
  CUSTOMER: '/login',
  MOVER: '/login/mover',
};

/**
 * 카카오 OAuth 콜백:
 * code / userType 파싱 → BE 로그인 → 세션 저장 → 홈 이동
 */
export const KakaoCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { setSession } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>('pending');
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    // Strict Mode 중복 실행 / code 일회용 소모 방지
    if (hasRequestedRef.current) return;
    hasRequestedRef.current = true;

    const loginWithKakao = async () => {
      const result = parseKakaoCallbackParams(searchParams);

      if (!result.ok) {
        setStatus('failed');
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
        setStatus('success');
        router.replace('/');
      } catch (error) {
        setStatus('failed');
        const message =
          error instanceof ApiError
            ? error.message
            : '카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.';
        showToast({ content: message });
        router.replace(LOGIN_HREF_BY_USER_TYPE[result.userType]);
      }
    };

    void loginWithKakao();
  }, [router, searchParams, setSession, showToast]);

  const message =
    status === 'failed'
      ? '카카오 로그인에 실패했습니다.'
      : status === 'success'
        ? '로그인되었습니다.'
        : '카카오 로그인 처리 중...';

  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center bg-white px-6 py-16">
      <p className="text-md-regular text-black-400 lg:text-xl-regular">
        {message}
      </p>
    </section>
  );
};
