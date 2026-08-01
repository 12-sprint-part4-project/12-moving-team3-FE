import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/*
  TEXT FIELD CHAT (Figma 1-1202)

  채팅 말풍선 UI입니다. (입력 필드가 아니라 메시지 표시용)
  보낸 사람 역할(color)에 따라 배경색·모서리 둥글림이 달라져
  대화 흐름에서 수신/발신을 구분합니다.

  크기는 size props가 아니라 mobile-first 반응형 클래스로 처리합니다.
  - 기본(sm): px-20 py-12 / 14px / radius 24px
  - md+: px-40 py-20 / 18px / radius 30px

  [props]
  - color:
    · incoming    — 상대 메시지 (흰 배경, 왼쪽 위 모서리 각짐)
    · mePrimary   — 내 메시지 (파란 배경)
    · meSecondary — 내 메시지 (연파란 배경)
  - children: 말풍선 본문 (모바일 기준)
  - desktopChildren: 데스크톱에서만 다른 문구가 필요할 때
  - className / ...rest: HTMLAttributes<HTMLDivElement>
*/

type ChatColor = 'incoming' | 'mePrimary' | 'meSecondary';

interface TextFieldChatProps extends HTMLAttributes<HTMLDivElement> {
  color?: ChatColor;
  children: ReactNode;
  /** 모바일과 데스크톱 문구가 다를 때만 전달 */
  desktopChildren?: ReactNode;
}

const colorStyles: Record<ChatColor, string> = {
  incoming: 'bg-white text-black-400',
  mePrimary: 'bg-blue-300 text-white',
  meSecondary: 'bg-blue-100 text-blue-300',
};

// meSecondary만 semibold — Figma에서 보조 말풍선 강조 톤이 다름
const typographyStyles: Record<ChatColor, string> = {
  incoming: 'text-md-medium md:text-2lg-medium',
  mePrimary: 'text-md-medium md:text-2lg-medium',
  meSecondary: 'text-md-semibold md:text-2lg-semibold',
};

// incoming은 왼쪽 위를 각지게, me*는 오른쪽 위를 각지게 (말풍선 꼬리 방향)
// sm radius 24px(3xl) → md 30px(1.875rem)
const radiusStyles: Record<ChatColor, string> = {
  incoming:
    'rounded-tr-3xl rounded-br-3xl rounded-bl-3xl md:rounded-tr-[1.875rem] md:rounded-br-[1.875rem] md:rounded-bl-[1.875rem]',
  mePrimary:
    'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl md:rounded-tl-[1.875rem] md:rounded-br-[1.875rem] md:rounded-bl-[1.875rem]',
  meSecondary:
    'rounded-tl-3xl rounded-br-3xl rounded-bl-3xl md:rounded-tl-[1.875rem] md:rounded-br-[1.875rem] md:rounded-bl-[1.875rem]',
};

export const TextFieldChat = ({
  color = 'incoming',
  children,
  desktopChildren,
  className,
  ...rest
}: TextFieldChatProps) => {
  const hasDesktopChildren = desktopChildren != null;

  return (
    <div
      {...rest}
      className={cn(
        'inline-flex max-w-full px-5 py-3 drop-shadow-sm md:px-10 md:py-5',
        colorStyles[color],
        typographyStyles[color],
        radiusStyles[color],
        className
      )}
    >
      {/* pre-wrap: 줄바꿈·공백 유지, break-words: 긴 URL 등 오버플로우 방지 */}
      <p className="break-words whitespace-pre-wrap">
        {hasDesktopChildren ? (
          <>
            <span className="md:hidden">{children}</span>
            <span className="hidden md:inline">{desktopChildren}</span>
          </>
        ) : (
          children
        )}
      </p>
    </div>
  );
};
