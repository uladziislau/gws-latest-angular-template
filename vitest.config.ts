import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [angular({ jit: true })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['angular/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./angular', import.meta.url)),
    },
  },
});
