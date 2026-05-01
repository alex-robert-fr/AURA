import {
  Color3,
  Constants,
  type Mesh,
  MeshBuilder,
  type Observer,
  PointerEventTypes,
  type PointerInfo,
  type Scene,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import {
  CELL_SIZE,
  GRID_HALF_EXTENT,
  type GridCell,
  type GridState,
  cellToWorld,
  isCellInBounds,
  worldToCell,
} from './grid';
import { GRID_HIGHLIGHT_FREE, GRID_HIGHLIGHT_OCCUPIED } from './grid-colors';

const GRID_Y = 0.9;
const HIGHLIGHT_Y = 0.92;
const GRID_COLOR = new Color3(0.85, 0.88, 0.95);
const GRID_ALPHA = 0.35;
const HIGHLIGHT_ALPHA = 0.4;

export interface GridOverlay {
  dispose: () => void;
}

export function createGridOverlay(scene: Scene, ground: Mesh, gridState: GridState): GridOverlay {
  const lines: Vector3[][] = [];
  for (let i = -GRID_HALF_EXTENT; i <= GRID_HALF_EXTENT; i += CELL_SIZE) {
    lines.push([
      new Vector3(i, GRID_Y, -GRID_HALF_EXTENT),
      new Vector3(i, GRID_Y, GRID_HALF_EXTENT),
    ]);
    lines.push([
      new Vector3(-GRID_HALF_EXTENT, GRID_Y, i),
      new Vector3(GRID_HALF_EXTENT, GRID_Y, i),
    ]);
  }

  const gridMesh = MeshBuilder.CreateLineSystem('grid-lines', { lines }, scene);
  gridMesh.color = GRID_COLOR;
  gridMesh.alpha = GRID_ALPHA;
  gridMesh.isPickable = false;
  gridMesh.isVisible = false;
  if (gridMesh.material) {
    gridMesh.material.disableDepthWrite = true;
    gridMesh.material.depthFunction = Constants.ALWAYS;
  }

  const highlightMesh = MeshBuilder.CreatePlane(
    'grid-highlight',
    { size: CELL_SIZE, sideOrientation: 2 },
    scene,
  );
  highlightMesh.rotation.x = Math.PI / 2;
  highlightMesh.isPickable = false;
  highlightMesh.isVisible = false;

  const highlightMaterial = new StandardMaterial('grid-highlight-material', scene);
  highlightMaterial.diffuseColor.copyFrom(GRID_HIGHLIGHT_FREE);
  highlightMaterial.emissiveColor.copyFrom(GRID_HIGHLIGHT_FREE);
  highlightMaterial.specularColor = new Color3(0, 0, 0);
  highlightMaterial.alpha = HIGHLIGHT_ALPHA;
  highlightMaterial.disableLighting = true;
  highlightMaterial.disableDepthWrite = true;
  highlightMaterial.depthFunction = Constants.ALWAYS;
  highlightMesh.material = highlightMaterial;

  const cellBuffer: GridCell = { x: 0, z: 0 };
  const positionBuffer = new Vector3();
  let currentOccupied = false;

  const setVisibility = (visible: boolean) => {
    if (gridMesh.isVisible !== visible) gridMesh.isVisible = visible;
    if (highlightMesh.isVisible !== visible) highlightMesh.isVisible = visible;
  };

  const setOccupiedState = (occupied: boolean) => {
    if (occupied === currentOccupied) return;
    currentOccupied = occupied;
    const color = occupied ? GRID_HIGHLIGHT_OCCUPIED : GRID_HIGHLIGHT_FREE;
    highlightMaterial.diffuseColor.copyFrom(color);
    highlightMaterial.emissiveColor.copyFrom(color);
  };

  const handlePointer = (info: PointerInfo) => {
    if (info.type === PointerEventTypes.POINTERMOVE) {
      const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground, true);
      if (!pick?.hit || !pick.pickedPoint) {
        setVisibility(false);
        return;
      }
      worldToCell(pick.pickedPoint, cellBuffer);
      if (!isCellInBounds(cellBuffer)) {
        setVisibility(false);
        return;
      }
      cellToWorld(cellBuffer, positionBuffer);
      highlightMesh.position.set(positionBuffer.x, HIGHLIGHT_Y, positionBuffer.z);
      setOccupiedState(gridState.isOccupied(cellBuffer));
      setVisibility(true);
    }
  };

  const observer: Observer<PointerInfo> | null = scene.onPointerObservable.add(handlePointer);

  const canvas = scene.getEngine().getRenderingCanvas();
  const handleLeave = () => setVisibility(false);
  canvas?.addEventListener('pointerleave', handleLeave);

  return {
    dispose: () => {
      if (observer) scene.onPointerObservable.remove(observer);
      canvas?.removeEventListener('pointerleave', handleLeave);
      highlightMaterial.dispose();
      highlightMesh.dispose();
      gridMesh.dispose();
    },
  };
}
