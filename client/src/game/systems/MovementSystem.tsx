import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useRef } from 'react';
import { Controls } from '@/App';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';

export function MovementSystem() {
  // Get character state
  const { position, setPosition, facing, setFacing, isMoving, setIsMoving } = useCharacter();
  
  // Get game state
  const { gamePhase } = useGameState();
  
  // Get current zone boundaries
  const { currentZoneData } = useEchoZone();
  
  // Track frame time for consistent movement
  const lastFrameTime = useRef(Date.now());
  
  // Movement constants
  const MOVE_SPEED = 5; // Units per second

  // Movement system core
  useFrame(() => {
    // Skip if game is not in gameplay mode or no zone data
    if (gamePhase !== 'gameplay' || !currentZoneData) {
      return;
    }
    
    // Calculate delta time for frame-rate independent movement
    const now = Date.now();
    const deltaTime = (now - lastFrameTime.current) / 1000; // Convert to seconds
    lastFrameTime.current = now;
    
    // Prevent extreme delta times during lag spikes
    const clampedDeltaTime = Math.min(deltaTime, 0.1);
    
    // Current position
    const [x, y, z] = position;
    
    // Movement will be handled in Player.tsx
    // This system just logs movement
    if (isMoving) {
      console.log(`Player moving ${facing} at speed ${MOVE_SPEED} units/s`);
    }
  });
  
  return null;
}
