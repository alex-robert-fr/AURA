import { Matrix, Quaternion, type Scene, Vector3 } from '@babylonjs/core';
import { createGrassClump } from './grass-blade';
import { createGrassBladeMaterial } from './grass-blade-material';
import type { GrassPalette } from './grass-palette';
import { type GridCell, cellKey, worldToCell } from './grid';

const FIELD_HALF = 20;
const GRID_STEP = 0.18;
const SCALE_MIN = 0.7;
const SCALE_MAX = 1.4;
const TILT_RANGE = 0.18;
const MATRIX_STRIDE = 16;
const SCALE_OFFSETS = [0, 5, 10] as const;

const seededRandom = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

export interface GrassField {
  hideClumpsInCell: (cell: GridCell) => void;
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
  const cellIndex = new Map<string, number[]>();
  const positionCellBuffer: GridCell = { x: 0, z: 0 };
  let count = 0;

  const scaleVec = new Vector3();
  const positionVec = new Vector3();
  const rotationQuat = new Quaternion();
  const matrix = new Matrix();

  for (let x = -FIELD_HALF; x <= FIELD_HALF; x += GRID_STEP) {
    for (let z = -FIELD_HALF; z <= FIELD_HALF; z += GRID_STEP) {
      const jitterX = (rand() - 0.5) * GRID_STEP * 0.95;
      const jitterZ = (rand() - 0.5) * GRID_STEP * 0.95;
      const yaw = rand() * Math.PI * 2;
      const tiltX = (rand() - 0.5) * TILT_RANGE;
      const tiltZ = (rand() - 0.5) * TILT_RANGE;
      const scale = SCALE_MIN + rand() * (SCALE_MAX - SCALE_MIN);

      scaleVec.set(scale, scale, scale);
      positionVec.set(x + jitterX, 0, z + jitterZ);
      Quaternion.RotationYawPitchRollToRef(yaw, tiltX, tiltZ, rotationQuat);
      Matrix.ComposeToRef(scaleVec, rotationQuat, positionVec, matrix);
      matrix.copyToArray(matrices, count * MATRIX_STRIDE);

      worldToCell(positionVec, positionCellBuffer);
      const key = cellKey(positionCellBuffer);
      const existing = cellIndex.get(key);
      if (existing) existing.push(count);
      else cellIndex.set(key, [count]);

      count++;
    }
  }

  const buffer = new Float32Array(matrices);
  clump.thinInstanceSetBuffer('matrix', buffer, MATRIX_STRIDE, false);

  const hideClumpsInCell = (cell: GridCell) => {
    const indices = cellIndex.get(cellKey(cell));
    if (!indices) return;
    for (const index of indices) {
      const offset = index * MATRIX_STRIDE;
      for (const diagonal of SCALE_OFFSETS) buffer[offset + diagonal] = 0;
    }
    clump.thinInstanceBufferUpdated('matrix');
  };

  return {
    hideClumpsInCell,
    dispose: () => {
      clump.thinInstanceCount = 0;
      clumpMaterial.dispose();
      clump.dispose();
    },
  };
}
