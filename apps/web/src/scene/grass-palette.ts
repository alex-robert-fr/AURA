import { Color3, Color4 } from '@babylonjs/core';

export interface GrassPalette {
  base: Color3;
  tip: Color3;
  ground: Color3;
  sky: Color4;
  sun: Color3;
}

export const defaultGrassPalette: GrassPalette = {
  base: new Color3(0.18, 0.32, 0.12),
  tip: new Color3(0.78, 0.92, 0.45),
  ground: new Color3(0.14, 0.26, 0.1),
  sky: new Color4(0.62, 0.78, 0.92, 1),
  sun: new Color3(1, 0.92, 0.78),
};
