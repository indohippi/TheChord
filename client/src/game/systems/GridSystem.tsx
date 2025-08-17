import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { useGameState } from '@/lib/stores/useGameState';

// Grid constants
const GRID_CELL_SIZE = 1; // Size of each grid cell
const GRID_COLOR_NORMAL = '#3a3a3a'; // Default grid color
const GRID_COLOR_HIGHLIGHT = '#4a9eff'; // Highlighted cell color
const GRID_COLOR_PATH = '#4aff4a'; // Path cell color
const GRID_COLOR_ATTACK = '#ff4a4a'; // Attack range cell color

export type GridCell = {
  position: [number, number]; // [x, z] grid coordinates
  worldPosition: [number, number, number]; // [x, y, z] world position
  isWalkable: boolean;
  isOccupied: boolean;
  occupiedBy?: 'player' | 'enemy' | 'object';
  entityId?: string; // ID of the entity occupying this cell
};

interface GridState {
  cells: GridCell[][];
  selectedCell: [number, number] | null;
  highlightedCells: [number, number][];
  attackRangeCells: [number, number][];
  pathCells: [number, number][];
  width: number;
  height: number;
}

export const useGridSystem = () => {
  const { scene } = useThree();
  const { currentZoneData } = useEchoZone();
  const { gamePhase } = useGameState();
  const [gridState, setGridState] = useState<GridState>({
    cells: [],
    selectedCell: null,
    highlightedCells: [],
    attackRangeCells: [],
    pathCells: [],
    width: 0,
    height: 0
  });
  
  // Grid meshes ref
  const gridMeshesRef = useRef<THREE.Mesh[]>([]);
  
  // Initialize grid based on the current zone
  useEffect(() => {
    if (!currentZoneData) return;
    
    // Clear previous grid
    gridMeshesRef.current.forEach(mesh => {
      scene.remove(mesh);
    });
    gridMeshesRef.current = [];
    
    // Get zone boundaries
    const { boundaries } = currentZoneData;
    
    // Calculate grid dimensions
    const width = Math.ceil((boundaries.maxX - boundaries.minX) / GRID_CELL_SIZE);
    const height = Math.ceil((boundaries.maxZ - boundaries.minZ) / GRID_CELL_SIZE);
    
    // Create grid cells
    const cells: GridCell[][] = [];
    
    for (let x = 0; x < width; x++) {
      cells[x] = [];
      for (let z = 0; z < height; z++) {
        const worldX = boundaries.minX + x * GRID_CELL_SIZE;
        const worldZ = boundaries.minZ + z * GRID_CELL_SIZE;
        
        cells[x][z] = {
          position: [x, z],
          worldPosition: [worldX, 0, worldZ],
          isWalkable: true, // Default to walkable
          isOccupied: false
        };
      }
    }
    
    // Update grid state
    setGridState(prev => ({
      ...prev,
      cells,
      width,
      height
    }));
    
    console.log(`Created grid: ${width}x${height} cells`);
  }, [currentZoneData, scene]);
  
  // Create or update visual grid
  useEffect(() => {
    if (gamePhase !== 'combat' || gridState.cells.length === 0) return;
    
    // Clear previous grid visuals
    gridMeshesRef.current.forEach(mesh => {
      scene.remove(mesh);
    });
    gridMeshesRef.current = [];
    
    // Create grid visuals
    const gridGeometry = new THREE.PlaneGeometry(GRID_CELL_SIZE * 0.9, GRID_CELL_SIZE * 0.9);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: GRID_COLOR_NORMAL,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    
    // Create grid cells
    for (let x = 0; x < gridState.width; x++) {
      for (let z = 0; z < gridState.height; z++) {
        const cell = gridState.cells[x][z];
        if (!cell.isWalkable) continue; // Skip unwalkable cells
        
        const cellMesh = new THREE.Mesh(gridGeometry, gridMaterial.clone());
        cellMesh.position.set(cell.worldPosition[0], 0.05, cell.worldPosition[2]);
        cellMesh.rotation.x = -Math.PI / 2; // Rotate to lie flat on the ground
        cellMesh.userData = { gridX: x, gridZ: z }; // Store grid position in userData
        
        // Highlight selected/path/attack cells
        if (gridState.selectedCell && gridState.selectedCell[0] === x && gridState.selectedCell[1] === z) {
          (cellMesh.material as THREE.MeshBasicMaterial).color.set(GRID_COLOR_HIGHLIGHT);
          (cellMesh.material as THREE.MeshBasicMaterial).opacity = 0.7;
        } else if (gridState.pathCells.some(([px, pz]) => px === x && pz === z)) {
          (cellMesh.material as THREE.MeshBasicMaterial).color.set(GRID_COLOR_PATH);
          (cellMesh.material as THREE.MeshBasicMaterial).opacity = 0.6;
        } else if (gridState.attackRangeCells.some(([ax, az]) => ax === x && az === z)) {
          (cellMesh.material as THREE.MeshBasicMaterial).color.set(GRID_COLOR_ATTACK);
          (cellMesh.material as THREE.MeshBasicMaterial).opacity = 0.6;
        } else if (gridState.highlightedCells.some(([hx, hz]) => hx === x && hz === z)) {
          (cellMesh.material as THREE.MeshBasicMaterial).color.set(GRID_COLOR_HIGHLIGHT);
          (cellMesh.material as THREE.MeshBasicMaterial).opacity = 0.5;
        }
        
        scene.add(cellMesh);
        gridMeshesRef.current.push(cellMesh);
      }
    }
    
    return () => {
      // Clean up grid visuals when unmounting
      gridMeshesRef.current.forEach(mesh => {
        scene.remove(mesh);
      });
      gridMeshesRef.current = [];
    };
  }, [gamePhase, gridState, scene]);
  
  // Get world position from grid coordinates
  const getWorldPosition = (gridX: number, gridZ: number): [number, number, number] | null => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return null;
    }
    return gridState.cells[gridX][gridZ].worldPosition;
  };
  
  // Get grid coordinates from world position
  const getGridPosition = (worldX: number, worldZ: number): [number, number] | null => {
    if (!currentZoneData) return null;
    
    const { boundaries } = currentZoneData;
    
    // Calculate relative position within the grid
    const relX = worldX - boundaries.minX;
    const relZ = worldZ - boundaries.minZ;
    
    // Calculate grid coordinates
    const gridX = Math.floor(relX / GRID_CELL_SIZE);
    const gridZ = Math.floor(relZ / GRID_CELL_SIZE);
    
    // Check if within grid bounds
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return null;
    }
    
    return [gridX, gridZ];
  };
  
  // Set a cell as occupied or unoccupied
  const setCellOccupation = (gridX: number, gridZ: number, occupied: boolean, occupiedBy?: 'player' | 'enemy' | 'object', entityId?: string) => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return;
    }
    
    setGridState(prev => {
      const newCells = [...prev.cells];
      newCells[gridX][gridZ] = {
        ...newCells[gridX][gridZ],
        isOccupied: occupied,
        occupiedBy,
        entityId
      };
      return {
        ...prev,
        cells: newCells
      };
    });
  };
  
  // Set a cell as walkable or unwalkable
  const setCellWalkable = (gridX: number, gridZ: number, walkable: boolean) => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return;
    }
    
    setGridState(prev => {
      const newCells = [...prev.cells];
      newCells[gridX][gridZ] = {
        ...newCells[gridX][gridZ],
        isWalkable: walkable
      };
      return {
        ...prev,
        cells: newCells
      };
    });
  };
  
  // Select a cell
  const selectCell = (gridX: number, gridZ: number) => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return;
    }
    
    setGridState(prev => ({
      ...prev,
      selectedCell: [gridX, gridZ]
    }));
  };
  
  // Clear cell selection
  const clearSelection = () => {
    setGridState(prev => ({
      ...prev,
      selectedCell: null
    }));
  };
  
  // Highlight cells within a movement range
  const highlightMovementRange = (gridX: number, gridZ: number, range: number) => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return;
    }
    
    const highlightedCells: [number, number][] = [];
    
    // Simple Manhattan distance calculation for movement range
    for (let x = Math.max(0, gridX - range); x <= Math.min(gridState.width - 1, gridX + range); x++) {
      for (let z = Math.max(0, gridZ - range); z <= Math.min(gridState.height - 1, gridZ + range); z++) {
        const distance = Math.abs(x - gridX) + Math.abs(z - gridZ);
        if (distance <= range && gridState.cells[x][z].isWalkable && !gridState.cells[x][z].isOccupied) {
          highlightedCells.push([x, z]);
        }
      }
    }
    
    setGridState(prev => ({
      ...prev,
      highlightedCells
    }));
  };
  
  // Highlight cells within attack range
  const highlightAttackRange = (gridX: number, gridZ: number, range: number) => {
    if (gridX < 0 || gridX >= gridState.width || gridZ < 0 || gridZ >= gridState.height) {
      return;
    }
    
    const attackRangeCells: [number, number][] = [];
    
    // Simple Manhattan distance calculation for attack range
    for (let x = Math.max(0, gridX - range); x <= Math.min(gridState.width - 1, gridX + range); x++) {
      for (let z = Math.max(0, gridZ - range); z <= Math.min(gridState.height - 1, gridZ + range); z++) {
        const distance = Math.abs(x - gridX) + Math.abs(z - gridZ);
        if (distance <= range && distance > 0) { // Exclude the center cell
          attackRangeCells.push([x, z]);
        }
      }
    }
    
    setGridState(prev => ({
      ...prev,
      attackRangeCells
    }));
  };
  
  // Calculate neighbors for A*
  const getNeighbors = (x: number, z: number): [number, number][] => {
    const candidates: [number, number][] = [
      [x + 1, z],
      [x - 1, z],
      [x, z + 1],
      [x, z - 1],
    ];
    return candidates.filter(([nx, nz]) =>
      nx >= 0 && nx < gridState.width && nz >= 0 && nz < gridState.height &&
      gridState.cells[nx][nz].isWalkable && !gridState.cells[nx][nz].isOccupied
    );
  };
  
  // Calculate and highlight a path between two grid positions using A*
  const calculatePath = (startX: number, startZ: number, endX: number, endZ: number) => {
    const start = `${startX},${startZ}`;
    const goal = `${endX},${endZ}`;
    
    const openSet = new Set<string>([start]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    
    const key = (x: number, z: number) => `${x},${z}`;
    const parse = (k: string): [number, number] => k.split(',').map(Number) as [number, number];
    const manhattan = (a: [number, number], b: [number, number]) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    
    gScore.set(start, 0);
    fScore.set(start, manhattan([startX, startZ], [endX, endZ]));
    
    const reconstructPath = (currentKey: string): [number, number][] => {
      const totalPath: [number, number][] = [parse(currentKey)];
      while (cameFrom.has(currentKey)) {
        currentKey = cameFrom.get(currentKey)!;
        totalPath.unshift(parse(currentKey));
      }
      return totalPath;
    };
    
    while (openSet.size > 0) {
      // Select node in openSet with lowest fScore
      let current = Array.from(openSet).reduce((best, node) => {
        const bestScore = fScore.get(best) ?? Infinity;
        const nodeScore = fScore.get(node) ?? Infinity;
        return nodeScore < bestScore ? node : best;
      });
      const [cx, cz] = parse(current);
      
      if (current === goal) {
        const path = reconstructPath(current);
        setGridState(prev => ({ ...prev, pathCells: path }));
        return path;
      }
      
      openSet.delete(current);
      
      for (const [nx, nz] of getNeighbors(cx, cz)) {
        const tentativeG = (gScore.get(current) ?? Infinity) + 1;
        const neighborKey = key(nx, nz);
        if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          fScore.set(neighborKey, tentativeG + manhattan([nx, nz], [endX, endZ]));
          if (!openSet.has(neighborKey)) openSet.add(neighborKey);
        }
      }
    }
    
    // No path found
    setGridState(prev => ({ ...prev, pathCells: [] }));
    return [];
  };
  
  // Clear all highlights
  const clearHighlights = () => {
    setGridState(prev => ({
      ...prev,
      highlightedCells: [],
      attackRangeCells: [],
      pathCells: []
    }));
  };
  
  return {
    gridState,
    getWorldPosition,
    getGridPosition,
    setCellOccupation,
    setCellWalkable,
    selectCell,
    clearSelection,
    highlightMovementRange,
    highlightAttackRange,
    calculatePath,
    clearHighlights
  };
};

export function GridSystem() {
  return null; // This component doesn't render anything
}