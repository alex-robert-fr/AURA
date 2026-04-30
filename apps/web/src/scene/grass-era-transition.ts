import type { Observer, Scene } from '@babylonjs/core';
import { type GrassPalette, lerpPalette } from './grass-palette';

export interface GrassPaletteTarget {
  apply: (palette: GrassPalette) => void;
}

export function animatePaletteTo(
  scene: Scene,
  current: GrassPalette,
  to: GrassPalette,
  durationMs: number,
  target: GrassPaletteTarget,
): { cancel: () => void; final: GrassPalette } {
  const from = { ...current };
  const start = performance.now();
  let observer: Observer<Scene> | null = null;
  let cancelled = false;

  const cleanup = (): void => {
    if (observer) {
      scene.onBeforeRenderObservable.remove(observer);
      observer = null;
    }
  };

  observer = scene.onBeforeRenderObservable.add(() => {
    if (cancelled) {
      cleanup();
      return;
    }
    const t = (performance.now() - start) / durationMs;
    if (t >= 1) {
      target.apply(to);
      cleanup();
      return;
    }
    target.apply(lerpPalette(from, to, t));
  });

  return {
    cancel: () => {
      cancelled = true;
      cleanup();
    },
    final: to,
  };
}
