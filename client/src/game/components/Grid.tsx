import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { useGridSystem, GridCell } from '@/game/systems/GridSystem';
import { GridVisualizer } from './GridVisualizer';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useTacticalCombat } from '@/game/hooks/useTacticalCombat';

interface GridProps {
  selectedAction: CombatActionType | null;
  onCellClick: (cell: GridCell) => void;
}

export function Grid({ selectedAction, onCellClick }: GridProps) {
  const { scene, camera, raycaster, mouse, gl } = useThree();
  const { gridState, clearHighlights, highlightMovementRange, highlightAttackRange, selectCell, getGridPosition, calculatePath } = useGridSystem();
  const { position: playerPosition } = useCharacter();
  const { combatState } = useTacticalCombat();
  
  // State to track which cell the mouse is hovering over
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  
  // Handle click on a grid cell
  const handleGridClick = (event: MouseEvent) => {
    // Raycast to detect which grid cell was clicked
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hitObject = intersects[0].object as THREE.Object3D;
      const { gridX, gridZ } = (hitObject.userData || {}) as { gridX?: number; gridZ?: number };
      if (gridX !== undefined && gridZ !== undefined) {
        const cell = gridState.cells[gridX]?.[gridZ];
        if (cell) {
          onCellClick(cell);
        }
      }
    }
  };
  
  // Set up event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const hitObject = intersects[0].object as THREE.Object3D;
        const { gridX, gridZ } = (hitObject.userData || {}) as { gridX?: number; gridZ?: number };
        if (gridX !== undefined && gridZ !== undefined) {
          setHoveredCell([gridX, gridZ]);
          return;
        }
      }
      setHoveredCell(null);
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('click', handleGridClick);
    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('click', handleGridClick);
    };
  }, [gl, scene, camera, raycaster, mouse]);
  
  // Customize grid appearance based on selected action
  useEffect(() => {
    if (!selectedAction || !hoveredCell) return;
    
    const [gridX, gridZ] = hoveredCell;
    
    // Clear previous highlights
    clearHighlights();
    
    // Determine player's current grid position
    const playerGrid = getGridPosition(playerPosition[0], playerPosition[2]);
    
    switch (selectedAction) {
      case CombatActionType.MOVE: {
        if (playerGrid) {
          const [sx, sz] = playerGrid;
          // Show reachable cells from player within movement points
          highlightMovementRange(sx, sz, combatState.movementPoints);
          // Preview path to hovered cell
          calculatePath(sx, sz, gridX, gridZ);
          selectCell(gridX, gridZ);
        }
        break;
      }
      case CombatActionType.ATTACK: {
        // Highlight attack range around player (range 1)
        if (playerGrid) {
          const [sx, sz] = playerGrid;
          highlightAttackRange(sx, sz, 1);
          selectCell(gridX, gridZ);
        }
        break;
      }
      case CombatActionType.ABILITY: {
        // Highlight ability range (range 2 by default)
        if (playerGrid) {
          const [sx, sz] = playerGrid;
          highlightAttackRange(sx, sz, 2);
          selectCell(gridX, gridZ);
        }
        break;
      }
      default:
        break;
    }
  }, [selectedAction, hoveredCell, clearHighlights, highlightMovementRange, highlightAttackRange, selectCell, getGridPosition, playerPosition, combatState.movementPoints]);
  
  return (
    <GridVisualizer 
      gridCells={gridState.cells}
      width={gridState.width}
      height={gridState.height}
      selectedCell={gridState.selectedCell}
      highlightedCells={gridState.highlightedCells}
      attackRangeCells={gridState.attackRangeCells}
      pathCells={gridState.pathCells}
    />
  );
}