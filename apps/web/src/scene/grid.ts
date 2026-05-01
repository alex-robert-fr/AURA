import { Vector3 } from '@babylonjs/core';

export const CELL_SIZE = 1;
export const GRID_HALF_EXTENT = 20;
export const GRID_CELLS_PER_SIDE = (GRID_HALF_EXTENT * 2) / CELL_SIZE;

export interface GridCell {
  x: number;
  z: number;
}

export interface GridState {
  isOccupied: (cell: GridCell) => boolean;
  markOccupied: (cell: GridCell) => void;
  clearOccupied: (cell: GridCell) => void;
}

const MIN_INDEX = -GRID_HALF_EXTENT / CELL_SIZE;
const MAX_INDEX = GRID_HALF_EXTENT / CELL_SIZE - 1;

export function worldToCell(point: Vector3, out?: GridCell): GridCell {
  const cell = out ?? { x: 0, z: 0 };
  cell.x = Math.floor(point.x / CELL_SIZE);
  cell.z = Math.floor(point.z / CELL_SIZE);
  return cell;
}

export function cellToWorld(cell: GridCell, out?: Vector3): Vector3 {
  const target = out ?? new Vector3();
  target.set(cell.x * CELL_SIZE + CELL_SIZE / 2, 0, cell.z * CELL_SIZE + CELL_SIZE / 2);
  return target;
}

export function isCellInBounds(cell: GridCell): boolean {
  return cell.x >= MIN_INDEX && cell.x <= MAX_INDEX && cell.z >= MIN_INDEX && cell.z <= MAX_INDEX;
}

export function cellKey(cell: GridCell): string {
  return `${cell.x},${cell.z}`;
}

export function createGridState(): GridState {
  const occupied = new Set<string>();
  return {
    isOccupied: (cell) => occupied.has(cellKey(cell)),
    markOccupied: (cell) => {
      occupied.add(cellKey(cell));
    },
    clearOccupied: (cell) => {
      occupied.delete(cellKey(cell));
    },
  };
}
