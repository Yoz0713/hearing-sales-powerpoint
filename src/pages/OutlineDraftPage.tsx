import { useCallback, type ComponentType } from 'react';
import { gsap } from 'gsap';
import { SlideShell } from '../components/layouts/SlideShell';
import { motion } from '../tokens/motion';
import type { PreviewShape } from '../types/presentation';

export interface OutlineDraftSpec {
  id: string;
  chapter: string;
  outlinePath: string;
  title: string;
  purpose: string;
  onScreenContent: string[];
  interaction: string;
  formalDirection: string;
  previewShape?: PreviewShape;
}

interface OutlineDraftPageProps {
  spec: OutlineDraftSpec;
}

function OutlineDraftPage({ spec }: OutlineDraftPageProps) {
  const animate = useCallback((scope: HTMLElement) => {
    gsap.timeline({ defaults: { ease: motion.ease.standard } })
      .from(scope.querySelector('.js-outline-draft-rail'), {
        x: -54,
        opacity: 0,
        duration: motion.duration.slow,
      })
      .from(scope.querySelector('.js-outline-draft-path'), {
        y: 18,
        opacity: 0,
        duration: motion.duration.fast,
      }, '-=0.35')
      .from(scope.querySelector('.js-outline-draft-title'), {
        y: 34,
        opacity: 0,
        duration: motion.duration.base,
      }, '-=0.15')
      .from(scope.querySelector('.js-outline-draft-rule'), {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: motion.duration.slow,
        ease: motion.ease.emphasis,
      }, '-=0.25');
  }, []);

  return (
    <SlideShell fullBleed className="outline-draft-slide" animate={animate}>
      <div className="outline-draft">
        <aside className="outline-draft__rail js-outline-draft-rail">
          <span className="outline-draft__status">內容骨架</span>
          <strong className="outline-draft__code">{spec.id.toUpperCase()}</strong>
          <p className="outline-draft__chapter">{spec.chapter}</p>
          <p className="outline-draft__rail-note">正式視覺待實作</p>
        </aside>

        <main className="outline-draft__main">
          <header className="outline-draft__heading">
            <p className="outline-draft__path js-outline-draft-path">{spec.outlinePath}</p>
            <h1 className="outline-draft__title js-outline-draft-title">{spec.title}</h1>
            <span className="outline-draft__rule js-outline-draft-rule" aria-hidden="true" />
          </header>

          <div className="outline-draft__matrix">
            <article className="outline-draft__cell outline-draft__cell--purpose">
              <p className="outline-draft__label">頁面目的</p>
              <p className="outline-draft__purpose">{spec.purpose}</p>
            </article>

            <article className="outline-draft__cell fragment" data-fragment-index="0">
              <p className="outline-draft__label">正式上屏內容</p>
              <ul className="outline-draft__content-list">
                {spec.onScreenContent.map((content) => <li key={content}>{content}</li>)}
              </ul>
            </article>

            <article className="outline-draft__cell fragment" data-fragment-index="1">
              <p className="outline-draft__label">互動與講解節奏</p>
              <p className="outline-draft__body">{spec.interaction}</p>
            </article>

            <article className="outline-draft__cell outline-draft__cell--direction fragment" data-fragment-index="2">
              <p className="outline-draft__label">正式版方向</p>
              <p className="outline-draft__body">{spec.formalDirection}</p>
            </article>
          </div>
        </main>
      </div>
    </SlideShell>
  );
}

/** 將內容規格包成 manifest 可直接使用的無參數 page component。 */
export function createOutlineDraftPage(spec: OutlineDraftSpec): ComponentType {
  function GeneratedOutlineDraftPage() {
    return <OutlineDraftPage spec={spec} />;
  }

  GeneratedOutlineDraftPage.displayName = `OutlineDraftPage(${spec.id})`;
  return GeneratedOutlineDraftPage;
}
