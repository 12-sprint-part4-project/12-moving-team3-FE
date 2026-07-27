import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import AlarmIcon from './alarm.svg';
import ArrowRightIcon from './arrow-right.svg';
import BoxFillIcon from './box-fill.svg';
import CheckIcon from './check.svg';
import ChevronDownIcon from './chevron-down.svg';
import ChevronLeftIcon from './chevron-left.svg';
import ChevronRightIcon from './chevron-right.svg';
import ChevronUpIcon from './chevron-up.svg';
import ClipIcon from './clip.svg';
import CloseIcon from './close.svg';
import DockFillIcon from './dock-fill.svg';
import EditIcon from './edit.svg';
import FilterIcon from './filter.svg';
import HeartIcon from './heart.svg';
import HomeFillIcon from './home-fill.svg';
import InfoIcon from './info.svg';
import MenuIcon from './menu.svg';
import NoImageIcon from './no-image.svg';
import OfficeFillIcon from './office-fill.svg';
import ProfileIcon from './profile.svg';
import SearchIcon from './search.svg';
import StarIcon from './star.svg';
import SymbolFacebookIcon from './symbol-facebook.svg';
import SymbolKakaoIcon from './symbol-kakao.svg';
import VisibilityOffIcon from './visibility-off.svg';
import VisibilityOnIcon from './visibility-on.svg';

/**
 * `assets/icons`의 svg는 전부 SVGR(Next.js: @svgr/webpack, Storybook: vite-plugin-svgr)로
 * 변환돼 `import Icon from '@/assets/icons/xxx.svg'` 형태로 바로 쓰는 React 컴포넌트다
 * (별도 Icon 래퍼 컴포넌트 없음). 단색 아이콘의 fill/stroke는 currentColor를 사용하므로 className의
 * text-*로 색을, w-*, h-*(size-*)로 크기를 그대로 컨트롤할 수 있다.
 *
 * home-fill/office-fill/box-fill/dock-fill/edit(연필) 5개는 텍스트 색과 무관하게
 * 고정된 브랜드 다색 픽토그램이라 text-*를 줘도 색이 안 바뀌는 게 정상이다.
 *
 * heart(찜하기)는 info/profile과 같은 `--ic-bg`/`--ic-stroke` 토큰 슬롯 패턴을 쓴다.
 * 기본값(--ic-bg: white, --ic-stroke: currentColor)은 구멍이 있는 아웃라인(비활성) 모양이고,
 * `--ic-bg`를 currentColor로 덮어쓰면 구멍이 테두리와 같은 색으로 채워져 솔리드(활성) 모양이
 * 되므로 별도의 heart-active 파일/컴포넌트 없이 className만으로 두 상태를 표현한다.
 * (아래 HeartIconColorSlots 스토리 참고)
 */
const MONO_ICONS = [
  ['star', StarIcon],
  ['alarm', AlarmIcon],
  ['chevron-up', ChevronUpIcon],
  ['chevron-down', ChevronDownIcon],
  ['chevron-left', ChevronLeftIcon],
  ['chevron-right', ChevronRightIcon],
  ['heart', HeartIcon],
  ['clip', ClipIcon],
  ['close (X)', CloseIcon],
  ['check', CheckIcon],
  ['arrow-right', ArrowRightIcon],
  ['visibility-on', VisibilityOnIcon],
  ['visibility-off', VisibilityOffIcon],
  ['filter', FilterIcon],
  ['menu', MenuIcon],
  ['info', InfoIcon],
  ['search', SearchIcon],
  ['profile', ProfileIcon],
  ['no-image', NoImageIcon],
  ['symbol-facebook', SymbolFacebookIcon],
  ['symbol-kakao', SymbolKakaoIcon],
] as const;

const SOLID_ICONS = [
  ['home-fill', HomeFillIcon],
  ['office-fill', OfficeFillIcon],
  ['box-fill', BoxFillIcon],
  ['dock-fill', DockFillIcon],
  ['edit (writing)', EditIcon],
] as const;

