import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.ts']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'doubly-linked-list-typescript': resolve(__dirname, '../src/index.ts')
    }
  }
})
