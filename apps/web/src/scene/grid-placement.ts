import {
  Color3,
  type Mesh,
  MeshBuilder,
  type Observer,
  PointerEventTypes,
  type PointerInfo,
  type Scene,
  StandardMaterial,
} from '@babylonjs/core';
import {
  CELL_SIZE,
  type GridCell,
  type GridState,
  cellToWorld,
  isCellInBounds,
  worldToCell,
} from './grid';
import { PLACED_CUBE_COLOR } from './grid-colors';

export interface GridPlacement {
  dispose: () => void;
}

export function createGridPlacement(
  scene: Scene,
  ground: Mesh,
  gridState: GridState,
): GridPlacement {
  const sharedMaterial = new StandardMaterial('placed-cube-material', scene);
  sharedMaterial.diffuseColor = PLACED_CUBE_COLOR;
  sharedMaterial.specularColor = new Color3(0.05, 0.05, 0.05);

  const placedMeshes: Mesh[] = [];
  const cellBuffer: GridCell = { x: 0, z: 0 };

  const handlePointer = (info: PointerInfo) => {
    if (info.type !== PointerEventTypes.POINTERTAP) return;
    if (info.event.button !== 0) return;

    const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground, true);
    if (!pick?.hit || !pick.pickedPoint) return;

    worldToCell(pick.pickedPoint, cellBuffer);
    if (!isCellInBounds(cellBuffer)) return;
    if (gridState.isOccupied(cellBuffer)) return;

    const cell: GridCell = { x: cellBuffer.x, z: cellBuffer.z };
    const cube = MeshBuilder.CreateBox(
      `placed-cube-${cell.x}-${cell.z}`,
      { size: CELL_SIZE },
      scene,
    );
    const position = cellToWorld(cell);
    cube.position.set(position.x, CELL_SIZE / 2, position.z);
    cube.material = sharedMaterial;

    gridState.markOccupied(cell);
    placedMeshes.push(cube);
  };

  const observer: Observer<PointerInfo> | null = scene.onPointerObservable.add(handlePointer);

  return {
    dispose: () => {
      if (observer) scene.onPointerObservable.remove(observer);
      for (const mesh of placedMeshes) mesh.dispose();
      placedMeshes.length = 0;
      sharedMaterial.dispose();
    },
  };
}
