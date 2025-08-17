import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { useGridSystem, GridCell } from '@/game/systems/GridSystem';
import { GridVisualizer } from './GridVisualizer';

interface GridProps {
  selectedAction: CombatActionType | null;
  onCellClick: (cell: GridCell) => void;
}

export function Grid({ selectedAction, onCellClick }: GridProps) {
  const { scene, camera, raycaster, mouse, gl } = useThree();
  const { gridState, clearHighlights, highlightMovementRange, highlightAttackRange, selectCell } = useGridSystem();
  
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
    
    // Apply appropriate highlights based on action type
    switch (selectedAction) {
      case CombatActionType.MOVE:
        // Highlight movement range from hovered cell for now
        highlightMovementRange(gridX, gridZ, 3);
        break;
        
      case CombatActionType.ATTACK:
        // Highlight attack range
        highlightAttackRange(gridX, gridZ, 1);
        break;
        
      case CombatActionType.ABILITY:
        // Highlight ability range (could be different based on selected ability)
        highlightAttackRange(gridX, gridZ, 2);
        break;
        
      default:
        break;
    }
    
    // Select the hovered cell
    selectCell(gridX, gridZ);
    
  }, [selectedAction, hoveredCell, clearHighlights, highlightMovementRange, highlightAttackRange, selectCell]);
  
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