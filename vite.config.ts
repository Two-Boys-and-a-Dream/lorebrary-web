/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  server: {
    open: false,
  },
  build: {
    sourcemap: true,
  },
  // Vitest config
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './__mocks__/setupTests.ts',
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['json', 'text', 'lcov', 'html'],
      include: ['src/**/*.{js,ts,tsx}'],
      exclude: [
        'src/**/index.ts',
        'src/**/index.tsx',
        'src/**/*.test.{ts,tsx}',
        'src/utils/testUtils.tsx',
        'src/types/**',
        'src/api/__mocks__/**',
      ],
      thresholds: {
        branches: 78.03,
        functions: 100,
        lines: 99.56,
        statements: 90.68,
      },
    },
  },
})
