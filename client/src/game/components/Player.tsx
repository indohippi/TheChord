import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { Controls } from '@/App';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

// Create a simple character sprite using Three.js shapes
const createCharacterSprite = (characterClass: string | null) => {
  // Simple geometric representation based on character class
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  
  // Different colors for different character classes
  let color;
  switch(characterClass) {
    case 'CovenantWeaver':
      color = new THREE.Color(0x3498db); // Blue
      break;
    case 'PhilosopherKing':
      color = new THREE.Color(0xe74c3c); // Red
      break;
    case 'ChakravartiAvatar':
      color = new THREE.Color(0xf39c12); // Orange
      break;
    case 'SerpentsWhisper':
      color = new THREE.Color(0x2ecc71); // Green
      break;
    case 'JadeDragon':
      color = new THREE.Color(0x9b59b6); // Purple
      break;
    default:
      color = new THREE.Color(0xffffff); // White (default)
  }
  
  const material = new THREE.MeshStandardMaterial({ 
    color, 
    roughness: 0.7,
    metalness: 0.3
  });
  
  return { geometry, material };
};

export function Player() {
  const { selectedClass, position, setPosition, facing, setFacing, isMoving, setIsMoving } = useCharacter();
  const { gamePhase } = useGameState();
  const { currentZoneData } = useEchoZone();
  
  // Reference to the mesh
  const playerRef = useRef<THREE.Mesh>(null);
  
  // Get movement controls
  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const backward = useKeyboardControls<Controls>((state) => state.backward);
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);
  
  // Create player sprite
  const { geometry, material } = createCharacterSprite(selectedClass);
  
  // Movement speed
  const MOVE_SPEED = 0.15;
  
  // Update player position in game loop
  useFrame(() => {
    if (gamePhase !== 'gameplay' || !playerRef.current || !currentZoneData) {
      return;
    }
    
    let newX = position[0];
    let newZ = position[2];
    let isCurrentlyMoving = false;
    
    // Handle movement
    if (forward) {
      newZ -= MOVE_SPEED;
      setFacing('north');
      isCurrentlyMoving = true;
    } 
    if (backward) {
      newZ += MOVE_SPEED;
      setFacing('south');
      isCurrentlyMoving = true;
    }
    if (left) {
      newX -= MOVE_SPEED;
      setFacing('west');
      isCurrentlyMoving = true;
    }
    if (right) {
      newX += MOVE_SPEED;
      setFacing('east');
      isCurrentlyMoving = true;
    }
    
    // Apply zone boundaries
    const { boundaries } = currentZoneData;
    newX = Math.max(boundaries.minX, Math.min(boundaries.maxX, newX));
    newZ = Math.max(boundaries.minZ, Math.min(boundaries.maxZ, newZ));
    
    // Update position
    if (newX !== position[0] || newZ !== position[2]) {
      setPosition([newX, position[1], newZ]);
      
      // Update mesh position
      if (playerRef.current) {
        playerRef.current.position.x = newX;
        playerRef.current.position.z = newZ;
      }
    }
    
    // Update animation state
    if (isCurrentlyMoving !== isMoving) {
      setIsMoving(isCurrentlyMoving);
    }
  });
  
  // Log player position for debugging
  useEffect(() => {
    console.log(`Player position: [${position[0].toFixed(2)}, ${position[1].toFixed(2)}, ${position[2].toFixed(2)}]`);
  }, [position]);
  
  return (
    <mesh 
      ref={playerRef}
      position={[position[0], position[1], position[2]]}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
    >
      {/* Add a simple 8-bit style head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={material.color} />
      </mesh>
    </mesh>
  );
}
