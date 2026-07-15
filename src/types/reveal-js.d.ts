// reveal.js v5 不附官方 TS 型別；此處宣告我們實際用到的最小 API，確保編譯穩定。
declare module 'reveal.js' {
  export interface RevealIndices {
    h: number;
    v: number;
    f?: number;
  }

  export interface RevealOptions {
    [key: string]: unknown;
  }

  export default class Reveal {
    constructor(element: HTMLElement, options?: RevealOptions);
    initialize(options?: RevealOptions): Promise<void>;
    destroy(): void;
    on(type: string, listener: (event: unknown) => void): void;
    off(type: string, listener: (event: unknown) => void): void;
    slide(h: number, v?: number, f?: number): void;
    left(options?: { skipFragments?: boolean }): void;
    right(options?: { skipFragments?: boolean }): void;
    prevFragment(): boolean;
    nextFragment(): boolean;
    navigateFragment(index: number | null, offset?: number): boolean;
    getIndices(): RevealIndices;
    getTotalSlides(): number;
    isReady(): boolean;
  }
}

declare module 'reveal.js/dist/reveal.css';
