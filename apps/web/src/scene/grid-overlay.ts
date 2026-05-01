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
import {
  CELL_SIZE,
  GRID_HALF_EXTENT,
  type GridCell,
  type GridState,
  cellToWorld,
  createGridState,
  isCellInBounds,
  worldToCell,
} from './grid';

const GRID_Y = 0.002;
const HIGHLIGHT_Y = 0.003;
const GRID_COLOR = new Color3(0.85, 0.88, 0.95);
const GRID_ALPHA = 0.35;
const HIGHLIGHT_COLOR = new Color3(0.95, 0.97, 1);
const HIGHLIGHT_ALPHA = 0.4;

export interface GridOverlay {
  state: GridState;
  dispose: () => void;
}

export function createGridOverlay(scene: Scene, ground: Mesh): GridOverlay {
  const state = createGridState();

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

  const highlightMesh = MeshBuilder.CreatePlane(
    'grid-highlight',
    { size: CELL_SIZE, sideOrientation: 2 },
    scene,
  );
  highlightMesh.rotation.x = Math.PI / 2;
  highlightMesh.isPickable = false;
  highlightMesh.isVisible = false;

  const highlightMaterial = new StandardMaterial('grid-highlight-material', scene);
  highlightMaterial.diffuseColor = HIGHLIGHT_COLOR;
  highlightMaterial.emissiveColor = HIGHLIGHT_COLOR;
  highlightMaterial.specularColor = new Color3(0, 0, 0);
  highlightMaterial.alpha = HIGHLIGHT_ALPHA;
  highlightMaterial.disableLighting = true;
  highlightMesh.material = highlightMaterial;

  const cellBuffer: GridCell = { x: 0, z: 0 };
  const positionBuffer = new Vector3();

  const setVisibility = (visible: boolean) => {
    if (gridMesh.isVisible !== visible) gridMesh.isVisible = visible;
    if (highlightMesh.isVisible !== visible) highlightMesh.isVisible = visible;
  };

  const handlePointer = (info: PointerInfo) => {
    if (info.type === PointerEventTypes.POINTERMOVE) {
      const pick = scene.pick(scene.pointerX, scene.pointerY, (mesh) => mesh === ground);
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
      setVisibility(true);
    }
  };

  const observer: Observer<PointerInfo> | null = scene.onPointerObservable.add(handlePointer);

  const canvas = scene.getEngine().getRenderingCanvas();
  const handleLeave = () => setVisibility(false);
  canvas?.addEventListener('pointerleave', handleLeave);

  return {
    state,
    dispose: () => {
      if (observer) scene.onPointerObservable.remove(observer);
      canvas?.removeEventListener('pointerleave', handleLeave);
      highlightMaterial.dispose();
      highlightMesh.dispose();
      gridMesh.dispose();
    },
  };
}
