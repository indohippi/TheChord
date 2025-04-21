import { useMemo } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useGameState } from '@/lib/stores/useGameState';
import { GridCell } from '@/game/systems/GridSystem';

interface GridVisualizerProps {
  gridCells: GridCell[][];
  width: number;
  height: number;
  selectedCell: [number, number] | null;
  highlightedCells: [number, number][];
  attackRangeCells: [number, number][];
  pathCells: [number, number][];
}

export function GridVisualizer({
  gridCells,
  width,
  height,
  selectedCell,
  highlightedCells,
  attackRangeCells,
  pathCells
}: GridVisualizerProps) {
  const { gamePhase } = useGameState();
  
  // Constants for visualization
  const CELL_SIZE = 1;
  const GRID_HEIGHT = 0.05; // Height above ground
  const NORMAL_COLOR = new THREE.Color('#3a3a3a');
  const HIGHLIGHT_COLOR = new THREE.Color('#4a9eff');
  const PATH_COLOR = new THREE.Color('#4aff4a');
  const ATTACK_COLOR = new THREE.Color('#ff4a4a');
  const SELECTED_COLOR = new THREE.Color('#ffcc00');
  
  // Only render grid in combat phase
  if (gamePhase !== 'combat') return null;
  
  // Create grid cells as instanced meshes for better performance
  const cellGeometry = new THREE.PlaneGeometry(CELL_SIZE * 0.9, CELL_SIZE * 0.9);
  const cellMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  });
  
  // Function to determine cell color and opacity
  const getCellVisualProps = (x: number, z: number) => {
    // Check if cell is the selected cell
    if (selectedCell && selectedCell[0] === x && selectedCell[1] === z) {
      return { color: SELECTED_COLOR, opacity: 0.7 };
    }
    
    // Check if cell is in the path
    if (pathCells.some(([px, pz]) => px === x && pz === z)) {
      return { color: PATH_COLOR, opacity: 0.6 };
    }
    
    // Check if cell is in attack range
    if (attackRangeCells.some(([ax, az]) => ax === x && az === z)) {
      return { color: ATTACK_COLOR, opacity: 0.6 };
    }
    
    // Check if cell is highlighted for movement
    if (highlightedCells.some(([hx, hz]) => hx === x && hz === z)) {
      return { color: HIGHLIGHT_COLOR, opacity: 0.5 };
    }
    
    // Default appearance
    return { color: NORMAL_COLOR, opacity: 0.3 };
  };
  
  return (
    <group position={[0, GRID_HEIGHT, 0]}>
      {gridCells.map((row, x) => 
        row.map((cell, z) => {
          if (!cell.isWalkable) return null;
          
          const { color, opacity } = getCellVisualProps(x, z);
          
          return (
            <mesh
              key={`grid-${x}-${z}`}
              position={[cell.worldPosition[0], GRID_HEIGHT, cell.worldPosition[2]]}
              rotation={[-Math.PI / 2, 0, 0]} // Rotate to lie flat
              userData={{ gridX: x, gridZ: z }} // Store grid position in userData
            >
              <planeGeometry args={[CELL_SIZE * 0.9, CELL_SIZE * 0.9]} />
              <meshBasicMaterial 
                color={color} 
                transparent 
                opacity={opacity} 
                side={THREE.DoubleSide} 
              />
            </mesh>
          );
        })
      )}
      
      {/* Visual indicators for selection, path, etc. could be added here */}
      {selectedCell && (
        <mesh
          position={[
            gridCells[selectedCell[0]][selectedCell[1]].worldPosition[0],
            GRID_HEIGHT + 0.01,
            gridCells[selectedCell[0]][selectedCell[1]].worldPosition[2]
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[CELL_SIZE * 0.3, CELL_SIZE * 0.4, 32]} />
          <meshBasicMaterial color={SELECTED_COLOR} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}