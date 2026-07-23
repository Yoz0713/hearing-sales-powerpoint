import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 獨立於簡報 deck 的小型 App。`api/` 由 Vercel 之類的平台以 serverless function 提供，
// 本機開發用 `vercel dev`（同時起前端與 /api 代理）。
export default defineConfig({
  plugins: [react()],
});
