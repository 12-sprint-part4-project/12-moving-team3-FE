import { useContext } from 'react';

import { AuthContext } from '@/providers/AuthProvider';

/**
 * useAuth 훅은 React의 useContext를 사용하여 AuthContext의 값을 반환하는 커스텀 훅입니다.
 * 이 훅은 반드시 AuthProvider 컴포넌트 내부(즉, AuthContext의 Provider로 감싸진 곳)에서만 호출해야 하며,
 * Provider 외부에서 호출될 경우 오류를 발생시켜 올바르지 않은 사용을 방지합니다.
 *
 * 사용 예시:
 *   const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  //Context란?
  //React에서 여러 컴포넌트가 전역적으로(부모-자식 간이 아닌) 값을 공유할 수 있게 해주는 기능

  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
  //여기에서 리턴하는 것: user정보가 담긴 객체
  /*
  User 객체의 구성
  
  id: string;
  userType: ApiUserType;
  nickname: string;
  email: string;
  phoneNumber: string;
  isProfileCompleted: boolean;
  status: UserStatus;
  */
};
