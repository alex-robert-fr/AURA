import { Matrix, Quaternion, type Scene, Vector3 } from '@babylonjs/core';
import { createGrassClump } from './grass-blade';
import { createGrassBladeMaterial } from './grass-blade-material';
import type { GrassPalette } from './grass-palette';

const FIELD_HALF = 20;
const GRID_STEP = 0.22;
const SCALE_MIN = 0.7;
const SCALE_MAX = 1.4;
const TILT_RANGE = 0.18;

const seededRandom = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

export interface GrassField {
  setPalette: (palette: GrassPalette) => void;
  dispose: () => void;
}

export function createGrassField(
  scene: Scene,
  palette: GrassPalette,
  lightDirection: Vector3,
): GrassField {
  const clump = createGrassClump(scene);
  const clumpMaterial = createGrassBladeMaterial(scene, palette, lightDirection);
  clump.material = clumpMaterial.material;

  const rand = seededRandom(0xb27c);
  const matrices: number[] = [];
  let count = 0;

  for (let x = -FIELD_HALF; x <= FIELD_HALF; x += GRID_STEP) {
    for (let z = -FIELD_HALF; z <= FIELD_HALF; z += GRID_STEP) {
      const jitterX = (rand() - 0.5) * GRID_STEP * 0.95;
      const jitterZ = (rand() - 0.5) * GRID_STEP * 0.95;
      const px = x + jitterX;
      const pz = z + jitterZ;

      const yaw = rand() * Math.PI * 2;
      const tiltX = (rand() - 0.5) * TILT_RANGE;
      const tiltZ = (rand() - 0.5) * TILT_RANGE;
      const scale = SCALE_MIN + rand() * (SCALE_MAX - SCALE_MIN);

      const rotation = Quaternion.RotationYawPitchRoll(yaw, tiltX, tiltZ);
      const matrix = Matrix.Compose(
        new Vector3(scale, scale, scale),
        rotation,
        new Vector3(px, 0, pz),
      );
      matrix.copyToArray(matrices, count * 16);
      count++;
    }
  }

  const buffer = new Float32Array(matrices);
  clump.thinInstanceSetBuffer('matrix', buffer, 16, true);

  return {
    setPalette: (p) => clumpMaterial.setPalette(p),
    dispose: () => {
      clump.thinInstanceCount = 0;
      clumpMaterial.dispose();
      clump.dispose();
    },
  };
}
