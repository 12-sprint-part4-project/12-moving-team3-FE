import svgr from 'vite-plugin-svgr';

import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      // @storybook/nextjs-vite는 next/image를 흉내내기 위해 기본적으로 *.svg까지
      // 자체 이미지 파이프라인(resolveId 단계)에서 가로채 next/image의 StaticImageData 형태의
      // 객체로 바꿔버린다. 그 결과 <StarIcon />처럼 svg를 컴포넌트로 import해 쓰면
      // "Element type is invalid ... got: object" 에러가 난다.
      // 옵션 키는 vite-plugin-storybook-nextjs README에는 include/exclude로 나와 있지만,
      // 실제 설치된 @storybook/nextjs-vite(dist/index.d.ts)의 FrameworkOptions 타입은
      // includeFiles/excludeFiles이므로 이 이름을 써야 실제로 필터가 적용된다.
      // svg는 이 처리에서 완전히 빼서 vite-plugin-svgr가 React 컴포넌트로 다룰 수 있게 한다.
      image: {
        excludeFiles: ['**/*.svg'],
      },
    },
  },
  staticDirs: ['../public'],
  // next.config.ts의 turbopack "*.svg" 규칙(@svgr/webpack, icon: true)과 동일하게,
  // Storybook(Vite) 쪽에서도 `import Icon from '*.svg'`를 React 아이콘 컴포넌트로 바로 import할 수 있도록 맞춰준다.
  // vite-plugin-svgr는 기본적으로 '*.svg?react' 접미사가 붙은 import만 변환하므로,
  // 접미사 없이도 동작하도록 include 패턴을 '**/*.svg'로 넓혀준다.
  async viteFinal(viteConfig) {
    viteConfig.plugins ??= [];
    viteConfig.plugins.push(
      svgr({ include: '**/*.svg', svgrOptions: { icon: true } })
    );
    return viteConfig;
  },
};

export default config;
