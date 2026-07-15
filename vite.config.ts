import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 全本地：base 設為相對路徑，方便離線/任意路徑開啟（決策 6）
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173, open: false },
});
