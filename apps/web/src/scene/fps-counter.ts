import type { Engine, Scene } from '@babylonjs/core';

const REFRESH_MS = 500;
const SMOOTH_ALPHA = 0.06;

export function attachFpsCounter(scene: Scene, engine: Engine): () => void {
  const el = document.createElement('div');
  el.style.cssText = [
    'position:fixed',
    'top:8px',
    'right:10px',
    'font-family:ui-monospace,SFMono-Regular,Menlo,monospace',
    'font-size:11px',
    'color:#fff',
    'background:rgba(0,0,0,0.5)',
    'padding:3px 7px',
    'border-radius:4px',
    'pointer-events:none',
    'z-index:1000',
    'white-space:pre',
  ].join(';');
  el.textContent = '-- fps · -- ms';
  document.body.appendChild(el);

  let smoothedMs = 16;
  let last = 0;

  const observer = scene.onAfterRenderObservable.add(() => {
    smoothedMs = smoothedMs * (1 - SMOOTH_ALPHA) + engine.getDeltaTime() * SMOOTH_ALPHA;
    const now = performance.now();
    if (now - last < REFRESH_MS) return;
    last = now;
    el.textContent = `${engine.getFps().toFixed(0)} fps · ${smoothedMs.toFixed(1)} ms`;
  });

  return () => {
    scene.onAfterRenderObservable.remove(observer);
    el.remove();
  };
}
