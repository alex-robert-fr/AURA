import { Color3, Color4 } from '@babylonjs/core';
import type { Era } from '../store/city-store';

export interface GrassPalette {
  base: Color3;
  tip: Color3;
  ground: Color3;
  sky: Color4;
  sun: Color3;
}

export const eraGrassPalette: Record<Era, GrassPalette> = {
  genesis: {
    base: new Color3(0.18, 0.32, 0.12),
    tip: new Color3(0.78, 0.92, 0.45),
    ground: new Color3(0.14, 0.26, 0.1),
    sky: new Color4(0.62, 0.78, 0.92, 1),
    sun: new Color3(1, 0.92, 0.78),
  },
  industria: {
    base: new Color3(0.12, 0.28, 0.1),
    tip: new Color3(0.58, 0.82, 0.32),
    ground: new Color3(0.08, 0.2, 0.07),
    sky: new Color4(0.52, 0.7, 0.86, 1),
    sun: new Color3(1, 0.95, 0.88),
  },
  singularity: {
    base: new Color3(0.18, 0.26, 0.24),
    tip: new Color3(0.62, 0.74, 0.72),
    ground: new Color3(0.13, 0.2, 0.18),
    sky: new Color4(0.58, 0.66, 0.78, 1),
    sun: new Color3(0.88, 0.92, 1),
  },
};

const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

export function lerpPalette(from: GrassPalette, to: GrassPalette, t: number): GrassPalette {
  const k = t < 0 ? 0 : t > 1 ? 1 : t;
  return {
    base: Color3.Lerp(from.base, to.base, k),
    tip: Color3.Lerp(from.tip, to.tip, k),
    ground: Color3.Lerp(from.ground, to.ground, k),
    sky: new Color4(
      lerp(from.sky.r, to.sky.r, k),
      lerp(from.sky.g, to.sky.g, k),
      lerp(from.sky.b, to.sky.b, k),
      lerp(from.sky.a, to.sky.a, k),
    ),
    sun: Color3.Lerp(from.sun, to.sun, k),
  };
}
