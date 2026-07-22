import type { Chapter, PreviewShape, SlideEntry } from '../types/presentation';
import { CoverPage } from '../pages/CoverPage';
import { CoursePositioningPage } from '../pages/CoursePositioningPage';
import { CourseObjectivesPage } from '../pages/CourseObjectivesPage';
import { WarmupExperiencePage } from '../pages/WarmupExperiencePage';
import { SalesBehaviorContrastPage } from '../pages/SalesBehaviorContrastPage';
import { SalesStyleReflectionPage } from '../pages/SalesStyleReflectionPage';
import { SalesStyleOverviewPage } from '../pages/SalesStyleOverviewPage';
import { ResistanceReasonsPage } from '../pages/ResistanceReasonsPage';
import { ResistanceCasePage } from '../pages/ResistanceCasePage';
import { ConsultativeProcessOverviewPage } from '../pages/ConsultativeProcessOverviewPage';
import { ReceptionTrustPage } from '../pages/ReceptionTrustPage';
import { LifestyleContextPage } from '../pages/LifestyleContextPage';
import { EconomicCapacitySignalsPage } from '../pages/EconomicCapacitySignalsPage';
import { EconomicAssessmentTimingPage } from '../pages/EconomicAssessmentTimingPage';
import { ReportSequencePage } from '../pages/ReportSequencePage';
import { ExaminationTrustPage, ExaminationAwarenessPage } from '../pages/ExaminationSignalsPage';
import { ExaminationCommunicationPage } from '../pages/ExaminationCommunicationPage';
import {
  CustomerUnderstandingChapterPage,
  SelfAwarenessChapterPage,
} from '../pages/LearningChapterPage';
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
import { outlineDraftSlides as draft } from './outline-draft.slides';

