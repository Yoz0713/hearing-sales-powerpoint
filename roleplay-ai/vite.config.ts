import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * 本機開發用：把 `api/chat.ts` 掛成 dev server 的 middleware，
 * 讓 `npm run dev` 就能完整跑（含 /api/chat），不需要 Vercel CLI 登入或 link。
 *
 * 正式部署不受影響 —— 平台仍直接把 `api/chat.ts` 當 serverless function，
 * 這個 plugin 只在 `apply: 'serve'` 時存在，build 產物裡沒有它。
 */
function apiDevPlugin(): Plugin {
  return {
    name: 'roleplay-api-dev',
    apply: 'serve',
    configureServer(server) {
      if (!process.env.GEMINI_API_KEY) {
        server.config.logger.warn(
          '[api] 找不到 GEMINI_API_KEY —— 請在 roleplay-ai/.env.local 設定後重啟 dev server。',
        );
      }

      server.middlewares.use('/api/chat', (req, res) => {
        void (async () => {
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(chunk as Buffer);

            // 每次請求重新載入，改 api/chat.ts 免重啟。
            const mod = await server.ssrLoadModule('/api/chat.ts');
            const handler = mod.default as (req: unknown, res: unknown) => Promise<void>;

            await handler(
              {
                method: req.method,
                headers: req.headers,
                body: Buffer.concat(chunks).toString('utf8'),
                socket: req.socket,
              },
              res,
            );
          } catch (err) {
            // 讓錯誤同時出現在終端機與瀏覽器，不要只回一個空的 500。
            server.config.logger.error(`[api] /api/chat 失敗：${String(err)}`);
            if (!res.writableEnded) {
              res.statusCode = 500;
              res.setHeader('content-type', 'application/json; charset=utf-8');
              res.end(JSON.stringify({ error: `本機代理錯誤：${String(err)}` }));
            }
          }
        })();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // 第三個參數 '' = 載入所有變數（不限 VITE_ 前綴），供 api/chat.ts 讀 process.env。
  // 注意：這些不會被注入前端 bundle，只留在 Node 這一側。
  const env = loadEnv(mode, process.cwd(), '');
  if (!process.env.GEMINI_API_KEY && env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return { plugins: [react(), apiDevPlugin()] };
});
