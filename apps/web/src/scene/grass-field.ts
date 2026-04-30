import { Matrix, Quaternion, type Scene, Vector3 } from '@babylonjs/core';
import { createGrassBlade } from './grass-blade';
import { createGrassBladeMaterial } from './grass-blade-material';
import type { GrassPalette } from './grass-palette';

const FIELD_RADIUS = 30;
const GRID_STEP = 0.3;
const FADE_INNER = 22;
const FADE_OUTER = 30;
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
  const blade = createGrassBlade(scene);
  const bladeMaterial = createGrassBladeMaterial(scene, palette, lightDirection);
  blade.material = bladeMaterial.material;

  const rand = seededRandom(0xa17a);
  const matrices: number[] = [];
  let count = 0;

  const half = FIELD_RADIUS;
  for (let x = -half; x <= half; x += GRID_STEP) {
    for (let z = -half; z <= half; z += GRID_STEP) {
      const dist = Math.sqrt(x * x + z * z);
      if (dist > FADE_OUTER) continue;
      if (dist > FADE_INNER) {
        const keep = 1 - (dist - FADE_INNER) / (FADE_OUTER - FADE_INNER);
        if (rand() > keep) continue;
      }

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
  blade.thinInstanceSetBuffer('matrix', buffer, 16, true);

  return {
    setPalette: (p) => bladeMaterial.setPalette(p),
    dispose: () => {
      blade.thinInstanceCount = 0;
      bladeMaterial.dispose();
      blade.dispose();
    },
  };
}
