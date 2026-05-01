import { Plane, Ray, type Scene, Vector3 } from '@babylonjs/core';
import { type GridCell, isCellInBounds, worldToCell } from './grid';

const PLANE_NORMAL = new Vector3(0, 1, 0);

export interface GridPicker {
  pickCell: (outCell: GridCell) => boolean;
}

export function createGridPicker(scene: Scene, planeY: number): GridPicker {
  const plane = Plane.FromPositionAndNormal(new Vector3(0, planeY, 0), PLANE_NORMAL);
  const ray = new Ray(Vector3.Zero(), Vector3.Forward());
  const pointBuffer = new Vector3();

  return {
    pickCell: (outCell) => {
      scene.createPickingRayToRef(scene.pointerX, scene.pointerY, null, ray, null);
      const distance = ray.intersectsPlane(plane);
      if (distance == null) return false;
      ray.direction.scaleToRef(distance, pointBuffer);
      pointBuffer.addInPlace(ray.origin);
      worldToCell(pointBuffer, outCell);
      return isCellInBounds(outCell);
    },
  };
}
