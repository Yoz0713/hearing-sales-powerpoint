import type { ComponentType } from 'react';

/** 章節識別字（即顯示名稱）。 */
export type ChapterId = string;

/**
 * 懸浮預覽卡片的視覺骨架原型。**刻意**與真實 Layout 元件
 * （CoverLayout / TwoColumnLayout …）解耦——這只是預覽卡的粗略形狀暗示。
 */
export type PreviewShape = 'cover' | 'split' | 'content';

/** 中央 manifest 的一筆 slide 定義（決策 5：唯一來源）。 */
export interface SlideEntry {
  /** 穩定唯一鍵，作為 React key 與 localStorage 對照。 */
  id: string;
  /** 所屬章節，ProgressBar / ChapterNavigation 依此分組。 */
  chapter: ChapterId;
  /** 該頁的 React 元件（不接收 props，索引由 SlideIndexContext 提供）。 */
  component: ComponentType;
  /** 懸浮預覽卡的標題；省略時回退為 chapter（見 previewTitleAt）。 */
  title?: string;
  /** 懸浮預覽卡的骨架形狀；省略時回退為 'content'（見 previewShapeAt）。 */
  previewShape?: PreviewShape;
}

/** 由 manifest 衍生出的章節區段。 */
export interface Chapter {
  id: ChapterId;
  title: string;
  /** 此章節第一張 slide 的全域索引。 */
  startIndex: number;
  /** 此章節的 slide 數量。 */
  slideCount: number;
}

/** 每頁動畫控制器：供 R 鍵 revert 後重播（決策 3/4）。 */
export interface AnimationController {
  /** 還原至初始狀態後，重建並重播進場動畫。 */
  replay: () => void;
}

/** 每頁可選註冊的資料層重置（決策 4 第 2 層）。 */
export type ResetHandler = () => void;

/** Reveal 換頁事件監聽器，參數為水平索引 h。 */
export type SlideChangedListener = (index: number) => void;
