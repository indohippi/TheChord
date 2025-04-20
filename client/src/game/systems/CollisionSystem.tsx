import { useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import * as THREE from 'three';

export function CollisionSystem() {
  // Get character state
  const { position } = useCharacter();
  
  // Get game state
  const { gamePhase, startCombat } = useGameState();
  
  // Get current zone data
  const { currentZoneData, echoes } = useEchoZone();
  
  // Reference for player collision box
  const playerCollider = useRef(new THREE.Box3());
  
  // Track frame time for consistent checks
  const lastCollisionCheck = useRef(Date.now());
  
  // Update player collider position
  useEffect(() => {
    // Update collision box position based on player position
    const [x, y, z] = position;
    
    playerCollider.current.min.set(x - 0.5, y - 1, z - 0.5);
    playerCollider.current.max.set(x + 0.5, y + 1, z + 0.5);
  }, [position]);
  
  // Collision detection system
  useFrame(() => {
    // Skip if game is not in gameplay mode or no zone data
    if (gamePhase !== 'gameplay' || !currentZoneData) {
      return;
    }
    
    // Only check collisions every 100ms to avoid performance issues
    const now = Date.now();
    if (now - lastCollisionCheck.current < 100) {
      return;
    }
    lastCollisionCheck.current = now;
    
    // Check for echo collisions
    for (const echo of echoes) {
      const [echoX, echoY, echoZ] = echo.position;
      
      // Simple distance-based collision
      const distance = Math.sqrt(
        Math.pow(position[0] - echoX, 2) + 
        Math.pow(position[2] - echoZ, 2)
      );
      
      // If player is close to an echo, log it (would trigger interaction in full game)
      if (distance < 2) {
        console.log(`Player near Echo: ${echo.name}`);
        
        // In a full game, we would handle interaction here
        // For now, just log
      }
    }
    
    // Check for zone boundaries
    const { boundaries } = currentZoneData;
    const [x, y, z] = position;
    
    if (x <= boundaries.minX + 1 || x >= boundaries.maxX - 1 || 
        z <= boundaries.minZ + 1 || z >= boundaries.maxZ - 1) {
      console.log('Player near zone boundary');
    }
  });
  
  return null;
}
