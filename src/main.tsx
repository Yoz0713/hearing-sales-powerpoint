import { createRoot } from 'react-dom/client';
import 'reveal.js/dist/reveal.css';
import './styles/tokens.css';
import './styles/app.css';
import { App } from './App';

// 刻意不使用 <StrictMode>：其開發期雙重掛載會讓 Reveal 連續 init/destroy/init，
// 與這個三方整合的初始化時序打架。生產建置不受影響。
const container = document.getElementById('root');
if (!container) throw new Error('找不到 #root 容器');
createRoot(container).render(<App />);
