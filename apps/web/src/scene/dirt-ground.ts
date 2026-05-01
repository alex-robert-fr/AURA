import { Color3, type Mesh, MeshBuilder, type Scene, StandardMaterial } from '@babylonjs/core';
import type { GrassPalette } from './grass-palette';

export interface DirtGround {
  mesh: Mesh;
  dispose: () => void;
}

export function createDirtGround(scene: Scene, palette: GrassPalette): DirtGround {
  const mesh = MeshBuilder.CreateGround('dirt-ground', { width: 40, height: 40 }, scene);
  mesh.position.y = -0.001;

  const material = new StandardMaterial('dirt-material', scene);
  material.diffuseColor = palette.ground.clone();
  material.specularColor = new Color3(0, 0, 0);
  mesh.material = material;

  return {
    mesh,
    dispose: () => {
      material.dispose();
      mesh.dispose();
    },
  };
}
