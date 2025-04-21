import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { Controls } from '@/App';

interface BabylonPlayerProps {
  scene: BABYLON.Scene;
}

export function BabylonPlayer({ scene }: BabylonPlayerProps) {
  const meshRef = useRef<BABYLON.Mesh | null>(null);
  const { position, updatePosition } = useCharacter();
  const { gamePhase, inCombat } = useGameState();
  
  // Track movement keys pressed
  const keysPressed = useRef({
    [Controls.forward]: false,
    [Controls.backward]: false,
    [Controls.left]: false,
    [Controls.right]: false,
  });
  
  useEffect(() => {
    if (!scene) return;
    
    // Create player mesh if it doesn't exist
    if (!meshRef.current) {
      // Player body
      const playerBody = BABYLON.MeshBuilder.CreateBox(
        "playerBody", 
        { width: 1, height: 1.5, depth: 1 }, 
        scene
      );
      
      // Player head
      const playerHead = BABYLON.MeshBuilder.CreateSphere(
        "playerHead",
        { diameter: 0.7 },
        scene
      );
      playerHead.position.y = 1;
      playerHead.parent = playerBody;
      
      // Material for player
      const playerMaterial = new BABYLON.StandardMaterial("playerMaterial", scene);
      playerMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
      playerBody.material = playerMaterial;
      
      const headMaterial = new BABYLON.StandardMaterial("headMaterial", scene);
      headMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.6, 0.5);
      playerHead.material = headMaterial;
      
      // Set initial position from character state
      playerBody.position = new BABYLON.Vector3(position[0], position[1], position[2]);
      
      // Add physics impostor
      playerBody.physicsImpostor = new BABYLON.PhysicsImpostor(
        playerBody,
        BABYLON.PhysicsImpostor.BoxImpostor,
        { mass: 1, restitution: 0.2, friction: 0.5 },
        scene
      );
      
      // Store reference
      meshRef.current = playerBody;
    }
    
    // Setup keyboard controls
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current[Controls.forward] = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current[Controls.backward] = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current[Controls.left] = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current[Controls.right] = true;
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          keysPressed.current[Controls.forward] = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keysPressed.current[Controls.backward] = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keysPressed.current[Controls.left] = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keysPressed.current[Controls.right] = false;
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Movement in the render loop
    const movementObserver = scene.onBeforeRenderObservable.add(() => {
      if (!meshRef.current || gamePhase !== 'gameplay' || inCombat) return;
      
      const mesh = meshRef.current;
      const moveSpeed = 0.1;
      let moved = false;
      
      // Calculate movement direction
      const movement = new BABYLON.Vector3(0, 0, 0);
      
      if (keysPressed.current[Controls.forward]) {
        movement.z += moveSpeed;
        moved = true;
      }
      if (keysPressed.current[Controls.backward]) {
        movement.z -= moveSpeed;
        moved = true;
      }
      if (keysPressed.current[Controls.left]) {
        movement.x -= moveSpeed;
        moved = true;
      }
      if (keysPressed.current[Controls.right]) {
        movement.x += moveSpeed;
        moved = true;
      }
      
      // Apply movement
      if (moved) {
        mesh.position.addInPlace(movement);
        
        // Update character position in the store
        updatePosition([mesh.position.x, mesh.position.y, mesh.position.z]);
      }
    });
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      scene.onBeforeRenderObservable.remove(movementObserver);
    };
  }, [scene, gamePhase]);
  
  // Update mesh position when position in store changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position = new BABYLON.Vector3(
        position[0],
        position[1],
        position[2]
      );
    }
  }, [position]);
  
  // Nothing to render - this is purely for logic
  return null;
}