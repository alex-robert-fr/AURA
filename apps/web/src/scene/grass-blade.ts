import { Mesh, type Scene, VertexData } from '@babylonjs/core';

const SEGMENTS = 2;
const BASE_WIDTH = 0.075;
const TIP_WIDTH = 0.01;
const HEIGHT = 0.65;
const CURVE = 0.13;

const BLADES_PER_CLUMP = 5;
const CLUMP_SPREAD = 0.07;
const CLUMP_SCALE_MIN = 0.7;
const CLUMP_SCALE_MAX = 1.25;
const CLUMP_TILT = 0.18;

const seededRandom = (seed: number): (() => number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
};

function pushBlade(
  positions: number[],
  indices: number[],
  normals: number[],
  uvs: number[],
  cx: number,
  cz: number,
  yaw: number,
  scale: number,
  tiltX: number,
  tiltZ: number,
): void {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const startIndex = positions.length / 3;

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const y = t * HEIGHT * scale;
    const w = (BASE_WIDTH + (TIP_WIDTH - BASE_WIDTH) * t) * scale;
    const xOffset = t * t * CURVE * scale;
    const xTilt = tiltX * y;
    const zTilt = tiltZ * y;

    const pushVertex = (lx: number, lz: number): void => {
      const wx = cx + (lx * cosY - lz * sinY) + xTilt;
      const wz = cz + (lx * sinY + lz * cosY) + zTilt;
      positions.push(wx, y, wz);
    };

    pushVertex(-w / 2 + xOffset, 0);
    pushVertex(w / 2 + xOffset, 0);
    pushVertex(xOffset, -w / 2);
    pushVertex(xOffset, w / 2);

    uvs.push(0, t, 1, t, 0, t, 1, t);

    const nAx = -sinY;
    const nAz = cosY;
    const nBx = cosY;
    const nBz = sinY;
    normals.push(nAx, 0, nAz, nAx, 0, nAz, nBx, 0, nBz, nBx, 0, nBz);
  }

  for (let i = 0; i < SEGMENTS; i++) {
    const a = startIndex + i * 4;
    const b = startIndex + (i + 1) * 4;
    indices.push(a, a + 1, b + 1, a, b + 1, b);
    indices.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2);
  }
}

export function createGrassClump(scene: Scene): Mesh {
  const mesh = new Mesh('grass-clump', scene);

  const positions: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  const rand = seededRandom(0xa17a);

  for (let i = 0; i < BLADES_PER_CLUMP; i++) {
    const angle = (i / BLADES_PER_CLUMP) * Math.PI * 2 + rand() * 0.6;
    const radius = rand() * CLUMP_SPREAD;
    const cx = Math.cos(angle) * radius;
    const cz = Math.sin(angle) * radius;
    const yaw = rand() * Math.PI * 2;
    const scale = CLUMP_SCALE_MIN + rand() * (CLUMP_SCALE_MAX - CLUMP_SCALE_MIN);
    const tiltX = (rand() - 0.5) * CLUMP_TILT;
    const tiltZ = (rand() - 0.5) * CLUMP_TILT;
    pushBlade(positions, indices, normals, uvs, cx, cz, yaw, scale, tiltX, tiltZ);
  }

  const data = new VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.uvs = uvs;
  data.applyToMesh(mesh);

  mesh.alwaysSelectAsActiveMesh = true;
  return mesh;
}
