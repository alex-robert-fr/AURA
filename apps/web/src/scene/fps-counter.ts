import type { Engine, Scene } from '@babylonjs/core';

const REFRESH_MS = 500;

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
  ].join(';');
  el.textContent = '-- fps';
  document.body.appendChild(el);

  let last = 0;
  const observer = scene.onAfterRenderObservable.add(() => {
    const now = performance.now();
    if (now - last < REFRESH_MS) return;
    last = now;
    el.textContent = `${engine.getFps().toFixed(0)} fps`;
  });

  return () => {
    scene.onAfterRenderObservable.remove(observer);
    el.remove();
  };
}