interface IconGalleryProps {
  /** Tailwind 클래스를 그대로 전달한다 (예: `text-blue-300 size-10`). 비워두면 무엇도 지정하지 않은 기본 상태를 볼 수 있다. */
  className?: string;
  /** true면 브랜드 다색(솔리드) 아이콘 목록을 보여준다. */
  solid?: boolean;
}

/** Storybook 데모 전용 프레젠테이션 컴포넌트 — 실제 프로젝트 코드에는 존재하지 않는다. */
const IconGallery = ({ className, solid = false }: IconGalleryProps) => (
  <div className="flex flex-wrap items-end gap-6 p-4">
    {(solid ? SOLID_ICONS : MONO_ICONS).map(([name, Icon]) => (
      <figure key={name} className="flex flex-col items-center gap-2">
        <Icon className={className} />
        <figcaption className="text-xs-regular text-black-100">{name}</figcaption>
      </figure>
    ))}
  </div>
);

const meta: Meta<typeof IconGallery> = {
  title: 'UI/Icon',
  component: IconGallery,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
아이콘은 별도의 \`Icon\` 래퍼 컴포넌트 없이, SVGR로 변환된 컴포넌트를 필요한 곳에서
바로 \`import\`해서 쓴다. \`fill\`/\`stroke\`가 \`currentColor\`라서 \`className\`의
\`text-*\`로 색을, \`w-*\`/\`h-*\`(또는 \`size-*\`)로 크기를 그대로 컨트롤할 수 있다.

\`\`\`tsx
import AlarmIcon from '@/assets/icons/alarm.svg';

<AlarmIcon className="w-4 h-4 text-blue-300" />
\`\`\`

- 파일명은 \`assets/icons/\` 아래 kebab-case svg (예: \`chevron-down.svg\`), import alias는 \`PascalCase + Icon\` (예: \`ChevronDownIcon\`) 컨벤션을 따른다.
- \`home-fill\` / \`office-fill\` / \`box-fill\` / \`dock-fill\` / \`edit\`(연필) 5개는 브랜드 다색 픽토그램이라 \`text-*\`로 색이 바뀌지 않는 게 정상이다. (아래 \`SolidMultiColorIcons\` 스토리 참고)
- \`info\` / \`profile\`처럼 한 아이콘 안에 색 역할이 2개 이상(배경·테두리 vs 마크·실루엣)이면 \`currentColor\`
  하나로 퉁치지 않고 \`--ic-bg\`(배경) / \`--ic-stroke\`(마크) 두 CSS 변수로 슬롯을 나눈다. \`info\`는 기본값이
  둘 다 \`currentColor\`라서 오버라이드가 없으면 \`text-*\`만으로 기존과 동일하게 움직이고, \`profile\`은
  기본값 자체를 디자인 원본 토큰(\`--color-background-200\` / \`--color-gray-100\`)으로 고정해서
  className 없이도 원래 프로필 이미지처럼 보인다. 두 경우 모두 필요한 컨텍스트에서만 이 변수를 개별로
  덮어써서 두 역할의 색을 따로 바꿀 수 있다. (아래 \`InfoIconColorSlots\` / \`ProfileIconColorSlots\`
  스토리 참고)
- \`heart\`(찜하기)도 같은 \`--ic-bg\`(구멍) / \`--ic-stroke\`(테두리) 슬롯 패턴을 쓰지만, 기본값이
  \`--ic-bg: white\` / \`--ic-stroke: currentColor\`라서 기본은 구멍이 있는 아웃라인(비활성) 모양으로
  보인다. \`--ic-bg\`를 \`currentColor\`로 덮어쓰면 구멍이 테두리와 같은 색으로 채워져 솔리드(활성)
  모양이 되므로, \`heart-active\` 같은 별도 파일 없이 className만으로 두 상태를 표현한다.
  (아래 \`HeartIconColorSlots\` 스토리 참고)
        `,
      },
    },
  },
  argTypes: {
    className: {
      control: 'text',
      description:
        'Tailwind 클래스를 직접 입력해서 색(`text-*`)과 크기(`w-*`/`h-*`/`size-*`)를 바로 실험해볼 수 있다.',
    },
    solid: {
      control: 'boolean',
      description: '브랜드 다색(솔리드) 아이콘 목록으로 전환',
    },
  },
};
export default meta;

