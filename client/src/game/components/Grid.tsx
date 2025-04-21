import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGridSystem, GridCell } from '../systems/GridSystem';
import { CombatActionType } from '../systems/CombatSystem';
import { useGameState } from '@/lib/stores/useGameState';

interface GridProps {
  selectedAction: CombatActionType | null;
  onCellClick: (cell: GridCell) => void;
}

export function Grid({ selectedAction, onCellClick }: GridProps) {
  const { scene, raycaster, camera, pointer } = useThree();
  const { 
    gridState, 
    getGridPosition, 
    selectCell, 
    clearSelection, 
    highlightMovementRange, 
    highlightAttackRange 
  } = useGridSystem();
  const { gamePhase } = useGameState();
  
  // Reference to grid objects for raycasting
  const gridObjectsRef = useRef<THREE.Object3D[]>([]);
  
  // Handle click on grid cell
  const handleGridClick = (event: MouseEvent) => {
    if (gamePhase !== 'combat') return;
    
    // Update mouse position for raycaster
    raycaster.setFromCamera(pointer, camera);
    
    // Find intersections with grid objects
    const intersects = raycaster.intersectObjects(gridObjectsRef.current);
    
    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const gridX = clickedObject.userData?.gridX;
      const gridZ = clickedObject.userData?.gridZ;
      
      if (gridX !== undefined && gridZ !== undefined) {
        // Get the cell data
        const cell = gridState.cells[gridX][gridZ];
        
        // Handle cell click
        if (cell) {
          selectCell(gridX, gridZ);
          console.log(`Grid cell clicked: [${gridX}, ${gridZ}]`);
          onCellClick(cell);
        }
      }
    }
  };
  
  // Add event listener for clicks
  useEffect(() => {
    window.addEventListener('click', handleGridClick);
    
    return () => {
      window.removeEventListener('click', handleGridClick);
    };
  }, [gamePhase, gridState]);
  
  // Collect grid objects for raycasting
  useEffect(() => {
    // Find all grid objects in the scene
    gridObjectsRef.current = [];
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData?.gridX !== undefined) {
        gridObjectsRef.current.push(object);
      }
    });
  }, [gridState, scene]);
  
  // Update grid visualization based on selected action
  useEffect(() => {
    if (gamePhase !== 'combat' || !selectedAction) return;
    
    // Get player position from the grid
    const playerCell = gridState.cells.flat().find(cell => cell.occupiedBy === 'player');
    
    if (!playerCell) return;
    
    // Clear previous highlights
    clearSelection();
    
    // Highlight cells based on selected action
    if (selectedAction === CombatActionType.MOVE) {
      // Show movement range
      highlightMovementRange(playerCell.position[0], playerCell.position[1], 3); // Movement range of 3
    } else if (selectedAction === CombatActionType.ATTACK || selectedAction === CombatActionType.ABILITY) {
      // Show attack range
      highlightAttackRange(playerCell.position[0], playerCell.position[1], 2); // Attack range of 2
    }
  }, [selectedAction, gamePhase]);
  
  return null; // The grid is handled by the GridSystem component
}