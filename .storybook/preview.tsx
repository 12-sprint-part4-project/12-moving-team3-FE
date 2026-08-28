import type { Preview } from '@storybook/nextjs-vite';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    // App Router 프로젝트이므로 next/navigation 훅(useRouter 등) 목을 항상 활성화한다.
    // 이 값이 없으면 Pages Router 목이 대신 붙어 useRouter를 쓰는 컴포넌트가 렌더에서 터진다.
    nextjs: {
      appDirectory: true,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
