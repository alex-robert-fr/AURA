import {
  Color3,
  type Mesh,
  MeshBuilder,
  type Observer,
  PointerEventTypes,
  type PointerInfo,
  type Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { CELL_SIZE, type GridCell, type GridState, cellToWorld } from './grid';
import { PLACED_CUBE_COLOR } from './grid-colors';
import { GRID_Y } from './grid-overlay';
import { createGridPicker } from './grid-pick';

export interface GridPlacementOptions {
  onPlace?: (cell: GridCell) => void;
}

export interface GridPlacement {
  dispose: () => void;
}

export function createGridPlacement(
  scene: Scene,
  gridState: GridState,
  options: GridPlacementOptions = {},
): GridPlacement {
  const sharedMaterial = new StandardMaterial('placed-cube-material', scene);
  sharedMaterial.diffuseColor.copyFrom(PLACED_CUBE_COLOR);
  sharedMaterial.specularColor = new Color3(0.05, 0.05, 0.05);

  const placedMeshes: Mesh[] = [];
  const picker = createGridPicker(scene, GRID_Y);
  const cellBuffer: GridCell = { x: 0, z: 0 };
  const positionBuffer = new Vector3();

  const handlePointer = (info: PointerInfo) => {
    if (info.type !== PointerEventTypes.POINTERTAP) return;
    if (info.event.button !== 0) return;
    if (!picker.pickCell(cellBuffer)) return;
    if (gridState.isOccupied(cellBuffer)) return;

    const cell: GridCell = { x: cellBuffer.x, z: cellBuffer.z };
    const cube = MeshBuilder.CreateBox(
      `placed-cube-${cell.x}-${cell.z}`,
      { size: CELL_SIZE },
      scene,
    );
    cellToWorld(cell, positionBuffer);
    cube.position.set(positionBuffer.x, CELL_SIZE / 2, positionBuffer.z);
    cube.material = sharedMaterial;

    gridState.markOccupied(cell);
    placedMeshes.push(cube);
    options.onPlace?.(cell);
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