type Story = StoryObj<typeof IconGallery>;

/**
 * className을 아예 지정하지 않은 기본 상태.
 * fill/stroke의 currentColor가 상속받을 색이 없으면(이 프로젝트는 body에 별도 color가 없음)
 * 브라우저 기본 텍스트색인 검정으로, 크기는 1em(부모 font-size 기준)으로 보인다.
 */
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      source: {
        code: `import AlarmIcon from '@/assets/icons/alarm.svg';

<AlarmIcon />`,
      },
    },
  },
};

/** text-* 클래스만으로 아이콘 색이 바뀐다. */
export const ColorWithTextClass: Story = {
  args: {
    className: 'size-10 text-blue-300',
  },
  parameters: {
    docs: {
      source: {
        code: `import AlarmIcon from '@/assets/icons/alarm.svg';

<AlarmIcon className="size-10 text-blue-300" />`,
      },
    },
  },
};

/** w-*, h-* 클래스는 SVG의 width/height 속성을 CSS로 덮어써 아이콘 크기를 변경한다. */
export const SizeWithWidthHeightClass: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8 p-4">
      {(['w-4 h-4', 'w-8 h-8', 'w-12 h-12', 'w-16 h-16'] as const).map((size) => (
        <figure key={size} className="flex flex-col items-center gap-2">
          <StarIcon className={`text-yellow-100 ${size}`} />
          <figcaption className="text-xs-regular text-black-100">{size}</figcaption>
        </figure>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import StarIcon from '@/assets/icons/star.svg';

<StarIcon className="w-4 h-4 text-yellow-100" />
<StarIcon className="w-8 h-8 text-yellow-100" />
<StarIcon className="w-12 h-12 text-yellow-100" />
<StarIcon className="w-16 h-16 text-yellow-100" />`,
      },
    },
  },
};

/** 브랜드 다색 픽토그램(솔리드 계열)은 색이 고정이라 text-*를 줘도 바뀌지 않는 게 정상이다. */
export const SolidMultiColorIcons: Story = {
  args: {
    solid: true,
    className: 'size-10 text-red-200',
  },
  parameters: {
    docs: {
      source: {
        code: `import HomeFillIcon from '@/assets/icons/home-fill.svg';

{/* 브랜드 고정 컬러라 text-red-200을 줘도 색이 바뀌지 않는다 */}
<HomeFillIcon className="size-10 text-red-200" />`,
      },
    },
  },
};

/**
 * `info` 아이콘은 원형 테두리(`--ic-bg`)와 느낌표 마크(`--ic-stroke`) 색을 독립적으로 오버라이드할 수 있다.
 * 왼쪽은 변수를 건드리지 않은 기본 상태(둘 다 currentColor → text-*를 그대로 따라감), 오른쪽은
 * Toast 등 특정 컨텍스트의 CSS에서 두 변수를 각각 다른 색으로 오버라이드한 예시다.
 */
export const InfoIconColorSlots: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8 p-4">
      <figure className="flex flex-col items-center gap-2">
        <InfoIcon className="size-10 text-gray-200" />
        <figcaption className="text-xs-regular text-black-100">
          기본값 (text-gray-200)
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <InfoIcon className="[--ic-bg:var(--color-blue-300)] [--ic-stroke:var(--color-red-200)] size-10" />
        <figcaption className="text-xs-regular text-black-100">
          --ic-bg / --ic-stroke 오버라이드
        </figcaption>
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import InfoIcon from '@/assets/icons/info.svg';

{/* 기본값: 둘 다 currentColor라서 text-*만으로 동일하게 움직인다 */}
<InfoIcon className="size-10 text-gray-200" />

{/* className의 arbitrary property로 --color-* 토큰을 참조해 두 변수를 각각 오버라이드한다 */}
<InfoIcon className="[--ic-bg:var(--color-blue-300)] [--ic-stroke:var(--color-red-200)] size-10" />`,
      },
    },
  },
};

