'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useToast } from '@/hooks/useToast';
import { parseKakaoCallbackParams } from '@/lib/kakaoAuth';

type CallbackStatus = 'parsing' | 'received' | 'failed';

/**
 * 카카오 OAuth 콜백에서 인가 코드(code)와 userType(state)을 수신한다.
 * 이 단계에서는 BE로 전달하지 않고, 정상 수신 여부만 확인한다.
 */
export const KakaoCallbackClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState<CallbackStatus>('parsing');

  useEffect(() => {
    const result = parseKakaoCallbackParams(searchParams);

    if (!result.ok) {
      setStatus('failed');
      showToast({ content: result.message });
      router.replace('/login');
      return;
    }

    // code는 일회용·민감값이므로 화면에 노출하거나 로그에 남기지 않는다.
    setStatus('received');
  }, [router, searchParams, showToast]);

  const message =
    status === 'failed'
      ? '카카오 로그인에 실패했습니다.'
      : status === 'received'
        ? '인가 코드를 수신했습니다.'
        : '카카오 로그인 처리 중...';

  return (
    <section className="flex min-h-full w-full flex-col items-center justify-center bg-white px-6 py-16">
      <p className="text-md-regular text-black-400 lg:text-xl-regular">
        {message}
      </p>
    </section>
  );
};
