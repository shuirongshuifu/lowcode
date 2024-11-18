import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // 别名
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [vue()],
  server: {
    port: 7499,
    host: true,
    open: true,
    proxy: {
      '/auth': {
        target: 'http://ashuai.work:10000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, "")
      }
    },
  },
})