/**
 * profile(기본 프로필 이미지)도 info와 동일하게 배경 원(--ic-bg)과 사람 실루엣(--ic-stroke)
 * 색 슬롯을 분리했다. 다만 info와 달리 기본값이 currentColor가 아니라 디자인 원본 색인
 * --color-background-200(배경) / --color-gray-100(실루엣)으로 고정돼 있어서, className을
 * 아무것도 주지 않아도 항상 기본 프로필 이미지처럼 보인다. 필요한 컨텍스트에서만
 * --ic-bg/--ic-stroke를 오버라이드해서 색을 바꾼다.
 */
export const ProfileIconColorSlots: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8 p-4">
      <figure className="flex flex-col items-center gap-2">
        <ProfileIcon className="size-10" />
        <figcaption className="text-xs-regular text-black-100">
          기본값 (className 없음)
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <ProfileIcon className="[--ic-bg:var(--color-blue-100)] [--ic-stroke:var(--color-blue-300)] size-10" />
        <figcaption className="text-xs-regular text-black-100">
          --ic-bg / --ic-stroke 오버라이드
        </figcaption>
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import ProfileIcon from '@/assets/icons/profile.svg';

{/* 기본값: --ic-bg는 --color-background-200, --ic-stroke는 --color-gray-100으로 고정돼 있어
   className 없이도 디자인 원본 그대로의 프로필 이미지가 보인다 */}
<ProfileIcon className="size-10" />

{/* className의 arbitrary property로 --color-* 토큰을 참조해 두 변수를 각각 오버라이드한다 */}
<ProfileIcon className="[--ic-bg:var(--color-blue-100)] [--ic-stroke:var(--color-blue-300)] size-10" />`,
      },
    },
  },
};

/**
 * heart(찜하기)는 --ic-bg(구멍)/--ic-stroke(테두리) 슬롯 기본값이 info/profile과 다르다.
 * --ic-bg의 기본값이 white라서 구멍이 있는 아웃라인(비활성) 모양으로 보이고,
 * --ic-bg를 currentColor로 덮어쓰면 구멍이 테두리와 같은 색으로 채워져 솔리드(활성) 모양이 된다.
 * 즉 heart-active 같은 별도 파일 없이 className(색 토큰)만 바꿔서 두 상태를 표현할 수 있다.
 */
export const HeartIconColorSlots: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8 p-4">
      <figure className="flex flex-col items-center gap-2">
        <HeartIcon className="size-9 text-gray-100" />
        <figcaption className="text-xs-regular text-black-100">
          기본값 (text-gray-100) — 비활성
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <HeartIcon className="[--ic-bg:currentColor] size-9 text-blue-400" />
        <figcaption className="text-xs-regular text-black-100">
          --ic-bg:currentColor 오버라이드 — 활성
        </figcaption>
      </figure>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `import { cn } from '@/lib/utils';
import HeartIcon from '@/assets/icons/heart.svg';

{/* 비활성: --ic-bg 기본값(white)이 그대로 구멍으로 남아 아웃라인처럼 보인다 */}
<HeartIcon className="size-9 text-gray-100" />

{/* 활성: --ic-bg를 currentColor로 덮어써서 구멍이 테두리와 같은 색으로 채워진다 */}
<HeartIcon
  className={cn('size-9', isLiked ? '[--ic-bg:currentColor] text-blue-400' : 'text-gray-100')}
/>`,
      },
    },
  },
};
