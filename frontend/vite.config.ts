import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@': resolve(__dirname, 'src'),
      'doubly-linked-list-typescript': resolve(__dirname, './src/lib/doubly-linked-list.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
