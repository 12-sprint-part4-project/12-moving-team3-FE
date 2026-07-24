import type { StorybookConfig } from '@storybook/nextjs-vite';
import svgr from 'vite-plugin-svgr';

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
      // next/image 플러그인이 SVG를 가로채지 않도록 제외 (SVGR이 처리)
      image: {
        excludeFiles: ['**/*.svg'],
      },
    },
  },
  staticDirs: ['../public'],
  async viteFinal(config) {
    config.plugins = [
      ...(config.plugins ?? []),
      svgr({
        include: '**/*.svg',
        svgrOptions: {
          icon: true,
        },
      }),
    ];
    return config;
  },
};

export default config;
