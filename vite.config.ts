import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 全本地：base 設為相對路徑，方便離線/任意路徑開啟（決策 6）
//
// 兩種產出：
//   npm run build         → dist/          一般靜態網站，需用 http 開（npm run preview）
//   npm run build:single  → dist-single/   單一 HTML，JS/CSS/字型/圖片全部內嵌，
//                                          雙擊即可用 file:// 開啟（簡報機不必架伺服器）
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: './',
    plugins: [react(), ...(single ? [viteSingleFile()] : [])],
    server: { port: 5173, open: false },
    build: single ? { outDir: 'dist-single' } : {},
  };
});