export const slides: SlideEntry[] = [
  { id: 'cover', chapter: '課程導覽', title: '銷售經驗分享', previewShape: 'cover', component: CoverPage },
  {
    id: 'course-objectives',
    chapter: '課程導覽',
    title: '今天要帶走的六件事',
    previewShape: 'content',
    component: CourseObjectivesPage,
  },
  {
    id: 'self-awareness-chapter',
    chapter: '開場與風格',
    title: '認識自己',
    previewShape: 'cover',
    component: SelfAwarenessChapterPage,
  },
  {
    id: 'course-positioning',
    chapter: '開場與風格',
    title: '從介紹產品，到協助客戶做決定',
    previewShape: 'split',
    component: CoursePositioningPage,
  },
  {
    id: 'warmup-experience',
    chapter: '開場與風格',
    title: '回想一筆舒服，也回想一筆不舒服的購買',
    previewShape: 'split',
    component: WarmupExperiencePage,
  },
  {
    id: 'sales-behavior-contrast',
    chapter: '開場與風格',
    title: '客戶排斥的不是購買，是被推銷',
    previewShape: 'split',
    component: SalesBehaviorContrastPage,
  },
  {
    id: 'sales-style-overview',
    chapter: '開場與風格',
    title: '你習慣用哪一種方式幫客戶？',
    previewShape: 'content',
    component: SalesStyleOverviewPage,
  },
  {
    id: 'sales-style-reflection',
    chapter: '開場與風格',
    title: '找到你的慣性，也找到盲點',
    previewShape: 'content',
    component: SalesStyleReflectionPage,
  },
  {
    id: 'customer-understanding-chapter',
    chapter: '改變動機',
    title: '理解客戶',
    previewShape: 'cover',
    component: CustomerUnderstandingChapterPage,
  },
  {
    id: 'resistance-reasons',
    chapter: '改變動機',
    title: '客戶為什麼不願意現在處理？',
    previewShape: 'content',
    component: ResistanceReasonsPage,
  },
  {
    id: 'counseling-hidden-motive',
    chapter: '改變動機',
    title: '客戶說出口的，只是冰山一角',
    previewShape: 'content',
    component: CounselingHiddenMotivePage,
  },
  {
    id: 'resistance-case',
    chapter: '改變動機',
    title: '王先生不是不需要，而是還沒準備好',
    previewShape: 'split',
    component: ResistanceCasePage,
  },
  draft.resistanceGuidance,
  draft.breakPage,
  {
    id: 'consultative-process-overview',
    chapter: '選配流程',
    title: '十個步驟，其實只有三個決策階段',
    previewShape: 'content',
    component: ConsultativeProcessOverviewPage,
  },
  {
    id: 'impression-chapter',
    chapter: '選配流程',
    title: '第一印象',
    previewShape: 'cover',
    component: ImpressionChapterPage,
  },
  {
    id: 'reception-trust',
    chapter: '選配流程',
    title: '第一印象的目標，是讓客戶敢說真話',
    previewShape: 'content',
    component: ReceptionTrustPage,
  },
  {
    id: 'impression-speed',
    chapter: '選配流程',
    title: '建立速度與首因效應',
    previewShape: 'content',
    component: ImpressionSpeedPage,
  },
  {
    id: 'impression-rule',
    chapter: '選配流程',
    title: '7-38-55 法則',
    previewShape: 'content',
    component: ImpressionRulePage,
  },
  {
    id: 'impression-appearance',
    chapter: '選配流程',
    title: '外表的四個要點',
    previewShape: 'content',
    component: ImpressionAppearancePage,
  },
  {
    id: 'impression-tone',
    chapter: '選配流程',
    title: '聲音與語調的四個要點',
    previewShape: 'content',
    component: ImpressionTonePage,
  },
  {
    id: 'impression-provocation',
    chapter: '選配流程',
    title: '選配過程就應該全程保持第一印象那般的和善親切嗎？',
    previewShape: 'cover',
    component: ImpressionProvocationPage,
  },
  {
    id: 'impression-rhythm',
    chapter: '選配流程',
    title: '一場選配，情緒該怎麼分配？',
    previewShape: 'content',
    component: ImpressionRhythmPage,
  },
  {
    id: 'counseling-history',
    chapter: '選配流程',
    title: '病史詢問，看見耳朵之外的全貌',
    previewShape: 'content',
    component: CounselingHistoryPage,
  },
  {
    id: 'counseling-motivation',
    chapter: '選配流程',
    title: '探尋來訪的真實動機',
    previewShape: 'split',
    component: CounselingMotivationPage,
  },
  {
    id: 'lifestyle-context',
    chapter: '選配流程',
    title: '病史之外，還要看見客戶的生活',
    previewShape: 'content',
    component: LifestyleContextPage,
  },
  {
    id: 'economic-capacity-signals',
    chapter: '選配流程',
    title: '客戶的生活裡，藏著經濟能力的線索',
    previewShape: 'content',
    component: EconomicCapacitySignalsPage,
  },
  {
    id: 'economic-assessment-timing',
    chapter: '選配流程',
    title: '經濟能力，要在試聽前完成判斷',
    previewShape: 'content',
    component: EconomicAssessmentTimingPage,
  },
  {
    id: 'examination-communication',
    chapter: '選配流程',
    title: '檢查的過程，也在建立信任與病識感',
    previewShape: 'cover',
    component: ExaminationCommunicationPage,
  },
  {
    id: 'examination-trust-signals',
    chapter: '選配流程',
    title: '如何在檢查過程中增加信任感？',
    previewShape: 'content',
    component: ExaminationTrustPage,
  },
  {
    id: 'examination-awareness-signals',
    chapter: '選配流程',
    title: '如何在檢查過程中增加病識感？',
    previewShape: 'content',
    component: ExaminationAwarenessPage,
  },
  {
    id: 'report-sequence',
    chapter: '選配流程',
    title: '報告不是念數字，而是建立共同理解',
    previewShape: 'content',
    component: ReportSequencePage,
  },
  {
    id: 'counseling-perspective',
    chapter: '選配流程',
    title: '理解，不等於接受',
    previewShape: 'split',
    component: CounselingPerspectivePage,
  },
  draft.interventionScale,
  draft.necessityConversation,
  draft.planSelection,
  draft.demoValidation,
  draft.decisionMethods,
  draft.objectionSteps,
  {
    id: 'scenario',
    chapter: '異議實戰',
    title: '最高階和入門款差在哪裡？',
    previewShape: 'split',
    component: ScenarioPage,
  },
  draft.objectionPrice,
  draft.objectionWaitDependency,
  draft.objectionFamilyConsider,
  draft.roleplayBrief,
  draft.roleplayObserver,
  draft.summaryUnderstand,
  draft.summaryDecision,
  draft.actionCommitment,
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
