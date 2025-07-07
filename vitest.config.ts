import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Needed for React and hooks
    globals: true,
    setupFiles: './vitest.setup.ts', // Optional, for jest-dom matchers
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});