import type { Chapter, PreviewShape, SlideEntry } from '../types/presentation';
import { CoverPage } from '../pages/CoverPage';
import { ImpressionChapterPage } from '../pages/ImpressionChapterPage';
import { ImpressionSpeedPage } from '../pages/ImpressionSpeedPage';
import { ImpressionRulePage } from '../pages/ImpressionRulePage';
import { ImpressionAppearancePage } from '../pages/ImpressionAppearancePage';
import { ImpressionTonePage } from '../pages/ImpressionTonePage';
import { ImpressionProvocationPage } from '../pages/ImpressionProvocationPage';
import { ImpressionRhythmPage } from '../pages/ImpressionRhythmPage';
import { ScenarioPage } from '../pages/ScenarioPage';
import { CounselingPerspectivePage } from '../pages/CounselingPerspectivePage';
import { CounselingMotivationPage } from '../pages/CounselingMotivationPage';
import { CounselingHiddenMotivePage } from '../pages/CounselingHiddenMotivePage';
import { CounselingHistoryPage } from '../pages/CounselingHistoryPage';
import { CounselingFlowPage } from '../pages/CounselingFlowPage';
import { CounselingOtoscopyPage } from '../pages/CounselingOtoscopyPage';
import { CounselingTympanogramPage } from '../pages/CounselingTympanogramPage';
import { CounselingAudiogramPage } from '../pages/CounselingAudiogramPage';
import { CounselingMclPage } from '../pages/CounselingMclPage';
import { CounselingWrsPage } from '../pages/CounselingWrsPage';
import { CounselingWrsBenefitPage } from '../pages/CounselingWrsBenefitPage';

export const slides: SlideEntry[] = [
  { id: 'cover', chapter: '封面', title: '簡報封面', previewShape: 'cover', component: CoverPage },
  { id: 'impression-chapter', chapter: '第一印象', title: '第一印象', previewShape: 'cover', component: ImpressionChapterPage },
  {
    id: 'impression-speed',
    chapter: '第一印象',
    title: '建立速度與首因效應',
    previewShape: 'content',
    component: ImpressionSpeedPage,
  },
  {
    id: 'impression-rule',
    chapter: '第一印象',
    title: '7-38-55 法則',
    previewShape: 'content',
    component: ImpressionRulePage,
  },
  {
    id: 'impression-appearance',
    chapter: '第一印象',
    title: '外表的四個要點',
    previewShape: 'content',
    component: ImpressionAppearancePage,
  },
  {
    id: 'impression-tone',
    chapter: '第一印象',
    title: '聲音與語調的四個要點',
    previewShape: 'content',
    component: ImpressionTonePage,
  },
  {
    id: 'impression-provocation',
    chapter: '第一印象',
    title: '選配過程就應該全程保持第一印象那般的和善親切嗎？',
    previewShape: 'cover',
    component: ImpressionProvocationPage,
  },
  {
    id: 'impression-rhythm',
    chapter: '第一印象',
    title: '一場選配，情緒該怎麼分配？',
    previewShape: 'content',
    component: ImpressionRhythmPage,
  },
  {
    id: 'counseling-motivation',
    chapter: '衛教與諮商',
    title: '探尋來訪的真實動機',
    previewShape: 'split',
    component: CounselingMotivationPage,
  },
  {
    id: 'counseling-hidden-motive',
    chapter: '衛教與諮商',
    title: '客戶說出口的，只是冰山一角',
    previewShape: 'content',
    component: CounselingHiddenMotivePage,
  },
  {
    id: 'counseling-history',
    chapter: '衛教與諮商',
    title: '病史詢問，看見耳朵之外的全貌',
    previewShape: 'content',
    component: CounselingHistoryPage,
  },
  { id: 'scenario', chapter: '門市實戰', title: '選擇題(顧問式)', previewShape: 'split', component: ScenarioPage },
  { id: 'counseling-perspective', chapter: '衛教與諮商', title: '理解，不等於接受', previewShape: 'split', component: CounselingPerspectivePage },
  { id: 'counseling-flow', chapter: '衛教與諮商', title: '釐清問題，是諮商的開始', previewShape: 'content', component: CounselingFlowPage },
  { id: 'counseling-otoscopy', chapter: '衛教與諮商', title: '耳鏡：先排除外耳因素', previewShape: 'split', component: CounselingOtoscopyPage },
  { id: 'counseling-tympanogram', chapter: '衛教與諮商', title: '鼓室圖：再確認中耳狀況', previewShape: 'split', component: CounselingTympanogramPage },
  { id: 'counseling-audiogram', chapter: '衛教與諮商', title: '聽力圖，要翻成生活語言', previewShape: 'split', component: CounselingAudiogramPage },
  { id: 'counseling-mcl', chapter: '衛教與諮商', title: 'MCL：找到剛剛好的音量', previewShape: 'split', component: CounselingMclPage },
  { id: 'counseling-wrs', chapter: '衛教與諮商', title: 'WRS：聽得到，還要聽得懂', previewShape: 'split', component: CounselingWrsPage },
  { id: 'counseling-wrs-benefit', chapter: '衛教與諮商', title: 'WRS 分數，決定期待怎麼說', previewShape: 'content', component: CounselingWrsBenefitPage },
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
