import { useCallback, useEffect, useRef, useState } from 'react';

/** 看過一次就不再閃提示（沿用 usePositionPersistence 的鍵名慣例）。 */
const SEEN_KEY = 'presentation:shortcutGuideSeen';

interface Cap {
  /** 鍵帽上的字面。 */
  label: string;
  /** 對應的 KeyboardEvent.key（小寫）；面板開著時實體按下會同步壓下這顆鍵帽。 */
  match?: string;
  /** 較寬的鍵帽（Esc 這類多字母鍵）。 */
  wide?: boolean;
}

interface Row {
  caps: Cap[];
  title: string;
  hint: string;
}

interface Group {
  rows: Row[];
}

/** 與 reveal.config.ts / useReveal.ts / useGlobalHotkeys.ts 的實際綁定一一對應。 */
const GROUPS: Group[] = [
  {
    rows: [
      {
        caps: [
          { label: '←', match: 'arrowleft' },
          { label: '→', match: 'arrowright' },
        ],
        title: '換頁',
        hint: '跳到上一頁或下一頁',
      },
      {
        caps: [
          { label: '↑', match: 'arrowup' },
          { label: '↓', match: 'arrowdown' },
        ],
        title: '逐步動畫',
        hint: '留在同頁，依序顯示內容',
      },
    ],
  },
  {
    rows: [
      {
        caps: [{ label: 'F', match: 'f' }],
        title: '全螢幕',
        hint: '放大到整個螢幕',
      },
      {
        caps: [{ label: 'Esc', match: 'escape', wide: true }],
        title: '取消全螢幕',
        hint: '回到視窗模式',
      },
    ],
  },
  {
    rows: [
      {
        caps: [{ label: 'R', match: 'r' }],
        title: '重置本頁',
        hint: '回到頁面初始狀態',
      },
      {
        caps: [{ label: 'B', match: 'b' }],
        title: '黑屏',
        hint: '畫面變黑，再按一次還原',
      },
    ],
  },
];

interface KeycapProps {
  cap: Cap;
  isPressed: boolean;
}

function Keycap({ cap, isPressed }: KeycapProps) {
  const classes = ['keycap'];
  if (cap.wide) classes.push('keycap--wide');
  if (isPressed) classes.push('is-pressed');
  return <span className={classes.join(' ')}>{cap.label}</span>;
}

/**
 * 右上角快捷鍵指南（chrome 層，固定在視窗座標，不隨 Reveal 的 1920×1080 縮放）。
 * 觸發鈕本身就是一顆鍵帽；面板開著時按實體鍵，對應鍵帽會跟著壓下，
 * 第一次開簡報的人可以邊按邊確認。'?' / '/' 亦可開關（Reveal 內建的 help
 * 覆蓋層已在 reveal.config.ts 停用，避免兩套說明打架）。
 */
export function ShortcutGuide() {
  // 第一次開這份簡報的人：面板直接展開，不用先找到右上角那顆鍵帽。
  const [hasSeen] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) !== null;
    } catch {
      return true; // 隱私模式：當作看過，不自動展開也不提示
    }
  });
  const [isOpen, setIsOpen] = useState(!hasSeen);
  const [pressed, setPressed] = useState<readonly string[]>([]);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* 隱私模式忽略 */
    }
  }, []);

  // 自動展開也算看過：只在第一次進來時發生，之後靠按鈕或 '?' 叫出。
  useEffect(() => {
    if (!hasSeen) markSeen();
  }, [hasSeen, markSeen]);

  const open = useCallback(() => {
    setIsOpen(true);
    markSeen();
  }, [markSeen]);

  const close = useCallback((restoreFocus: boolean) => {
    setIsOpen(false);
    setPressed([]);
    if (restoreFocus) triggerRef.current?.focus();
  }, []);

  // '?'（或 '/'）開關面板；Esc 關閉。
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?' || e.key === '/') {
        e.preventDefault();
        markSeen();
        setIsOpen((wasOpen) => !wasOpen);
      } else if (e.key === 'Escape') {
        // 沒開面板時不攔截：讓瀏覽器照常退出全螢幕。
        setIsOpen((wasOpen) => {
          if (wasOpen) triggerRef.current?.focus();
          return false;
        });
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [markSeen]);

  // 面板開著時同步實體按鍵的壓下狀態。
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressed((prev) => (prev.includes(key) ? prev : [...prev, key]));
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setPressed((prev) => prev.filter((k) => k !== key));
    };
    // 切到全螢幕/其他視窗時可能收不到 keyup，失焦就整組清掉。
    const onBlur = () => setPressed([]);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) panelRef.current?.focus();
  }, [isOpen]);

  const triggerClasses = ['shortcut-guide__trigger', 'keycap'];
  if (isOpen) triggerClasses.push('is-open');

  return (
    <div className="shortcut-guide">
      <button
        type="button"
        ref={triggerRef}
        className={triggerClasses.join(' ')}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="shortcut-guide-panel"
        aria-label="鍵盤快捷鍵說明"
        onClick={() => (isOpen ? close(true) : open())}
      >
        ?
      </button>

      {isOpen && (
        <>
          <div
            className="shortcut-guide__scrim"
            aria-hidden="true"
            onMouseDown={() => close(false)}
          />
          <div
            id="shortcut-guide-panel"
            className="shortcut-guide__panel"
            role="dialog"
            aria-labelledby="shortcut-guide-title"
            ref={panelRef}
            tabIndex={-1}
          >
            <p className="shortcut-guide__eyebrow">SHORTCUTS</p>
            <h2 className="shortcut-guide__title" id="shortcut-guide-title">
              按鍵操作指令
            </h2>


            {GROUPS.map((group, groupIndex) => (
              <section className="shortcut-guide__group" key={groupIndex}>
                {group.rows.map((row) => (
                  <div className="shortcut-guide__row" key={row.title}>
                    <div className="shortcut-guide__caps">
                      {row.caps.map((cap) => (
                        <Keycap
                          key={cap.label}
                          cap={cap}
                          isPressed={cap.match !== undefined && pressed.includes(cap.match)}
                        />
                      ))}
                    </div>
                    <div className="shortcut-guide__copy">
                      <span className="shortcut-guide__name">{row.title}</span>
                      <span className="shortcut-guide__hint">{row.hint}</span>
                    </div>
                  </div>
                ))}
              </section>
            ))}

            <div className="shortcut-guide__footer">
              <p className="shortcut-guide__footer-hint">
                隨時按 <span className="keycap keycap--inline">?</span> 叫回這張表
              </p>
              <button
                type="button"
                className="shortcut-guide__dismiss"
                onClick={() => close(true)}
              >
                開始簡報
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
