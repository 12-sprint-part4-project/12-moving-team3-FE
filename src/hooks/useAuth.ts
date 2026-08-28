import { useContext } from 'react';

import { AuthContext } from '@/providers/AuthProvider';

/**
 * AuthProvider 내부에서만 사용.
 * user는 authSession 토큰으로 me API를 조회한 결과이다.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
