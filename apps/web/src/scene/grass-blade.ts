import { Mesh, type Scene, VertexData } from '@babylonjs/core';

const SEGMENTS = 3;
const BASE_WIDTH = 0.06;
const TIP_WIDTH = 0.005;
const HEIGHT = 1;
const CURVE = 0.18;

export function createGrassBlade(scene: Scene): Mesh {
  const mesh = new Mesh('grass-blade', scene);

  const positions: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];

  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const y = t * HEIGHT;
    const w = BASE_WIDTH + (TIP_WIDTH - BASE_WIDTH) * t;
    const xOffset = t * t * CURVE;

    positions.push(-w / 2 + xOffset, y, 0);
    positions.push(w / 2 + xOffset, y, 0);
    positions.push(xOffset, y, -w / 2);
    positions.push(xOffset, y, w / 2);

    uvs.push(0, t, 1, t, 0, t, 1, t);
    normals.push(0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0);
  }

  for (let i = 0; i < SEGMENTS; i++) {
    const a = i * 4;
    const b = (i + 1) * 4;
    indices.push(a, a + 1, b + 1, a, b + 1, b);
    indices.push(a + 2, a + 3, b + 3, a + 2, b + 3, b + 2);
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
