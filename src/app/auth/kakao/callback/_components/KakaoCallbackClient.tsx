'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { ApiError } from '@/lib/apiClient';
import { LOGIN_HREF_BY_USER_TYPE } from '@/lib/authRoutePaths';
import { getPostAuthRedirectPath } from '@/lib/getPostAuthRedirectPath';
import {
  consumeKakaoOAuthState,
  parseKakaoCallbackParams,
  resolveKakaoLoginErrorMessage,
} from '@/lib/kakaoAuth';
import { kakaoLogin } from '@/services/authApi';

/** 카카오 OAuth 콜백. 토스트만 보여주고 세션 저장 후 이동한다. */
export const KakaoCallbackClient = () => {
  const { t } = useTranslation();
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

      const oauthState = consumeKakaoOAuthState(result.state);

      if (!oauthState) {
        showToast({ content: t('auth.kakao.invalidRequest') });
        router.replace('/login');
        return;
      }

      const { userType, redirectTo } = oauthState;

      try {
        const response = await kakaoLogin({
          code: result.code,
          userType,
        });

        setSession({
          accessToken: response.data.accessToken,
        });

        showToast({
          content: response.data.isNewUser
            ? t('auth.kakao.signupComplete')
            : t('auth.login.success'),
        });
        router.replace(
          getPostAuthRedirectPath(response.data.user, { redirectTo })
        );
      } catch (error) {
        const message =
          error instanceof ApiError
            ? resolveKakaoLoginErrorMessage(error.code, error.message)
            : t('auth.kakao.unexpected');
        showToast({ content: message });
        router.replace(LOGIN_HREF_BY_USER_TYPE[userType]);
      }
    };

    void loginWithKakao();
  }, [router, searchParams, setSession, showToast, t]);

  return <section className="min-h-full w-full bg-white" aria-hidden />;
};
