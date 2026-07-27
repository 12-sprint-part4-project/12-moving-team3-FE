import type { HTMLAttributes, ReactNode } from 'react';

/*
  TEXT FIELD CHAT

  채팅 말풍선 UI입니다. (입력 필드가 아니라 메시지 표시용)
  보낸 사람 역할(color)에 따라 배경색·모서리 둥글림이 달라져
  대화 흐름에서 수신/발신을 구분합니다.

  [props]
  - color:
    · incoming    — 상대 메시지 (흰 배경, 왼쪽 위 모서리 각짐)
    · mePrimary   — 내 메시지 (파란 배경)
    · meSecondary — 내 메시지 (연파란 배경)
  - size: 'sm' | 'md'
  - children: 말풍선 본문
  - className / ...rest: HTMLAttributes<HTMLDivElement>
*/

type ChatColor = 'incoming' | 'mePrimary' | 'meSecondary';
type ChatSize = 'sm' | 'md';

interface TextFieldChatProps extends HTMLAttributes<HTMLDivElement> {
  color?: ChatColor;
  size?: ChatSize;
  children: ReactNode;
}

const colorStyles: Record<ChatColor, string> = {
  incoming: 'bg-white text-black-400',
  mePrimary: 'bg-blue-300 text-white',
  meSecondary: 'bg-blue-100 text-blue-300',
};

// meSecondary만 semibold — Figma에서 보조 말풍선 강조 톤이 다름
const sizeStyles: Record<ChatSize, Record<ChatColor, string>> = {
  sm: {
    incoming: 'px-5 py-3 text-md-medium',
    mePrimary: 'px-5 py-3 text-md-medium',
    meSecondary: 'px-5 py-3 text-md-semibold',
  },
  md: {
    incoming: 'px-10 py-5 text-2lg-medium',
    mePrimary: 'px-10 py-5 text-2lg-medium',
    meSecondary: 'px-10 py-5 text-2lg-semibold',
  },
};

// incoming은 왼쪽 위를 각지게, me*는 오른쪽 위를 각지게 (말풍선 꼬리 방향 표현)
const radiusStyles: Record<ChatColor, Record<ChatSize, string>> = {
  incoming: {
    sm: 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl',
  },
  mePrimary: {
    sm: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
  },
  meSecondary: {
    sm: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
    md: 'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl',
  },
};

export const TextFieldChat = ({
  color = 'incoming',
  size = 'sm',
  children,
  className = '',
  ...rest
}: TextFieldChatProps) => {
  return (
    <div
      {...rest}
      className={`inline-flex max-w-full drop-shadow-sm ${colorStyles[color]} ${sizeStyles[size][color]} ${radiusStyles[color][size]} ${className}`.trim()}
    >
      {/* pre-wrap: 줄바꿈·공백 유지, break-words: 긴 URL 등 오버플로우 방지 */}
      <p className="break-words whitespace-pre-wrap">{children}</p>
    </div>
  );
};
