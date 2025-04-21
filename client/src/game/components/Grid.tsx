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
  const { scene, camera, raycaster, mouse } = useThree();
  const { gridState } = useGridSystem();
  
  // State to track which cell the mouse is hovering over
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  
  // Handle click on a grid cell
  const handleGridClick = (event: MouseEvent) => {
    // We'll use raycasting to detect which grid cell was clicked
    if (event.target && (event.target as any).userData) {
      const { gridX, gridZ } = (event.target as any).userData;
      
      if (gridX !== undefined && gridZ !== undefined) {
        // Get the cell data
        const cell = gridState.cells[gridX][gridZ];
        
        // Call the provided click handler
        onCellClick(cell);
      }
    }
  };
  
  // Set up event listeners
  useEffect(() => {
    // Add click event listener to the canvas
    const canvas = scene.userData.canvas;
    if (canvas) {
      canvas.addEventListener('click', handleGridClick);
      
      return () => {
        canvas.removeEventListener('click', handleGridClick);
      };
    }
  }, [scene]);
  
  // Handle mouse movement to highlight hovered cell
  const handleMouseMove = (event: PointerEvent) => {
    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Find intersections with grid cell meshes
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Check if we hit a grid cell
    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      
      if (hitObject.userData && hitObject.userData.gridX !== undefined && hitObject.userData.gridZ !== undefined) {
        const { gridX, gridZ } = hitObject.userData;
        setHoveredCell([gridX, gridZ]);
      } else {
        setHoveredCell(null);
      }
    } else {
      setHoveredCell(null);
    }
  };
  
  // Customize grid appearance based on selected action
  useEffect(() => {
    if (!selectedAction || !hoveredCell) return;
    
    const [gridX, gridZ] = hoveredCell;
    
    // Clear previous highlights
    useGridSystem().clearHighlights();
    
    // Apply appropriate highlights based on action type
    switch (selectedAction) {
      case CombatActionType.MOVE:
        // Highlight movement range from player position
        // In a real implementation, we'd get the player's position from the store
        // For now, just highlight around the hovered cell
        useGridSystem().highlightMovementRange(gridX, gridZ, 3);
        break;
        
      case CombatActionType.ATTACK:
        // Highlight attack range
        useGridSystem().highlightAttackRange(gridX, gridZ, 1);
        break;
        
      case CombatActionType.ABILITY:
        // Highlight ability range (could be different based on selected ability)
        useGridSystem().highlightAttackRange(gridX, gridZ, 2);
        break;
        
      default:
        break;
    }
    
    // Select the hovered cell
    useGridSystem().selectCell(gridX, gridZ);
    
  }, [selectedAction, hoveredCell]);
  
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