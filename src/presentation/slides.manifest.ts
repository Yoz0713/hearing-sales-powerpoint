import type { Chapter, PreviewShape, SlideEntry } from '../types/presentation';
import { CoverPage } from '../pages/CoverPage';
import { OutlinePage } from '../pages/OutlinePage';
import { StressTestPage } from '../pages/StressTestPage';

/**
 * 決策 5：簡報的唯一來源。Phase 2 加頁 = 新增一筆 { id, chapter, component }，
 * 頁面元件一律從 src/pages/ 匯入（一頁一檔慣例）。
 * title / previewShape 為選填的懸浮預覽後設資料；省略時自動回退（見下方工具）。
 */
export const slides: SlideEntry[] = [
  { id: 'cover', chapter: '封面', title: '簡報封面', previewShape: 'cover', component: CoverPage },
  { id: 'outline', chapter: '大綱', title: '簡報大綱', previewShape: 'split', component: OutlinePage },
  {
    id: 'stress-test',
    chapter: '框架壓力測試',
    title: '動畫壓力測試',
    previewShape: 'content',
    component: StressTestPage,
  },
];

/** 懸浮預覽卡標題：未指定 title 時回退為章節名。 */
export function previewTitleAt(entry: SlideEntry): string {
  return entry.title ?? entry.chapter;
}

/** 懸浮預覽卡骨架：未指定 previewShape 時回退為 'content'。 */
export function previewShapeAt(entry: SlideEntry): PreviewShape {
  return entry.previewShape ?? 'content';
}

/** 由 manifest 依相鄰相同 chapter 聚合出章節區段。 */
export function deriveChapters(entries: SlideEntry[]): Chapter[] {
  const chapters: Chapter[] = [];
  entries.forEach((entry, index) => {
    const last = chapters[chapters.length - 1];
    if (last && last.title === entry.chapter) {
      last.slideCount += 1;
    } else {
      chapters.push({ id: entry.chapter, title: entry.chapter, startIndex: index, slideCount: 1 });
    }
  });
  return chapters;
}

/** 取得某索引所屬的章節標題。 */
export function chapterTitleAt(chapters: Chapter[], index: number): string {
  const found = chapters.find(
    (c) => index >= c.startIndex && index < c.startIndex + c.slideCount,
  );
  return found?.title ?? '';
}
